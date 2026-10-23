import { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.createTable('call_logs', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    caller_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    receiver_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    call_type: {
      type: 'varchar(10)',
      notNull: true,
      default: 'video',
    },
    call_status: {
      type: 'varchar(10)',
      notNull: true,
      default: 'received',
    },
    start_time: { type: 'timestamp' },
    end_time: { type: 'timestamp' },
    duration_seconds: { type: 'integer', default: 0 },
    created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
  });
  pgm.addConstraint('call_logs', 'call_logs_call_type_check', {
    check: "call_type IN ('audio', 'video')",
  });
  pgm.addConstraint('call_logs', 'call_logs_call_status_check', {
    check: "call_status IN ('received', 'rejected', 'missed', 'completed')",
  });
  pgm.createIndex('call_logs', 'caller_id');
  pgm.createIndex('call_logs', 'receiver_id');
  pgm.createIndex('call_logs', 'call_status');
  pgm.createIndex('call_logs', 'created_at');
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropTable('call_logs');
}
