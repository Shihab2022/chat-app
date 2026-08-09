import { runMigrations } from '../utils/migrate';
import { pool } from '../utils/pg';

async function executeMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    await runMigrations();
    console.log('✅ Migrations applied successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1); // Exit with failure code so Vercel stops deployment
  } finally {
    await pool.end(); // Close database connection so the build process doesn't hang
  }
}

executeMigrations();
