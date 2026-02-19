/* =====================================================
 * Menu Model - Hỗ trợ MySQL + JSON fallback
 * ===================================================== */

const { pool, jsonDB, isMySQL } = require('../config/db');
const { readJSON, writeJSON, DB_FILES } = jsonDB;

const Menu = {
    async getAll() {
        if (isMySQL()) {
            const [rows] = await pool().query(
                'SELECT id, name, description, price, image, category, is_active FROM menu ORDER BY category, id'
            );
            return rows;
        }
        return readJSON(DB_FILES.menu);
    },

    async getAllActive() {
        if (isMySQL()) {
            const [rows] = await pool().query(
                'SELECT id, name, description, price, image, category FROM menu WHERE is_active = 1 ORDER BY category, id'
            );
            return rows;
        }
        return readJSON(DB_FILES.menu).filter(m => m.is_active === 1);
    },

    async getByCategory(category) {
        if (isMySQL()) {
            const [rows] = await pool().query(
                'SELECT id, name, description, price, image, category FROM menu WHERE is_active = 1 AND category = ? ORDER BY id',
                [category]
            );
            return rows;
        }
        return readJSON(DB_FILES.menu).filter(m => m.is_active === 1 && m.category === category);
    },

    async getCategories() {
        if (isMySQL()) {
            const [rows] = await pool().query(
                'SELECT DISTINCT category FROM menu WHERE is_active = 1 ORDER BY category'
            );
            return rows.map(r => r.category);
        }
        const items = readJSON(DB_FILES.menu).filter(m => m.is_active === 1);
        return [...new Set(items.map(m => m.category))];
    },

    async getById(id) {
        if (isMySQL()) {
            const [rows] = await pool().query('SELECT * FROM menu WHERE id = ?', [id]);
            return rows[0] || null;
        }
        return readJSON(DB_FILES.menu).find(m => m.id === Number(id)) || null;
    },

    async create({ name, description, price, image, category }) {
        if (isMySQL()) {
            const [result] = await pool().query(
                'INSERT INTO menu (name, description, price, image, category, is_active) VALUES (?, ?, ?, ?, ?, 1)',
                [name, description, price, image, category]
            );
            return { id: result.insertId, name, description, price, image, category, is_active: 1 };
        }
        const items = readJSON(DB_FILES.menu);
        const newId = items.length > 0 ? Math.max(...items.map(m => m.id)) + 1 : 1;
        const newItem = { id: newId, name, description, price, image, category, is_active: 1 };
        items.push(newItem);
        writeJSON(DB_FILES.menu, items);
        return newItem;
    },

    async update(id, { name, description, price, image, category, is_active }) {
        if (isMySQL()) {
            const fields = [];
            const values = [];
            if (name !== undefined) { fields.push('name = ?'); values.push(name); }
            if (description !== undefined) { fields.push('description = ?'); values.push(description); }
            if (price !== undefined) { fields.push('price = ?'); values.push(price); }
            if (image !== undefined) { fields.push('image = ?'); values.push(image); }
            if (category !== undefined) { fields.push('category = ?'); values.push(category); }
            if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active); }
            if (fields.length === 0) return null;
            values.push(id);
            await pool().query(`UPDATE menu SET ${fields.join(', ')} WHERE id = ?`, values);
            return this.getById(id);
        }
        const items = readJSON(DB_FILES.menu);
        const index = items.findIndex(m => m.id === Number(id));
        if (index === -1) return null;
        if (name !== undefined) items[index].name = name;
        if (description !== undefined) items[index].description = description;
        if (price !== undefined) items[index].price = price;
        if (image !== undefined) items[index].image = image;
        if (category !== undefined) items[index].category = category;
        if (is_active !== undefined) items[index].is_active = is_active;
        writeJSON(DB_FILES.menu, items);
        return items[index];
    },

    async delete(id) {
        if (isMySQL()) {
            const [result] = await pool().query('DELETE FROM menu WHERE id = ?', [id]);
            return result.affectedRows > 0;
        }
        const items = readJSON(DB_FILES.menu);
        const filtered = items.filter(m => m.id !== Number(id));
        if (filtered.length === items.length) return false;
        writeJSON(DB_FILES.menu, filtered);
        return true;
    }
};

module.exports = Menu;
