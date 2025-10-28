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
export const PASSWORD_NOT_MATCH = 'Your password does not match';
export const ALL_FIELDS_REQUIRED = 'All fields are required !!';
export const EMAIL_ALREADY_EXISTS = 'Email already exists';
export const TOKEN_IS_REQUIRED = 'Token is required !!';
export const USER_REGISTRATION_FAILED = 'User registration failed.';
export const USER_NOT_FOUND = 'User is not found !';
export const USER_INACTIVE = 'User is inactive !';
export const INVALID_PIN = 'Invalid pin';
export const INVALID_TOKEN = 'Invalid token';
export const EMAIL_IS_REQUIRED = 'Email is required !!';
