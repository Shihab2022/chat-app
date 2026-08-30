import { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.sql(`
    ALTER TABLE chat_groups
      ADD COLUMN IF NOT EXISTS img TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'public'
  `);

  pgm.sql(`
    ALTER TABLE messages
      ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP DEFAULT NULL
  `);

  pgm.sql(`
    CREATE TABLE IF NOT EXISTS conversation_preferences (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      peer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      group_id INTEGER REFERENCES chat_groups(id) ON DELETE CASCADE,
      is_favourite BOOLEAN DEFAULT FALSE,
      is_archived BOOLEAN DEFAULT FALSE,
      is_pinned BOOLEAN DEFAULT FALSE,
      is_muted BOOLEAN DEFAULT FALSE,
      last_read_at TIMESTAMP DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT conversation_preferences_target_check CHECK (
        (peer_id IS NOT NULL AND group_id IS NULL)
        OR (peer_id IS NULL AND group_id IS NOT NULL)
      )
    )
  `);

  pgm.sql(`
    CREATE UNIQUE INDEX IF NOT EXISTS conversation_preferences_user_peer_unique
      ON conversation_preferences (user_id, peer_id)
      WHERE peer_id IS NOT NULL
  `);

  pgm.sql(`
    CREATE UNIQUE INDEX IF NOT EXISTS conversation_preferences_user_group_unique
      ON conversation_preferences (user_id, group_id)
      WHERE group_id IS NOT NULL
  `);

  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_conversation_preferences_user_id
      ON conversation_preferences (user_id)
  `);

  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_messages_expires_at
      ON messages (expires_at)
      WHERE expires_at IS NOT NULL
  `);
}

export function down(pgm: MigrationBuilder): void {
  pgm.sql('DROP INDEX IF EXISTS idx_messages_expires_at');
  pgm.sql('DROP INDEX IF EXISTS idx_conversation_preferences_user_id');
  pgm.sql('DROP INDEX IF EXISTS conversation_preferences_user_group_unique');
  pgm.sql('DROP INDEX IF EXISTS conversation_preferences_user_peer_unique');
  pgm.sql('DROP TABLE IF EXISTS conversation_preferences');
  pgm.sql('ALTER TABLE messages DROP COLUMN IF EXISTS expires_at');
  pgm.sql(`
    ALTER TABLE chat_groups
      DROP COLUMN IF EXISTS visibility,
      DROP COLUMN IF EXISTS img
  `);
}
