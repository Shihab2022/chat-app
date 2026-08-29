import { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS group_invitations (
      id SERIAL PRIMARY KEY,
      group_id INTEGER NOT NULL REFERENCES chat_groups(id) ON DELETE CASCADE,
      email VARCHAR(255) NOT NULL,
      invited_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      accepted_at TIMESTAMP DEFAULT NULL,
      UNIQUE (group_id, email)
    )
  `);
  pgm.sql('CREATE INDEX IF NOT EXISTS idx_group_invitations_email ON group_invitations (email, status)');
}

export function down(pgm: MigrationBuilder): void {
  pgm.sql('DROP INDEX IF EXISTS idx_group_invitations_email');
  pgm.sql('DROP TABLE IF EXISTS group_invitations');
}
