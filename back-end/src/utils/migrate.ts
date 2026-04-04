// src/migrate.ts
import runner from 'node-pg-migrate';
import config from '../app/config';

export async function runMigrations() {
  try {
    await runner({
      databaseUrl: `postgres://${config.pg_info.pg_db_user}:${process.env.PG_DB_PASSWORD}@${config.pg_info.pg_db_host}:${config.pg_info.pg_db_port}/${process.env.PG_DB}`,
      dir: './src/migrations',
      direction: 'up',
      migrationsTable: 'pgmigrations',
      verbose: true,
    });
    console.log('Migrations completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}
