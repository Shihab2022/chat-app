import type { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.sql(`
    UPDATE group_members SET role = 'member'
    WHERE role IS NULL OR role NOT IN ('admin', 'member')
  `);
  pgm.sql(`
    ALTER TABLE group_members
      ALTER COLUMN role SET DEFAULT 'member',
      ALTER COLUMN role SET NOT NULL
  `);
  pgm.sql(`
    DO $$ BEGIN
      ALTER TABLE group_members ADD CONSTRAINT group_members_role_check CHECK (role IN ('admin', 'member'));
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
  pgm.sql(`
    UPDATE chat_groups g SET updated_at = CURRENT_TIMESTAMP
    WHERE EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.role = 'admin')
  `);
}

export function down(pgm: MigrationBuilder): void {
  pgm.sql(
    'ALTER TABLE group_members DROP CONSTRAINT IF EXISTS group_members_role_check',
  );
}
