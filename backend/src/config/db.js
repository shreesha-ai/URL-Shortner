const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || process.env.PG_URI ||
    `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'url_shortener'}`;

const pool = new Pool({ connectionString });

const createTables = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS urls (
            id SERIAL PRIMARY KEY,
            original_url TEXT NOT NULL,
            short_code TEXT NOT NULL UNIQUE,
            click_count INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS visits (
            id SERIAL PRIMARY KEY,
            url_id INTEGER NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
};

const connectDB = async () => {
    try {
        await pool.query('SELECT 1');
        await createTables();
        console.log('PostgreSQL Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const query = (text, params) => pool.query(text, params);

module.exports = connectDB;
module.exports.query = query;
