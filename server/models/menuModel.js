/* =====================================================
 * Menu Model - Hỗ trợ MongoDB + JSON fallback
 * ===================================================== */

const { isMongo, MenuModel, jsonDB } = require('../config/db');
const { readJSON, writeJSON, DB_FILES } = jsonDB;

const Menu = {
    async getAll() {
        if (isMongo()) {
            const docs = await MenuModel.find().sort({ category: 1, _id: 1 }).lean();
            return docs.map(d => ({ id: d._id, ...d }));
        }
        return readJSON(DB_FILES.menu);
    },

    async getAllActive() {
        if (isMongo()) {
            const docs = await MenuModel.find({ is_active: 1 }).sort({ category: 1, _id: 1 }).lean();
            return docs.map(d => ({ id: d._id, ...d }));
        }
        return readJSON(DB_FILES.menu).filter(m => m.is_active === 1);
    },

    async getByCategory(category) {
        if (isMongo()) {
            const docs = await MenuModel.find({ is_active: 1, category }).sort({ _id: 1 }).lean();
            return docs.map(d => ({ id: d._id, ...d }));
        }
        return readJSON(DB_FILES.menu).filter(m => m.is_active === 1 && m.category === category);
    },

    async getCategories() {
        if (isMongo()) {
            return await MenuModel.distinct('category', { is_active: 1 });
        }
        const items = readJSON(DB_FILES.menu).filter(m => m.is_active === 1);
        return [...new Set(items.map(m => m.category))];
    },

    async getById(id) {
        if (isMongo()) {
            const doc = await MenuModel.findById(id).lean();
            return doc ? { id: doc._id, ...doc } : null;
        }
        return readJSON(DB_FILES.menu).find(m => m.id === Number(id)) || null;
    },

    async create({ name, description, price, image, category }) {
        if (isMongo()) {
            const doc = await MenuModel.create({ name, description, price, image, category, is_active: 1 });
            return { id: doc._id, name, description, price, image, category, is_active: 1 };
        }
        const items = readJSON(DB_FILES.menu);
        const newId = items.length > 0 ? Math.max(...items.map(m => m.id)) + 1 : 1;
        const newItem = { id: newId, name, description, price, image, category, is_active: 1 };
        items.push(newItem);
        writeJSON(DB_FILES.menu, items);
        return newItem;
    },

    async update(id, { name, description, price, image, category, is_active }) {
        if (isMongo()) {
            const updates = {};
            if (name !== undefined) updates.name = name;
            if (description !== undefined) updates.description = description;
            if (price !== undefined) updates.price = price;
            if (image !== undefined) updates.image = image;
            if (category !== undefined) updates.category = category;
            if (is_active !== undefined) updates.is_active = is_active;
            const doc = await MenuModel.findByIdAndUpdate(id, updates, { new: true }).lean();
            return doc ? { id: doc._id, ...doc } : null;
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
        if (isMongo()) {
            const result = await MenuModel.findByIdAndDelete(id);
            return !!result;
        }
        const items = readJSON(DB_FILES.menu);
        const filtered = items.filter(m => m.id !== Number(id));
        if (filtered.length === items.length) return false;
        writeJSON(DB_FILES.menu, filtered);
        return true;
    }
};

module.exports = Menu;
