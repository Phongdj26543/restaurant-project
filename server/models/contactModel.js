/* =====================================================
 * Contact Model - Hỗ trợ MongoDB + JSON fallback
 * ===================================================== */

const { isMongo, ContactModel, jsonDB } = require('../config/db');
const { readJSON, writeJSON, DB_FILES } = jsonDB;

const Contact = {
    async create(data) {
        const { name, email, subject, message } = data;

        if (isMongo()) {
            const doc = await ContactModel.create({
                name, email, subject: subject || null, message,
                created_at: new Date()
            });
            return { id: doc._id, ...doc.toObject() };
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
        if (isMongo()) {
            const docs = await ContactModel.find()
                .sort({ created_at: -1 })
                .skip(offset)
                .limit(limit)
                .lean();
            return docs.map(d => ({ id: d._id, ...d }));
        }
        const list = readJSON(DB_FILES.contacts);
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return list.slice(offset, offset + limit);
    },

    async delete(id) {
        if (isMongo()) {
            const result = await ContactModel.findByIdAndDelete(id);
            return !!result;
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
