import type { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.sql(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT '',
      ADD COLUMN IF NOT EXISTS username VARCHAR(100) DEFAULT '',
      ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT '',
      ADD COLUMN IF NOT EXISTS about TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR(50) DEFAULT '',
      ADD COLUMN IF NOT EXISTS website VARCHAR(255) DEFAULT '',
      ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'light',
      ADD COLUMN IF NOT EXISTS font_size VARCHAR(20) DEFAULT 'default',
      ADD COLUMN IF NOT EXISTS compact_list BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS wallpaper_id VARCHAR(100) DEFAULT 'default',
      ADD COLUMN IF NOT EXISTS wallpaper_category VARCHAR(50) DEFAULT 'all',
      ADD COLUMN IF NOT EXISTS disappearing_messages VARCHAR(20) DEFAULT '7d'
  `);
}

export function down(pgm: MigrationBuilder): void {
  pgm.sql(`
    ALTER TABLE users
      DROP COLUMN IF EXISTS disappearing_messages,
      DROP COLUMN IF EXISTS wallpaper_category,
      DROP COLUMN IF EXISTS wallpaper_id,
      DROP COLUMN IF EXISTS compact_list,
      DROP COLUMN IF EXISTS font_size,
      DROP COLUMN IF EXISTS theme,
      DROP COLUMN IF EXISTS website,
      DROP COLUMN IF EXISTS date_of_birth,
      DROP COLUMN IF EXISTS about,
      DROP COLUMN IF EXISTS country,
      DROP COLUMN IF EXISTS username,
      DROP COLUMN IF EXISTS phone
  `);
}
