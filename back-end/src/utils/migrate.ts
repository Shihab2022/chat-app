import fs from 'fs';
import path from 'path';
import runner from 'node-pg-migrate';
import config from '../app/config';

export async function runMigrations() {
  if (!config.database_url) {
    throw new Error(
      'Database configuration is missing. Set DATABASE_URL or the PG_DB_* variables.',
    );
  }

  const compiledMigrationsPath = path.resolve(__dirname, '../migrations');
  const sourceMigrationsPath = path.resolve(process.cwd(), 'src/migrations');
  const migrationsPath = fs.existsSync(compiledMigrationsPath)
    ? compiledMigrationsPath
    : sourceMigrationsPath;

  await runner({
    databaseUrl: config.database_url,
    dir: migrationsPath,
    direction: 'up',
    migrationsTable: 'pgmigrations',
    verbose: true,
  });

  console.log('Migrations completed successfully');
}
