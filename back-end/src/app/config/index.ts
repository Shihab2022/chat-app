import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const pgPassword = process.env.PG_DB_PASS || process.env.PG_DB_PASSWORD;
const pgDatabase = process.env.PG_DB_NAME || process.env.PG_DB;
const databaseUrl =
  process.env.DATABASE_URL ||
  (process.env.PG_DB_USER && pgPassword && process.env.PG_DB_HOST && pgDatabase
    ? `postgres://${encodeURIComponent(process.env.PG_DB_USER)}:${encodeURIComponent(
        pgPassword,
      )}@${process.env.PG_DB_HOST}:${process.env.PG_DB_PORT || 5432}/${pgDatabase}`
    : undefined);

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: databaseUrl,
  front_end_base_url: process.env.FRONT_END_BASE_URL,
  back_end_base_url: process.env.BACK_END_BASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT,
  //   default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  //   jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN,
  invite_secret: process.env.INVITE_SECRET,
  invite_expire_in: process.env.INVITE_EXPIRES_IN,
  forget_pass_expire_in: process.env.FORGET_PASS_ACCESS_EXPIRES_IN,
  //   jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRES_IN,
  pg_info: {
    pg_db_user: process.env.PG_DB_USER,
    pg_db_host: process.env.PG_DB_HOST,
    pg_db_name: process.env.PG_DB_NAME || process.env.PG_DB,
    pg_db_pass: pgPassword,
    pg_db_port: process.env.PG_DB_PORT
      ? Number(process.env.PG_DB_PORT)
      : undefined,
  },
  cloudinary: {
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  smtp: {
    user_name: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },
};
