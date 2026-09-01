-- Call log table for live audio/video calling analytics.
-- Logs every attempt: who called whom, outcome, and duration.
CREATE TABLE IF NOT EXISTS call_logs (
    id SERIAL PRIMARY KEY,

    caller_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,

    call_type VARCHAR(10) NOT NULL DEFAULT 'video'
        CHECK (call_type IN ('audio', 'video')),

    -- received = attempt logged / delivered to callee (still ringing or just accepted)
    -- rejected = callee explicitly tapped Reject
    -- missed   = callee never answered (timeout, offline, or caller hung up while ringing)
    -- completed= call connected and was later hung up
    call_status VARCHAR(10) NOT NULL DEFAULT 'received'
        CHECK (call_status IN ('received', 'rejected', 'missed', 'completed')),

    start_time TIMESTAMP DEFAULT NULL,
    end_time TIMESTAMP DEFAULT NULL,
    duration_seconds INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_call_caller
        FOREIGN KEY (caller_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_call_receiver
        FOREIGN KEY (receiver_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_call_logs_caller_id ON call_logs (caller_id);
CREATE INDEX idx_call_logs_receiver_id ON call_logs (receiver_id);
CREATE INDEX idx_call_logs_status ON call_logs (call_status);
CREATE INDEX idx_call_logs_created_at ON call_logs (created_at DESC);
