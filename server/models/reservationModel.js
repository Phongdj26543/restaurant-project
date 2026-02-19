/* =====================================================
 * Reservation Model - Hỗ trợ MongoDB + JSON fallback
 * ===================================================== */

const { isMongo, ReservationModel, jsonDB } = require('../config/db');
const { readJSON, writeJSON, DB_FILES } = jsonDB;

const Reservation = {
    async create(data) {
        const { name, phone, email, date, time, guests, note, preOrder } = data;

        if (isMongo()) {
            const doc = await ReservationModel.create({
                name, phone, email: email || null,
                date, time, guests,
                note: note || null,
                pre_order: preOrder || null,
                status: 'pending',
                created_at: new Date()
            });
            return { id: doc._id, ...doc.toObject() };
        }

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
        if (isMongo()) {
            const docs = await ReservationModel.find()
                .sort({ created_at: -1 })
                .skip(offset)
                .limit(limit)
                .lean();
            return docs.map(d => ({ id: d._id, ...d }));
        }
        const list = readJSON(DB_FILES.reservations);
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return list.slice(offset, offset + limit);
    },

    async getByDate(date) {
        if (isMongo()) {
            const docs = await ReservationModel.find({ date }).sort({ time: 1 }).lean();
            return docs.map(d => ({ id: d._id, ...d }));
        }
        return readJSON(DB_FILES.reservations)
            .filter(r => r.date === date)
            .sort((a, b) => a.time.localeCompare(b.time));
    },

    async updateStatus(id, status) {
        if (isMongo()) {
            const result = await ReservationModel.findByIdAndUpdate(id, { status });
            return !!result;
        }
        const list = readJSON(DB_FILES.reservations);
        const item = list.find(r => r.id === Number(id));
        if (!item) return false;
        item.status = status;
        writeJSON(DB_FILES.reservations, list);
        return true;
    },

    async delete(id) {
        if (isMongo()) {
            const result = await ReservationModel.findByIdAndDelete(id);
            return !!result;
        }
        const list = readJSON(DB_FILES.reservations);
        const index = list.findIndex(r => r.id === Number(id));
        if (index === -1) return false;
        list.splice(index, 1);
        writeJSON(DB_FILES.reservations, list);
        return true;
    },

    async getCount() {
        if (isMongo()) {
            return await ReservationModel.countDocuments();
        }
        return readJSON(DB_FILES.reservations).length;
    }
};

module.exports = Reservation;
