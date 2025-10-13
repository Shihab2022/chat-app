import { passwordMinLength, userStatus } from '../../../constant';
import { createToken } from '../../../utils/auth';
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
  return result;
};
const acceptInvite = async (payload: TUser) => {
  console.log({ payload });
  // const { email, password, userName, name } = payload;
  // if (!name || !email || !password) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'All fields are required !!');
  // }

  // if (password.length < passwordMinLength) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     `Password must be at min ${passwordMinLength} characters`,
  //   );
  // }
  // const user = await User.findOne({ email });

  // if (!!user) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'Email already exists');
  // }
  // const usersInfo = {
  //   name: `${userName} ${name}`,
  //   email,
  //   password,
  //   status: userStatus?.ACTIVE,
  // };
  // const result = (await User.create(usersInfo)).isSelected('-password');
  return payload;
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
  const { userName, email } = payload;

  const user = await User.findOne({ $or: [{ userName }, { email }] });
  if (!user) {
    throw new AppError(404, 'User is not found !');
  }
  const hashPassword = await bcrypt.hash(
    payload.password as string,
    Number(config.bcrypt_salt_rounds),
  );
  await User.findOneAndUpdate(
    { $or: [{ userName }, { email }] },
    { password: hashPassword },
  );

  return null;
};
const checkAuth = async (payload: Partial<TUser>) => {
  return payload;
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
    subject: 'New Organization signed up',
    text: 'Unlock profitable growth with our AI based location intelligence platform...',
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

export const UserServices = {
  createUserIntoDB,
  LoginUserIntoDB,
  forgetPassword,
  checkAuth,
  inviteUser,
  acceptInvite,
};
