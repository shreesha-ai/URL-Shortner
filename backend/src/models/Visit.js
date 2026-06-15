const db = require('../config/db');

exports.create = async ({ urlId }) => {
    const result = await db.query(
        `INSERT INTO visits (url_id)
         VALUES ($1)
         RETURNING id, url_id, timestamp`,
        [urlId]
    );

    return result.rows[0];
};

exports.findByUrlId = async (urlId, limit = null) => {
    const query = `
        SELECT id, url_id, timestamp
        FROM visits
        WHERE url_id = $1
        ORDER BY timestamp DESC
        ${limit ? 'LIMIT ' + limit : ''}`;

    const result = await db.query(query, [urlId]);
    return result.rows;
};

exports.deleteByUrlId = async (urlId) => {
    await db.query('DELETE FROM visits WHERE url_id = $1', [urlId]);
};
