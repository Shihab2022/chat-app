ALTER TABLE friendships 
    ADD COLUMN deleted_by INTEGER,
    ADD COLUMN blocked_by INTEGER,
    ADD COLUMN send_invite BOOLEAN DEFAULT TRUE,
    ADD COLUMN nick_name VARCHAR(100),
    ALTER COLUMN message TYPE VARCHAR(2000),
    ADD CONSTRAINT fk_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_blocked_by FOREIGN KEY (blocked_by) REFERENCES users(id) ON DELETE SET NULL;