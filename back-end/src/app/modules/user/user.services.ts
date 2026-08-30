/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  emailSenderMessages,
  FriendshipStatus,
  passwordMinLength,
  userServiceMessages,
  userStatus,
  authorizationError,
} from '../../../constant';
import { createToken, jwtVerify } from '../../../utils/auth';
import config from '../../config';
import AppError from '../../error/appError';
import { TInviteUser, TUser } from './user.interface';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import transporter from '../../../utils/nodemailer';
import { InviteTemplate } from '../../../templates/inviteUser';
import path from 'path';
import { Secret } from 'jsonwebtoken';
import { ForgotPasswordTemplate } from '../../../templates/forgotPassword';
import { ConfirmAccountTemplate } from '../../../templates/confirmAccount';
import { pool } from '../../../utils/pg';

const imagePath = path.resolve(__dirname, '../../../assets/logo.png');
const attachments = [
  {
    filename: 'logo-light.png',
    path: imagePath,
    cid: 'logoImage',
  },
];

const createUserIntoDB = async (payload: TUser) => {
  const { email, password, userName, name } = payload;
  if (!name || !email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.ALL_FIELDS_REQUIRED,
    );
  }

  if (password.length < passwordMinLength) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.PASSWORD_LENGTH_ERROR,
    );
  }

  // Check existing user
  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email],
  );
  if (existingUser.rows.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.EMAIL_ALREADY_EXISTS,
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const fullName = `${userName} ${name}`;

  // Insert user
  const insertQuery = `
    INSERT INTO users (name, email, password, status)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email
  `;

  const result = await pool.query(insertQuery, [
    fullName,
    email,
    hashedPassword,
    userStatus?.ACTIVE,
  ]);

  const createdUser = result.rows[0];
  // JWT
  const jwtPayload = {
    userId: createdUser.id,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as number | undefined,
  );

  // Email
  const notifyMsg = {
    to: [email],
    from: emailSenderMessages.FROM_JOIN_EMAIL,
    subject: emailSenderMessages.WELCOME_EMAIL_SUBJECT,
    text: emailSenderMessages.CONFIRM_EMAIL_MESSAGE,
    html: ConfirmAccountTemplate(
      createdUser.name,
      `${config?.front_end_base_url}/confirm?token=${token}`,
      config?.front_end_base_url as string,
    ),
    attachments,
  };

  await transporter.sendMail(notifyMsg);

  return token;
};

const acceptInvite = async (payload: {
  token: string;
  firstname: string;
  lastname: string;
  password: string;
}) => {
  const { token, firstname, lastname, password } = payload;

  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.TOKEN_IS_REQUIRED,
    );
  }

  let decoded;
  try {
    decoded = jwtVerify(token, config.jwt_access_secret as Secret);
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  const { userId, email, message } = decoded as {
    userId: number;
    email: string;
    message: string;
  };

  if (!firstname || !email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.ALL_FIELDS_REQUIRED,
    );
  }

  if (password.length < passwordMinLength) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.PASSWORD_LENGTH_ERROR,
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [normalizedEmail],
  );

  if (existingUser.rows.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.EMAIL_ALREADY_EXISTS,
    );
  }

  const inviterQuery = await pool.query(
    `SELECT id, name, email FROM users WHERE id = $1 LIMIT 1`,
    [userId],
  );
  const inviter = inviterQuery.rows[0];

  if (!inviter) {
    throw new AppError(httpStatus.NOT_FOUND, userServiceMessages.USER_NOT_FOUND);
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const fullName = `${firstname} ${lastname}`;

  const insertUserQuery = `
    INSERT INTO users (name, email, password, status, is_account_verified)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, role
  `;

  const userResult = await pool.query(insertUserQuery, [
    fullName,
    normalizedEmail,
    hashedPassword,
    userStatus?.ACTIVE,
    true,
  ]);

  const registerUser = userResult.rows[0];

  if (!registerUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      userServiceMessages.USER_REGISTRATION_FAILED,
    );
  }

  await pool.query(
    `
      UPDATE friendships
      SET invite_status = $1,
          receiver_id = $2,
          receiver_email = $3,
          is_blocked = false,
          blocked_by = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE sender_id = $4 AND receiver_email = $3
      RETURNING *
    `,
    [
      FriendshipStatus.ACCEPTED,
      registerUser.id,
      normalizedEmail,
      userId,
    ],
  );

  const reverseInviteToken = createToken(
    { userId: registerUser.id, email: inviter.email, message },
    config.jwt_access_secret as string,
    config.invite_expire_in as number | undefined,
  );

  await pool.query(
    `
      INSERT INTO friendships (sender_id, receiver_id, receiver_email, invite_status, message, invite_token, is_blocked, is_deleted)
      VALUES ($1, $2, $3, $4, $5, $6, false, false)
      ON CONFLICT (receiver_email) DO UPDATE
      SET sender_id = EXCLUDED.sender_id,
          receiver_id = EXCLUDED.receiver_id,
          invite_status = EXCLUDED.invite_status,
          message = EXCLUDED.message,
          is_blocked = false,
          blocked_by = NULL,
          updated_at = CURRENT_TIMESTAMP
    `,
    [
      registerUser.id,
      userId,
      inviter.email,
      FriendshipStatus.ACCEPTED,
      message || 'Accepted friend request',
      reverseInviteToken,
    ],
  );

  const messageQuery = `
    INSERT INTO messages (text, sender_id, receiver_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const messageResult = await pool.query(messageQuery, [
    message,
    userId,
    registerUser.id,
  ]);

  const mess = messageResult.rows[0];

  const jwtPayload = {
    userId: registerUser.id,
    role: registerUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as number | undefined,
  );

  return {
    data: registerUser,
    accessToken,
    mess: [mess],
  };
};

const LoginUserIntoDB = async (payload: Partial<TUser>) => {
  const { email } = payload;
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );

  const user = result.rows[0];
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      userServiceMessages.USER_NOT_FOUND,
    );
  }
  if (user?.status === userStatus?.INACTIVE) {
    throw new AppError(httpStatus.LOCKED, userServiceMessages.USER_INACTIVE);
  }
  if (user?.isAccountVerified === false) {
    throw new AppError(httpStatus.LOCKED, userServiceMessages.NOT_VERIFIED);
  }
  const isPassMatch = await bcrypt.compare(
    payload?.password as string,
    user.password,
  );
  if (!isPassMatch) {
    throw new AppError(404, userServiceMessages.PASSWORD_NOT_MATCH);
  }
  const { id, role } = user;
  const jwtPayload = {
    userId: id,
    role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as number | undefined,
  );
  const { password, ...newData } = user;
  return { data: newData, accessToken };
};

const forgetPassword = async (payload: Partial<TUser>) => {
  const { email } = payload;

  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );

  const user = result.rows[0];
  if (!user) {
    throw new AppError(404, userServiceMessages.USER_NOT_FOUND);
  }
  const { id } = user;
  const jwtPayload = {
    userId: id,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.forget_pass_expire_in as number | undefined,
  );
  const pin = Math.floor(100000 + Math.random() * 900000);
  user.verifiedCode = pin;
  await user.save();
  const notifyMsg = {
    to: email as string,
    from: emailSenderMessages.FROM_JOIN_EMAIL,
    subject: emailSenderMessages.FORGET_PASSWORD_SUBJECT,
    text: emailSenderMessages.FORGET_PASSWORD_MESSAGE,
    html: ForgotPasswordTemplate(
      user?.name as string,
      `${config?.front_end_base_url}/update-password?token=${token}` as string,
      config?.front_end_base_url as string,
      String(pin),
    ),
    attachments,
  };

  await transporter.sendMail(notifyMsg);
  return true;
};

const updatePassword = async (payload: {
  token: string;
  password: string;
  pin: string;
}) => {
  const { token, password, pin } = payload;

  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.TOKEN_IS_REQUIRED,
    );
  }

  let decoded;
  try {
    decoded = jwtVerify(token, config.jwt_access_secret as Secret);
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  const { userId } = decoded as { userId: number };

  if (!userId || !password || !pin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.ALL_FIELDS_REQUIRED,
    );
  }

  const result = await pool.query(
    `SELECT id, verified_code FROM users WHERE id = $1`,
    [userId],
  );

  const user = result.rows[0];

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      userServiceMessages.USER_NOT_FOUND,
    );
  }

  if (user.verified_code !== Number(pin)) {
    throw new AppError(httpStatus.BAD_REQUEST, userServiceMessages.INVALID_PIN);
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  await pool.query(
    `
    UPDATE users
    SET password = $1,
        verified_code = NULL,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    `,
    [hashedPassword, userId],
  );

  return true;
};

const checkAuth = async (payload: { token: string }) => {
  const { token } = payload;

  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.TOKEN_IS_REQUIRED,
    );
  }

  const { userId } = jwtVerify(token, config.jwt_access_secret as Secret);
  if (!userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      userServiceMessages.INVALID_TOKEN,
    );
  }

  const result = await pool.query(
    `
    SELECT 
      id,
      name,
      email,
      img,
      role,
      status,
      is_account_verified,
      is_google_login,
      bio,
      COALESCE(username, '') as username,
      COALESCE(phone, '') as phone,
      COALESCE(country, '') as country,
      COALESCE(about, '') as about,
      COALESCE(date_of_birth, '') as date_of_birth,
      COALESCE(website, '') as website,
      COALESCE(theme, 'light') as theme,
      COALESCE(font_size, 'default') as font_size,
      COALESCE(compact_list, false) as compact_list,
      COALESCE(wallpaper_id, 'default') as wallpaper_id,
      COALESCE(wallpaper_category, 'all') as wallpaper_category,
      COALESCE(disappearing_messages, '7d') as disappearing_messages,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
    `,
    [userId],
  );

  const user = result.rows[0];

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      userServiceMessages.USER_NOT_FOUND || 'User not found',
    );
  }

  return user;
};

const sendEmail = async (payload: { email: string }) => {
  const { email } = payload;

  if (!email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.EMAIL_IS_REQUIRED,
    );
  }

  const result = await pool.query(
    `SELECT id, name FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );

  const createdUser = result.rows[0];

  if (!createdUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      userServiceMessages.USER_NOT_FOUND || 'User not found',
    );
  }

  const { id, name: storedUserName } = createdUser;

  const jwtPayload = {
    userId: id,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as number | undefined,
  );
  const notifyMsg = {
    to: [email],
    from: emailSenderMessages.FROM_JOIN_EMAIL,
    subject: emailSenderMessages.WELCOME_EMAIL_SUBJECT,
    text: emailSenderMessages.CONFIRM_EMAIL_MESSAGE,
    html: ConfirmAccountTemplate(
      storedUserName as string,
      `${config?.front_end_base_url}/confirm?token=${token}` as string,
      config?.front_end_base_url as string,
    ),
    attachments,
  };

  await transporter.sendMail(notifyMsg);

  return true;
};

const confirmUser = async (payload: { token: string }) => {
  const { token } = payload;

  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.TOKEN_IS_REQUIRED,
    );
  }

  let decoded;
  try {
    decoded = jwtVerify(token, config.jwt_access_secret as Secret);
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  const { userId } = decoded as { userId: number };

  const result = await pool.query(
    `
    UPDATE users
    SET is_account_verified = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id
    `,
    [userId],
  );

  if (result.rows.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return true;
};

const inviteUser = async (payload: TInviteUser, userIInfo: Partial<TUser>) => {
  const { email, message } = payload;
  const { id, name } = userIInfo;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!id) {
    throw new AppError(httpStatus.UNAUTHORIZED, authorizationError.UN_AUTHORIZED);
  }

  if (!normalizedEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, userServiceMessages.EMAIL_IS_REQUIRED);
  }

  const targetUser = await pool.query(
    `SELECT id, email FROM users WHERE email = $1 LIMIT 1`,
    [normalizedEmail],
  );
  const targetUserInfo = targetUser.rows[0];

  if (targetUserInfo && Number(targetUserInfo.id) === Number(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot invite yourself');
  }

  const existingRelation = await pool.query(
    `
      SELECT *
      FROM friendships
      WHERE (
        (sender_id = $1 AND (receiver_email = $2 OR receiver_id = $3))
        OR (sender_id = $3 AND (receiver_email = $4 OR receiver_id = $1))
      )
      LIMIT 1
    `,
    [id, normalizedEmail, targetUserInfo?.id ?? -1, normalizedEmail],
  );

  const existing = existingRelation.rows[0];
  if (existing && !(Number(existing.sender_id) === Number(id) && existing.invite_status === FriendshipStatus.PENDING)) {
    throw new AppError(httpStatus.BAD_REQUEST, userServiceMessages.USER_ALREADY_EXISTS_IN_YOUR_FRIENDS);
  }

  const jwtPayload = {
    userId: id,
    email: normalizedEmail,
    message,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.invite_expire_in as number | undefined,
  );

  const inviteUrl =
    targetUserInfo
      ? `${config?.front_end_base_url}/chat`
      : `${config?.front_end_base_url}/accept-invite?token=${accessToken}`;

  // Existing users must explicitly accept the request; never auto-accept them.
  if (existing) {
    await pool.query(
      `UPDATE friendships
       SET receiver_id = COALESCE(receiver_id, $1), message = $2, invite_token = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [targetUserInfo?.id ?? null, message || '', inviteUrl, existing.id],
    );
  } else {
    await pool.query(
      `INSERT INTO friendships (sender_id, receiver_email, receiver_id, message, invite_token, invite_status, is_blocked, is_deleted)
       VALUES ($1, $2, $3, $4, $5, $6, false, false)`,
      [id, normalizedEmail, targetUserInfo?.id ?? null, message || '', inviteUrl, FriendshipStatus.PENDING],
    );
  }

  let emailSent = false;
  try {
    const fromAddress = config.smtp?.user_name
      ? `"Chatty" <${config.smtp.user_name}>`
      : emailSenderMessages.FROM_JOIN_EMAIL;

    const notifyMsg = {
      to: [normalizedEmail],
      from: fromAddress,
      subject: emailSenderMessages.INVITE_JOIN_SUBJECT,
      text: emailSenderMessages.INVITE_JOIN_MESSAGE,
      html: InviteTemplate(
        (name as string) || 'A friend',
        inviteUrl as string,
        config?.front_end_base_url as string,
      ),
      attachments,
    };

    await transporter.sendMail(notifyMsg);
    emailSent = true;
  } catch (emailError) {
    console.error("Failed to send invite email:", emailError);
  }

  return { ...payload, inviteUrl, emailSent };
};

const updateUserInfo = async (
  payload: {
    name?: string;
    bio?: string;
    img?: string;
    username?: string;
    phone?: string;
    about?: string;
    country?: string;
    website?: string;
    date_of_birth?: string;
    theme?: string;
    font_size?: string;
    compact_list?: boolean;
    wallpaper_id?: string;
    wallpaper_category?: string;
    disappearing_messages?: string;
  },
  userInfo: TUser,
) => {
  const { id } = userInfo;

  // Check user exists
  const userCheck = await pool.query(`SELECT id FROM users WHERE id = $1`, [
    id,
  ]);

  if (userCheck.rows.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      userServiceMessages.USER_NOT_FOUND,
    );
  }

  // Update user with all supported profile & settings fields
  const updateQuery = `
    UPDATE users
    SET 
      name = COALESCE($1, name),
      bio = COALESCE($2, bio),
      img = COALESCE($3, img),
      username = COALESCE($4, username),
      phone = COALESCE($5, phone),
      about = COALESCE($6, about),
      country = COALESCE($7, country),
      website = COALESCE($8, website),
      date_of_birth = COALESCE($9, date_of_birth),
      theme = COALESCE($10, theme),
      font_size = COALESCE($11, font_size),
      compact_list = COALESCE($12, compact_list),
      wallpaper_id = COALESCE($13, wallpaper_id),
      wallpaper_category = COALESCE($14, wallpaper_category),
      disappearing_messages = COALESCE($15, disappearing_messages),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $16
    RETURNING 
      id,
      name,
      email,
      img,
      role,
      status,
      bio,
      COALESCE(username, '') as username,
      COALESCE(phone, '') as phone,
      COALESCE(country, '') as country,
      COALESCE(about, '') as about,
      COALESCE(date_of_birth, '') as date_of_birth,
      COALESCE(website, '') as website,
      COALESCE(theme, 'light') as theme,
      COALESCE(font_size, 'default') as font_size,
      COALESCE(compact_list, false) as compact_list,
      COALESCE(wallpaper_id, 'default') as wallpaper_id,
      COALESCE(wallpaper_category, 'all') as wallpaper_category,
      COALESCE(disappearing_messages, '7d') as disappearing_messages,
      is_account_verified,
      is_google_login,
      created_at,
      updated_at
  `;

  const result = await pool.query(updateQuery, [
    payload.name ?? null,
    payload.bio ?? null,
    payload.img ?? null,
    payload.username ?? null,
    payload.phone ?? null,
    payload.about ?? null,
    payload.country ?? null,
    payload.website ?? null,
    payload.date_of_birth ?? null,
    payload.theme ?? null,
    payload.font_size ?? null,
    payload.compact_list !== undefined ? payload.compact_list : null,
    payload.wallpaper_id ?? null,
    payload.wallpaper_category ?? null,
    payload.disappearing_messages ?? null,
    id,
  ]);

  const updatedUserInfo = result.rows[0];

  return updatedUserInfo;
};

const googleLogin = async (payload: {
  name: string;
  email: string;
  picture: string;
}) => {
  const { email } = payload;
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );

  const user = result.rows[0];
  if (user?.isGoogleLogin) {
    const { id, role } = user;
    const jwtPayload = {
      userId: id,
      role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expire_in as number | undefined,
    );
    const { password, ...newData } = user;
    return { data: newData, accessToken };
  } else if (user && !user?.isGoogleLogin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User exists but is not registered with Google login',
    );
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }
};

const googleRegister = async (payload: {
  name: string;
  email: string;
  picture: string;
}) => {
  const { name, email, picture } = payload;

  if (!email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.EMAIL_IS_REQUIRED,
    );
  }

  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.EMAIL_ALREADY_EXISTS,
    );
  }

  const insertQuery = `
    INSERT INTO users (name, email, img, status, is_google_login, is_account_verified)
    VALUES ($1, $2, $3, $4, TRUE, TRUE)
    RETURNING id, name, email
  `;

  const result = await pool.query(insertQuery, [
    name,
    email,
    picture,
    userStatus?.ACTIVE,
  ]);

  const createdUser = result.rows[0];

  if (!createdUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'User registration failed',
    );
  }

  const jwtPayload = {
    userId: createdUser.id,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as number | undefined,
  );

  return token;
};

const getAllRegisteredUsers = async (payload: Partial<TUser>) => {
  const currentUserId = Number(payload.id);

  if (!currentUserId) {
    throw new AppError(httpStatus.UNAUTHORIZED, authorizationError.UN_AUTHORIZED);
  }

  const { rows } = await pool.query(
    `
      SELECT
        u.id,
        u.name,
        u.email,
        u.img,
        u.bio,
        u.role,
        u.status,
        u.is_account_verified,
        u.is_google_login,
        u.created_at,
        u.updated_at
      FROM users u
      WHERE u.id != $1
      ORDER BY u.name ASC
    `,
    [currentUserId],
  );

  return rows;
};

const getFriends = async (payload: Partial<TUser>) => {
  const currentUserId = Number(payload.id);
  const currentUserEmail = payload.email;

  const { rows } = await pool.query(
    `
      SELECT DISTINCT
        u.id,
        u.name,
        u.email,
        u.img,
        u.bio,
        u.role,
        u.status,
        u.is_account_verified,
        u.is_google_login,
        u.created_at,
        u.updated_at,
        f.id AS friendship_id,
        f.invite_status,
        CASE WHEN f.sender_id = $1 THEN 'outgoing' ELSE 'incoming' END AS request_direction,
        f.is_blocked,
        f.blocked_by,
        f.created_at AS friendship_created_at
      FROM friendships f
      JOIN users u
        ON u.id = CASE
          WHEN f.sender_id = $1 THEN COALESCE(f.receiver_id, (SELECT id FROM users WHERE email = f.receiver_email LIMIT 1))
          ELSE f.sender_id
        END
      WHERE (
        f.sender_id = $1
        OR f.receiver_id = $1
        OR f.receiver_email = $2
      )
      AND f.invite_status IN ($3, $4)
      AND u.id != $1
      ORDER BY u.name ASC
    `,
    [currentUserId, currentUserEmail, FriendshipStatus.ACCEPTED, FriendshipStatus.PENDING],
  );

  return rows;
};

const acceptFriend = async (payload: { friendshipId?: number; userId?: number }, userInfo: Partial<TUser>) => {
  const currentUserId = Number(userInfo.id);
  const friendshipId = payload.friendshipId ? Number(payload.friendshipId) : null;
  const targetUserId = payload.userId ? Number(payload.userId) : null;
  if (!currentUserId || (!friendshipId && !targetUserId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'A friendship or user is required');
  }
  const result = await pool.query(
    `UPDATE friendships f SET invite_status = $1, accepted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE f.invite_status = $2
       AND (f.id = $3 OR ($4 IS NOT NULL AND f.sender_id = $4 AND f.receiver_id = $5))
       AND f.receiver_id = $5
     RETURNING *`,
    [FriendshipStatus.ACCEPTED, FriendshipStatus.PENDING, friendshipId, targetUserId, currentUserId],
  );
  if (!result.rows.length) throw new AppError(httpStatus.NOT_FOUND, 'Pending friend request not found');
  return result.rows[0];
};

const blockUser = async (
  payload: { friendId?: number; userId?: number; targetUserId?: number },
  userInfo: Partial<TUser>,
) => {
  const currentUserId = Number(userInfo.id);
  const targetUserId = Number(payload.friendId ?? payload.userId ?? payload.targetUserId);

  if (!currentUserId || !targetUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'A valid user is required');
  }

  const friendshipRows = await pool.query(
    `
      SELECT *
      FROM friendships
      WHERE (
        (
          sender_id = $1 AND (
            receiver_id = $2 OR receiver_email = (SELECT email FROM users WHERE id = $2)
          )
        )
        OR (
          sender_id = $2 AND (
            receiver_id = $1 OR receiver_email = (SELECT email FROM users WHERE id = $1)
          )
        )
      )
      LIMIT 2
    `,
    [currentUserId, targetUserId],
  );

  if (!friendshipRows.rows.length) {
    const targetEmailRes = await pool.query(`SELECT email FROM users WHERE id = $1`, [targetUserId]);
    const targetEmail = targetEmailRes.rows[0]?.email || '';
    const insertRes = await pool.query(
      `INSERT INTO friendships (sender_id, receiver_id, receiver_email, is_blocked, blocked_by, invite_status)
       VALUES ($1, $2, $3, true, $1, 'REJECTED')
       RETURNING *`,
      [currentUserId, targetUserId, targetEmail],
    );
    return insertRes.rows[0] || { is_blocked: true, friendId: targetUserId };
  }

  const { rows } = await pool.query(
    `
      UPDATE friendships
      SET is_blocked = true,
          blocked_by = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE (
        (
          sender_id = $1 AND (
            receiver_id = $2 OR receiver_email = (SELECT email FROM users WHERE id = $2)
          )
        )
        OR (
          sender_id = $2 AND (
            receiver_id = $1 OR receiver_email = (SELECT email FROM users WHERE id = $1)
          )
        )
      )
      RETURNING *
    `,
    [currentUserId, targetUserId],
  );

  return rows[0] || { is_blocked: true, friendId: targetUserId };
};

const unblockUser = async (
  payload: { friendId?: number; userId?: number; targetUserId?: number },
  userInfo: Partial<TUser>,
) => {
  const currentUserId = Number(userInfo.id);
  const targetUserId = Number(payload.friendId ?? payload.userId ?? payload.targetUserId);

  if (!currentUserId || !targetUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'A valid user is required');
  }

  const { rows } = await pool.query(
    `
      UPDATE friendships
      SET is_blocked = false,
          blocked_by = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE (
        (
          sender_id = $1 AND (
            receiver_id = $2 OR receiver_email = (SELECT email FROM users WHERE id = $2)
          )
        )
        OR (
          sender_id = $2 AND (
            receiver_id = $1 OR receiver_email = (SELECT email FROM users WHERE id = $1)
          )
        )
      )
      RETURNING *
    `,
    [currentUserId, targetUserId],
  );

  return rows[0] || { is_blocked: false, friendId: targetUserId };
};

export const UserServices = {
  createUserIntoDB,
  confirmUser,
  LoginUserIntoDB,
  forgetPassword,
  updatePassword,
  checkAuth,
  sendEmail,
  inviteUser,
  acceptInvite,
  updateUserInfo,
  googleLogin,
  googleRegister,
  getAllRegisteredUsers,
  getFriends,
  blockUser,
  unblockUser,
  acceptFriend,
};
