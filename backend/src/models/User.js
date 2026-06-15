const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.findOne = async (condition, options = {}) => {
    if (!condition || !condition.email) {
        return null;
    }

    const result = await db.query(
        'SELECT id, name, email, password, created_at FROM users WHERE email = $1',
        [condition.email]
    );

    if (result.rowCount === 0) {
        return null;
    }

    const user = result.rows[0];

    if (!options.includePassword) {
        delete user.password;
    }

    return user;
};

exports.findById = async (id) => {
    const result = await db.query(
        'SELECT id, name, email, created_at FROM users WHERE id = $1',
        [id]
    );

    return result.rowCount > 0 ? result.rows[0] : null;
};

exports.create = async ({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [name, email, hashedPassword]
    );

    return result.rows[0];
};

exports.matchPassword = async (user, enteredPassword) => {
    if (!user || !user.password) {
        return false;
    }
    return await bcrypt.compare(enteredPassword, user.password);
};
