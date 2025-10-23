import { passwordMinLength, userStatus } from '../../../constant';
import { createToken, jwtVerify } from '../../../utils/auth';
import { parseHtml } from '../../../utils/common';
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
    throw new AppError(httpStatus.BAD_REQUEST, 'All fields are required !!');
  }

  if (password.length < passwordMinLength) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Password must be at min ${passwordMinLength} characters`,
    );
  }
  const user = await User.findOne({ email });

  if (!!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already exists');
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
    from: 'shihab@gmail.com',
    subject: 'Welcome to Chatty! Confirm your email address',
    text: 'Please confirm your Chatty account. Please click on the confirm button and then login to app.',
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
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is required !!');
  }
  const { userId, email, message } = jwtVerify(
    token,
    config.jwt_access_secret as Secret,
  );
  if (!firstname || !email || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'All fields are required !!');
  }

  if (password.length < passwordMinLength) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Password must be at min ${passwordMinLength} characters`,
    );
  }
  const user = await User.findOne({ email });

  if (!!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already exists');
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
      'User registration failed.',
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
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found !');
  }
  if (user?.status === userStatus?.INACTIVE) {
    throw new AppError(httpStatus.LOCKED, 'User is in active !');
  }
  if (user?.isAccountVerified === false) {
    throw new AppError(httpStatus.LOCKED, 'Account is not verified !');
  }
  const isPassMatch = await bcrypt.compare(
    payload?.password as string,
    user.password,
  );
  if (!isPassMatch) {
    throw new AppError(404, 'Your password is not match');
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
    throw new AppError(404, 'User is not found !');
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
    from: 'shihab@gmail.com',
    subject: 'Forget Your Password',
    text: 'Use this link and code to reset your password. This link and code will expire in 5 minutes',
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
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is required !!');
  }
  const { userId } = jwtVerify(token, config.jwt_access_secret as Secret);
  if (!userId || !password || !pin) {
    throw new AppError(httpStatus.BAD_REQUEST, 'All fields are required !!');
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.verifiedCode !== Number(pin)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid pin');
  }
  user.password = password;
  await user.save();
  return true;
};
const checkAuth = async (payload: { token: string }) => {
  const { token } = payload;
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is required !!');
  }
  const { userId } = jwtVerify(token, config.jwt_access_secret as Secret);
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
  const user = await User.findOne({ _id: userId }).select('-password');
  return user;
};
const sendEmail = async (payload: { email: string }) => {
  const { email } = payload;
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is required !!');
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
    from: 'shihab@gmail.com',
    subject: 'Welcome to Chatty! Confirm your email address',
    text: 'Please confirm your Chatty account. Please click on the confirm button and then login to app.',
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
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is required !!');
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
    from: 'shihab@gmail.com',
    subject: 'Invite to join Chatty',
    text: 'Join Chatty and start chatting with your friends!',
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
const updateUserInfo = async (payload: { token: string }) => {
  const { token } = payload;
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is required !!');
  }
  const { userId } = jwtVerify(token, config.jwt_access_secret as Secret);
  await User.findByIdAndUpdate(userId, { $set: { isAccountVerified: true } });
  return true;
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
};
