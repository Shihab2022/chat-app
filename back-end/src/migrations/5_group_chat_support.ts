import type { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.sql(`
    ALTER TABLE friendships
      ADD COLUMN IF NOT EXISTS receiver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP DEFAULT NULL
  `);

  pgm.sql(`
    CREATE TABLE IF NOT EXISTS chat_groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  pgm.sql(`
    CREATE TABLE IF NOT EXISTS group_members (
      id SERIAL PRIMARY KEY,
      group_id INTEGER NOT NULL REFERENCES chat_groups(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role VARCHAR(50) DEFAULT 'member',
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (group_id, user_id)
    )
  `);

  pgm.sql(`
    ALTER TABLE messages
      ALTER COLUMN receiver_id DROP NOT NULL
  `);

  pgm.sql(`
    ALTER TABLE messages
      ADD COLUMN IF NOT EXISTS group_id INTEGER REFERENCES chat_groups(id) ON DELETE CASCADE
  `);

  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_group_members_group_id
      ON group_members (group_id)
  `);

  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_group_members_user_id
      ON group_members (user_id)
  `);

  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_messages_group_id
      ON messages (group_id)
  `);
}

export function down(pgm: MigrationBuilder): void {
  pgm.sql('DROP INDEX IF EXISTS idx_messages_group_id');
  pgm.sql('DROP INDEX IF EXISTS idx_group_members_user_id');
  pgm.sql('DROP INDEX IF EXISTS idx_group_members_group_id');
  pgm.sql('ALTER TABLE messages DROP COLUMN IF EXISTS group_id');
  pgm.sql('DROP TABLE IF EXISTS group_members');
  pgm.sql('DROP TABLE IF EXISTS chat_groups');
  pgm.sql('ALTER TABLE friendships DROP COLUMN IF EXISTS accepted_at');
  pgm.sql('ALTER TABLE friendships DROP COLUMN IF EXISTS receiver_id');
}
