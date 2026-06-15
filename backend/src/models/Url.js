const db = require('../config/db');

exports.create = async ({ originalUrl, shortCode, userId }) => {
    const result = await db.query(
        `INSERT INTO urls (original_url, short_code, user_id)
         VALUES ($1, $2, $3)
         RETURNING id, original_url, short_code, click_count, user_id, created_at`,
        [originalUrl, shortCode, userId]
    );

    return result.rows[0];
};

exports.findByUserId = async (userId) => {
    const result = await db.query(
        `SELECT id, original_url, short_code, click_count, user_id, created_at
         FROM urls
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};

exports.findById = async (id) => {
    const result = await db.query(
        `SELECT id, original_url, short_code, click_count, user_id, created_at
         FROM urls
         WHERE id = $1`,
        [id]
    );

    return result.rowCount > 0 ? result.rows[0] : null;
};

exports.findOne = async (condition) => {
    if (condition && condition.shortCode) {
        const result = await db.query(
            `SELECT id, original_url, short_code, click_count, user_id, created_at
             FROM urls
             WHERE short_code = $1`,
            [condition.shortCode]
        );
        return result.rowCount > 0 ? result.rows[0] : null;
    }

    return null;
};

exports.deleteById = async (id) => {
    await db.query('DELETE FROM urls WHERE id = $1', [id]);
};

exports.incrementClickCount = async (id) => {
    const result = await db.query(
        `UPDATE urls
         SET click_count = click_count + 1
         WHERE id = $1
         RETURNING id, original_url, short_code, click_count, user_id, created_at`,
        [id]
    );

    return result.rowCount > 0 ? result.rows[0] : null;
};
