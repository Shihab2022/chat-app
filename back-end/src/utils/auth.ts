import jwt from 'jsonwebtoken';
import config from '../app/config';

export const createToken = (
  jwtPayload: any,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret || (config.jwt_access_secret as string), {
    expiresIn,
  });
};
