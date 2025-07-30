import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT,
  //   default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  //   jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN,
  //   jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRES_IN,
  pg_info: {
    pg_db_user: process.env.PG_DB_USER,
    pg_db_host: process.env.PG_DB_HOST,
    pg_db_url: process.env.PG_DB,
    pg_db_pass: process.env.PG_DB_PASSWORD,
    pg_db_port: process.env.PG_DB_PORT,
  },
};
