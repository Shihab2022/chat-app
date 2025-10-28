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
export const userServiceMessages = {
  NOT_VERIFIED: 'Your account is not verified',
  PASSWORD_NOT_MATCH: 'Your password does not match',
  ALL_FIELDS_REQUIRED: 'All fields are required !!',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  TOKEN_IS_REQUIRED: 'Token is required !!',
  USER_REGISTRATION_FAILED: 'User registration failed.',
  USER_NOT_FOUND: 'User is not found !',
  USER_INACTIVE: 'User is inactive !',
  INVALID_PIN: 'Invalid pin',
  INVALID_TOKEN: 'Invalid token',
  EMAIL_IS_REQUIRED: 'Email is required !!',
};

export const emailSenderMessages = {
  FROM_JOIN_EMAIL: 'shihab@gmail.com',
  WELCOME_EMAIL_SUBJECT: 'Welcome to Chatty! Confirm your email address',
  FORGET_PASSWORD_SUBJECT: 'Forget Your Password',
  INVITE_JOIN_SUBJECT: 'Invite to join Chatty',
  INVITE_JOIN_MESSAGE: 'Join Chatty and start chatting with your friends!',
  CONFIRM_EMAIL_MESSAGE:
    'Please confirm your Chatty account. Please click on the confirm button and then login to app.',
  FORGET_PASSWORD_MESSAGE:
    'Use this link and code to reset your password. This link and code will expire in 5 minutes',
};
