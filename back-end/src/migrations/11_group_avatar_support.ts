import { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.sql(`
    ALTER TABLE chat_groups
      ADD COLUMN IF NOT EXISTS img TEXT DEFAULT NULL
  `);
}

export function down(pgm: MigrationBuilder): void {
  pgm.sql(`
    ALTER TABLE chat_groups
      DROP COLUMN IF EXISTS img
  `);
}
