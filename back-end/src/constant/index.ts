export const appName = 'Chat app';
export const corsAllowOrigin = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
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
