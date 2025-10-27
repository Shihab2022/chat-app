import { FriendshipStatus } from '../../../constant';
import { Types } from 'mongoose';

export type TUser = {
  userName: string;
  name: string;
  img?: string;
  email: string;
  password: string;
  status?: string;
  role?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isAccountVerified?: boolean;
  verifiedCode?: number | null;
  bio?: string;
};
export type TInviteUser = {
  email: string;
  message: string;
};

type TFriendshipStatus =
  (typeof FriendshipStatus)[keyof typeof FriendshipStatus];

export interface TFriendship {
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  status: TFriendshipStatus;
}
