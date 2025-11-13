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
  isGoogleLogin?: boolean
};
export type TInviteUser = {
  email: string;
  message: string;
};

type TFriendshipStatus =
  (typeof FriendshipStatus)[keyof typeof FriendshipStatus];

export interface TFriendship {
  user: Types.ObjectId;
  friend: Types.ObjectId;
  status: TFriendshipStatus;
  requestedBy?: Types.ObjectId;
  updateStatusAt?: Date;
  isBlocked?: boolean;
  blockedBy?: Types.ObjectId;
}
