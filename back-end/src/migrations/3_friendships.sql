CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'PENDING',
    message VARCHAR(255) NOT NULL,
    invite_token VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invite_sender
     FOREIGN KEY (sender_id) REFERENCES users(id)
    ON DELETE CASCADE
);