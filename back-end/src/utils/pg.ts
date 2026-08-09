import config from '../app/config';
import { Pool } from 'pg';

export const pool = new Pool({
  user: config.pg_info.pg_db_user,
  host: config.pg_info.pg_db_host,
  database: config.pg_info.pg_db_url,
  password: config.pg_info.pg_db_pass,
  port: config.pg_info.pg_db_port,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
