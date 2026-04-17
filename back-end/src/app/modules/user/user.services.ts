import {
  emailSenderMessages,
  FriendshipStatus,
  passwordMinLength,
  userServiceMessages,
  userStatus,
} from '../../../constant';
import { createToken, jwtVerify } from '../../../utils/auth';
import config from '../../config';
import AppError from '../../error/appError';
import { TInviteUser, TUser } from './user.interface';
import bcrypt from 'bcrypt';
import httpStatus from 'http-Status';
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

  // 🔹 Check existing user
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

  // 🔥 Hash password (replacement of mongoose pre-save)
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const fullName = `${userName} ${name}`;

  // 🔹 Insert user
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
  // 🔹 JWT
  const jwtPayload = {
    userId: createdUser.id,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  // 🔹 Email
  const notifyMsg = {
    to: [email],
    from: emailSenderMessages.FROM_JOIN_EMAIL,
    subject: emailSenderMessages.WELCOME_EMAIL_SUBJECT,
    text: emailSenderMessages.CONFIRM_EMAIL_MESSAGE,
    html: ConfirmAccountTemplate(
      createdUser.name,
      `${config?.front_end_base_url}/confirm?token=${token}`,
      config?.front_end_base_url,
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

  // 🔹 Token check
  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.TOKEN_IS_REQUIRED,
    );
  }

  // 🔹 Verify token
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

  // 🔹 Validation
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

  // 🔹 Check existing user
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

  // 🔥 Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const fullName = `${firstname} ${lastname}`;

  // 🔹 Insert user
  const insertUserQuery = `
    INSERT INTO users (name, email, password, status,is_account_verified)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, role
  `;

  const userResult = await pool.query(insertUserQuery, [
    fullName,
    email,
    hashedPassword,
    userStatus?.ACTIVE,
    true,
  ]);
  const updateStatusQuery = `UPDATE friendships
    SET invite_status = $3 WHERE sender_id = $1 AND receiver_email = $2;`;

  await pool.query(updateStatusQuery, [
    userId,
    email,
    FriendshipStatus.ACCEPTED,
  ]);

  const registerUser = userResult.rows[0];

  if (!registerUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      userServiceMessages.USER_REGISTRATION_FAILED,
    );
  }

  // 🔹 Insert message (replacement of MessageServices)
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

  // 🔹 JWT
  const jwtPayload = {
    userId: registerUser.id,
    role: registerUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  // 🔹 Remove password (not selected anyway, but safe)
  const newData = registerUser;

  return {
    data: newData,
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
    config.jwt_access_expire_in as string,
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
    config.forget_pass_expire_in as string,
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
      pin,
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

  // 🔹 Token check
  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.TOKEN_IS_REQUIRED,
    );
  }

  // 🔹 Verify token
  let decoded;
  try {
    decoded = jwtVerify(token, config.jwt_access_secret as Secret);
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  const { userId } = decoded as { userId: number };

  // 🔹 Validation
  if (!userId || !password || !pin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.ALL_FIELDS_REQUIRED,
    );
  }

  // 🔹 Get user
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

  // 🔹 Check PIN
  if (user.verified_code !== Number(pin)) {
    throw new AppError(httpStatus.BAD_REQUEST, userServiceMessages.INVALID_PIN);
  }

  // 🔥 Hash new password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // 🔹 Update password + reset pin
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

  // 🔹 Token check
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

  // 🔹 Get user (excluding password)
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

  // 🔹 Validation
  if (!email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.EMAIL_IS_REQUIRED,
    );
  }

  // 🔹 Find user by email
  const result = await pool.query(
    `SELECT id, name FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );

  const createdUser = result.rows[0];

  // 🔹 Handle not found
  if (!createdUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      userServiceMessages.USER_NOT_FOUND || 'User not found',
    );
  }

  // 🔹 Prepare data (same as mongoose)
  const { id, name: storedUserName } = createdUser;

  const jwtPayload = {
    userId: id,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
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

  // 🔹 Validation
  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.TOKEN_IS_REQUIRED,
    );
  }

  // 🔹 Verify token
  let decoded;
  try {
    decoded = jwtVerify(token, config.jwt_access_secret as Secret);
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  const { userId } = decoded as { userId: number };

  // 🔹 Update user
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

  // 🔹 Check if user exists
  if (result.rows.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return true;
};
const inviteUser = async (payload: TInviteUser, userIInfo: Partial<TUser>) => {
  const { email, message } = payload;
  const { id, role } = userIInfo;

  const jwtPayload = {
    userId: id,
    email,
    message,
  };
  const newUserCheck = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
  );
  const existingUserCheck = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id],
  );
  const newUsers = newUserCheck.rows[0];
  const existingUsers = existingUserCheck.rows[0];
  const checkFriendShipsExits = await pool.query(
    `SELECT *
  FROM friendships
  WHERE
      (sender_id = $1 AND receiver_email = $2)
      OR
      (sender_id = $3 AND receiver_email = $4);`,
    [id, email, newUsers?.id, existingUsers?.email],
  );
  if (checkFriendShipsExits.rows.length === 0) {
    const insertQuery = `INSERT INTO friendships (sender_id, receiver_email, message,invite_token)
  VALUES ($1, $2, $3, $4)`;
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.invite_expire_in as string,
    );
    const inviteUrl =
      newUserCheck.rows.length === 0
        ? (`${config?.front_end_base_url}/accept-invite?token=${accessToken}` as string)
        : (`${config?.front_end_base_url}/chat` as string);
    await pool.query(insertQuery, [id, email, message, inviteUrl]);

    const notifyMsg = {
      to: [email],
      from: emailSenderMessages.FROM_JOIN_EMAIL,
      subject: emailSenderMessages.INVITE_JOIN_SUBJECT,
      text: emailSenderMessages.INVITE_JOIN_MESSAGE,
      html: InviteTemplate(
        userIInfo?.name as string,
        inviteUrl as string,
        config?.front_end_base_url as string,
      ),
      attachments,
    };

    await transporter.sendMail(notifyMsg);
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.USER_ALREADY_EXISTS_IN_YOUR_FRIENDS,
    );
  }

  return payload;
};
const updateUserInfo = async (
  payload: { name: string; bio: string },
  userINfo: TUser,
) => {
  const { name, bio } = payload;
  const { id } = userINfo;

  // 🔹 Check user exists
  const userCheck = await pool.query(`SELECT id FROM users WHERE id = $1`, [
    id,
  ]);

  if (userCheck.rows.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      userServiceMessages.USER_NOT_FOUND,
    );
  }

  // 🔹 Update user
  const updateQuery = `
    UPDATE users
    SET 
      name = $1,
      bio = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING 
      id,
      name,
      email,
      img,
      role,
      status,
      bio,
      is_account_verified,
      is_google_login,
      created_at,
      updated_at
  `;

  const result = await pool.query(updateQuery, [name, bio, id]);

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
      config.jwt_access_expire_in as string,
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

  // 🔹 Validation
  if (!email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.EMAIL_IS_REQUIRED,
    );
  }

  // 🔹 Check existing user
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

  // 🔹 Insert user (Google login → no password)
  const insertQuery = `
    INSERT INTO users (name, email, img, status, is_google_login, is_account_verified)
    VALUES ($1, $2, $3, $4, TRUE, TRUE)
    RETURNING id, name, email
  `;

  const result = await pool.query(insertQuery, [
    name,
    email,
    picture, // mapped to img
    userStatus?.ACTIVE,
  ]);

  const createdUser = result.rows[0];

  if (!createdUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'User registration failed',
    );
  }

  // 🔹 JWT
  const jwtPayload = {
    userId: createdUser.id,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  return token;
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
};
