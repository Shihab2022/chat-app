CREATE TABLE messages (
    id SERIAL PRIMARY KEY,

    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,

    text TEXT,
    image TEXT,

    is_deleted BOOLEAN DEFAULT FALSE,

    reply_id INTEGER DEFAULT NULL,

    reactions JSONB DEFAULT '[]',

    seen BOOLEAN DEFAULT FALSE,
    seen_at TIMESTAMP DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT fk_sender
        FOREIGN KEY (sender_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_receiver
        FOREIGN KEY (receiver_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reply
        FOREIGN KEY (reply_id) REFERENCES messages(id)
        ON DELETE SET NULL
);