CREATE TABLE users (
    id SERIAL PRIMARY KEY,               -- Auto-incrementing unique ID for each user
    username VARCHAR(50) NOT NULL,       -- Username, required, max length of 50 characters
    email VARCHAR(100) UNIQUE NOT NULL,  -- Email, required and must be unique
    password VARCHAR(255) NOT NULL,      -- Password, required
    first_name VARCHAR(50),              -- Optional first name
    last_name VARCHAR(50),               -- Optional last name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the user was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the user was last updated
    is_active BOOLEAN DEFAULT TRUE       -- Active status, defaults to true
);