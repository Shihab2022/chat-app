import { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.sql(`
    ALTER TABLE messages
      ADD COLUMN IF NOT EXISTS file_url TEXT DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS file_name TEXT DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS file_type VARCHAR(50) DEFAULT NULL
  `);
}

export function down(pgm: MigrationBuilder): void {
  pgm.sql(`
    ALTER TABLE messages
      DROP COLUMN IF EXISTS file_type,
      DROP COLUMN IF EXISTS file_name,
      DROP COLUMN IF EXISTS file_url
  `);
}
