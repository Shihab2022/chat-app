CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255),

    img TEXT DEFAULT '',

    email VARCHAR(255) NOT NULL UNIQUE,

    password TEXT NOT NULL,

    status VARCHAR(50) DEFAULT 'ACTIVE',

    role VARCHAR(50) DEFAULT 'USER',

    verified_code INTEGER DEFAULT NULL,

    bio TEXT DEFAULT '',

    is_account_verified BOOLEAN DEFAULT FALSE,

    is_google_login BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);