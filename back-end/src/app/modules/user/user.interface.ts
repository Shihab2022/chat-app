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
