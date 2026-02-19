/* =====================================================
 * Contact Model - Hỗ trợ MySQL + JSON fallback
 * ===================================================== */

const { pool, jsonDB, isMySQL } = require('../config/db');
const { readJSON, writeJSON, DB_FILES } = jsonDB;

const Contact = {
    async create(data) {
        const { name, email, subject, message } = data;

        if (isMySQL()) {
            const [result] = await pool().query(
                'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
                [name, email, subject || null, message]
            );
            return { id: result.insertId, ...data, created_at: new Date().toISOString() };
        }

        const list = readJSON(DB_FILES.contacts);
        const newItem = {
            id: list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1,
            name, email, subject: subject || null, message,
            created_at: new Date().toISOString()
        };
        list.push(newItem);
        writeJSON(DB_FILES.contacts, list);
        return newItem;
    },

    async getAll(limit = 50, offset = 0) {
        if (isMySQL()) {
            const [rows] = await pool().query(
                'SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );
            return rows;
        }
        const list = readJSON(DB_FILES.contacts);
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return list.slice(offset, offset + limit);
    },

    async delete(id) {
        if (isMySQL()) {
            const [result] = await pool().query('DELETE FROM contacts WHERE id = ?', [id]);
            return result.affectedRows > 0;
        }
        const list = readJSON(DB_FILES.contacts);
        const index = list.findIndex(c => c.id === Number(id));
        if (index === -1) return false;
        list.splice(index, 1);
        writeJSON(DB_FILES.contacts, list);
        return true;
    }
};

module.exports = Contact;
