import {
  emailSenderMessages,
  passwordMinLength,
  userServiceMessages,
  userStatus,
} from '../../../constant';
import { createToken, jwtVerify } from '../../../utils/auth';
import config from '../../config';
import AppError from '../../error/appError';
import { TInviteUser, TUser } from './user.interface';
import { User } from './user.model';
import bcrypt from 'bcrypt';
import httpStatus from 'http-Status';
import transporter from '../../../utils/nodemailer';
import { InviteTemplate } from '../../../templates/inviteUser';
import path from 'path';
import { Secret } from 'jsonwebtoken';
import { MessageServices } from '../message/message.services';
import { ForgotPasswordTemplate } from '../../../templates/forgotPassword';
import { ConfirmAccountTemplate } from '../../../templates/confirmAccount';
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
  const user = await User.findOne({ email });

  if (!!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.EMAIL_ALREADY_EXISTS,
    );
  }
  const usersInfo = {
    name: `${userName} ${name}`,
    email,
    password,
    status: userStatus?.ACTIVE,
  };
  const result = (await User.create(usersInfo)).isSelected('-password');
  const createdUser = await User.findOne({ email });
  const { _id, name: storedUserName } = createdUser as TUser;
  const jwtPayload = {
    userId: _id,
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
  const { userId, email, message } = jwtVerify(
    token,
    config.jwt_access_secret as Secret,
  );
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
  const user = await User.findOne({ email });

  if (!!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.EMAIL_ALREADY_EXISTS,
    );
  }
  const usersInfo = {
    name: `${firstname} ${lastname}`,
    email,
    password,
    status: userStatus?.ACTIVE,
  };
  (await User.create(usersInfo)).isSelected('-password');
  const registerUser = await User.findOne({ email });

  if (!registerUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      userServiceMessages.USER_REGISTRATION_FAILED,
    );
  }

  const mess = await MessageServices.sendMessageIntoDB({
    text: message,
    senderId: userId,
    receiverId: registerUser._id as string,
  });

  const { _id, role } = registerUser as TUser;
  const jwtPayload = {
    userId: _id,
    role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );
  const { password: pass, ...newData } = registerUser.toObject() as TUser;
  return { data: newData, accessToken, mess };
};
const LoginUserIntoDB = async (payload: Partial<TUser>) => {
  const { email } = payload;
  const user = await User.findOne({ email });
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
  const objData: Partial<TUser> = user.toObject();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, role } = user;
  const jwtPayload = {
    userId: _id,
    role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );
  const { password, ...newData } = objData;
  return { data: newData, accessToken };
};
const forgetPassword = async (payload: Partial<TUser>) => {
  const { email } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, userServiceMessages.USER_NOT_FOUND);
  }
  const { _id } = user;
  const jwtPayload = {
    userId: _id,
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
  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.TOKEN_IS_REQUIRED,
    );
  }
  const { userId } = jwtVerify(token, config.jwt_access_secret as Secret);
  if (!userId || !password || !pin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.ALL_FIELDS_REQUIRED,
    );
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      userServiceMessages.USER_NOT_FOUND,
    );
  }
  if (user.verifiedCode !== Number(pin)) {
    throw new AppError(httpStatus.BAD_REQUEST, userServiceMessages.INVALID_PIN);
  }
  user.password = password;
  await user.save();
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
  const user = await User.findOne({ _id: userId }).select('-password');
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
  const createdUser = await User.findOne({ email });
  const { _id, name: storedUserName } = createdUser as TUser;
  const jwtPayload = {
    userId: _id,
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
  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.TOKEN_IS_REQUIRED,
    );
  }
  const { userId } = jwtVerify(token, config.jwt_access_secret as Secret);
  await User.findByIdAndUpdate(userId, { $set: { isAccountVerified: true } });
  return true;
};
const inviteUser = async (payload: TInviteUser, userIInfo: Partial<TUser>) => {
  const { email, message } = payload;
  const { _id, role } = userIInfo;
  const jwtPayload = {
    userId: _id,
    email,
    message,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );
  const notifyMsg = {
    to: [email],
    from: emailSenderMessages.FROM_JOIN_EMAIL,
    subject: emailSenderMessages.INVITE_JOIN_SUBJECT,
    text: emailSenderMessages.INVITE_JOIN_MESSAGE,
    html: InviteTemplate(
      userIInfo?.name as string,
      `${config?.front_end_base_url}/accept-invite?token=${accessToken}` as string,
      config?.front_end_base_url as string,
    ),
    attachments,
  };

  await transporter.sendMail(notifyMsg);
  return payload;
};
const updateUserInfo = async (
  payload: { name: string; bio: string },
  userINfo: TUser,
) => {
  const { name, bio } = payload;
  const { _id } = userINfo;

  const user = await User.findOne({ _id: _id });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      userServiceMessages.USER_NOT_FOUND,
    );
  }
  user.name = name;
  user.bio = bio;
  await user.save();
  const updatedUserInfo = await User.findOne({ _id: _id }).select('-password');
  return updatedUserInfo;
};
const googleLogin = async (payload: {
  name: string;
  email: string;
  picture: string;
}) => {
  const { email } = payload;
  const user = await User.findOne({ email });
  if (user?.isGoogleLogin) {
    const objData: Partial<TUser> = user.toObject();
    const { _id, role } = user;
    const jwtPayload = {
      userId: _id,
      role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expire_in as string,
    );
    const { password, ...newData } = objData;
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
  const user = await User.findOne({ email });

  if (!!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      userServiceMessages.EMAIL_ALREADY_EXISTS,
    );
  }
  const usersInfo = {
    name,
    email,
    picture,
    status: userStatus?.ACTIVE,
  };
  const result = (await User.create(usersInfo)).isSelected('-password');
  const createdUser = await User.findOne({ email });
  const { _id, name: storedUserName } = createdUser as TUser;
  const jwtPayload = {
    userId: _id,
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
