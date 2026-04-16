CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_email VARCHAR(255) NOT NULL UNIQUE,
    invite_status VARCHAR(20) DEFAULT 'PENDING',
    is_blocked BOOLEAN DEFAULT FALSE,
    message VARCHAR(255) NOT NULL,
    invite_token VARCHAR(300) UNIQUE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invite_sender
     FOREIGN KEY (sender_id) REFERENCES users(id)
    ON DELETE CASCADE
);