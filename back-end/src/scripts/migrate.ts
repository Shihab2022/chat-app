import { runMigrations } from '../utils/migrate';
import { pool } from '../utils/pg';

async function executeMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    await runMigrations();
    console.log('✅ Migrations applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

executeMigrations();
