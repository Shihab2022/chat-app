import config from '../app/config';

export const appName = 'Chat app';
export const corsAllowOrigin = {
  origin: [config?.front_end_base_url as string, 'http://localhost:3000'],
  credentials: true,
};

export const passwordMinLength = 5;
export const userStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const userRole = {
  ADMIN: 'admin',
  USER: 'user',
  SUPER_ADMIN: 'super-admin',
};

export const FriendshipStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;
export const NOT_VERIFIED = 'Your account is not verified';
