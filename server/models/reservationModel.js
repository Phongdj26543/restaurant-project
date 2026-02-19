/* =====================================================
 * Reservation Model - Hỗ trợ MySQL + JSON fallback
 * ===================================================== */

const { pool, jsonDB, isMySQL } = require('../config/db');
const { readJSON, writeJSON, DB_FILES } = jsonDB;

const Reservation = {
    async create(data) {
        const { name, phone, email, date, time, guests, note, preOrder } = data;
        const preOrderJSON = preOrder ? JSON.stringify(preOrder) : null;

        if (isMySQL()) {
            const [result] = await pool().query(
                'INSERT INTO reservations (name, phone, email, date, time, guests, note, pre_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, phone, email || null, date, time, guests, note || null, preOrderJSON]
            );
            return { id: result.insertId, ...data, status: 'pending', created_at: new Date().toISOString() };
        }

        // JSON fallback
        const list = readJSON(DB_FILES.reservations);
        const newItem = {
            id: list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1,
            name, phone, email: email || null, date, time,
            guests, note: note || null,
            pre_order: preOrder || null,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        list.push(newItem);
        writeJSON(DB_FILES.reservations, list);
        return newItem;
    },

    async getAll(limit = 50, offset = 0) {
        if (isMySQL()) {
            const [rows] = await pool().query(
                'SELECT * FROM reservations ORDER BY created_at DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );
            return rows;
        }
        const list = readJSON(DB_FILES.reservations);
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return list.slice(offset, offset + limit);
    },

    async getByDate(date) {
        if (isMySQL()) {
            const [rows] = await pool().query(
                'SELECT * FROM reservations WHERE date = ? ORDER BY time',
                [date]
            );
            return rows;
        }
        return readJSON(DB_FILES.reservations)
            .filter(r => r.date === date)
            .sort((a, b) => a.time.localeCompare(b.time));
    },

    async updateStatus(id, status) {
        if (isMySQL()) {
            const [result] = await pool().query(
                'UPDATE reservations SET status = ? WHERE id = ?',
                [status, id]
            );
            return result.affectedRows > 0;
        }
        const list = readJSON(DB_FILES.reservations);
        const item = list.find(r => r.id === Number(id));
        if (!item) return false;
        item.status = status;
        writeJSON(DB_FILES.reservations, list);
        return true;
    },

    async delete(id) {
        if (isMySQL()) {
            const [result] = await pool().query('DELETE FROM reservations WHERE id = ?', [id]);
            return result.affectedRows > 0;
        }
        const list = readJSON(DB_FILES.reservations);
        const index = list.findIndex(r => r.id === Number(id));
        if (index === -1) return false;
        list.splice(index, 1);
        writeJSON(DB_FILES.reservations, list);
        return true;
    },

    async getCount() {
        if (isMySQL()) {
            const [rows] = await pool().query('SELECT COUNT(*) as total FROM reservations');
            return rows[0].total;
        }
        return readJSON(DB_FILES.reservations).length;
    }
};

module.exports = Reservation;
