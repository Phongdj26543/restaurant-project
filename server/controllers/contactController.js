/* =====================================================
 * Contact Controller - Xử lý logic liên hệ
 * ===================================================== */

const Contact = require('../models/contactModel');
const { validationResult } = require('express-validator');

const contactController = {
    /**
     * POST /api/contacts
     * Gửi tin nhắn liên hệ
     */
    async createContact(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không hợp lệ',
                    errors: errors.array().map(e => ({
                        field: e.path,
                        message: e.msg
                    }))
                });
            }

            const { name, email, subject, message } = req.body;
            const contact = await Contact.create({ name, email, subject, message });

            res.status(201).json({
                success: true,
                message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.',
                data: contact
            });
        } catch (error) {
            console.error('Lỗi gửi liên hệ:', error);
            res.status(500).json({
                success: false,
                message: 'Gửi liên hệ thất bại, vui lòng thử lại'
            });
        }
    },

    /**
     * GET /api/contacts
     * Lấy danh sách liên hệ (admin)
     */
    async getContacts(req, res) {
        try {
            const { limit = 50, offset = 0 } = req.query;
            const contacts = await Contact.getAll(parseInt(limit), parseInt(offset));

            res.json({
                success: true,
                data: contacts,
                total: contacts.length
            });
        } catch (error) {
            console.error('Lỗi lấy danh sách liên hệ:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tải danh sách liên hệ'
            });
        }
    },

    /**
     * DELETE /api/contacts/:id
     * Xóa tin nhắn liên hệ
     */
    async deleteContact(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Contact.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy tin nhắn'
                });
            }

            res.json({
                success: true,
                message: 'Xóa tin nhắn thành công'
            });
        } catch (error) {
            console.error('Lỗi xóa liên hệ:', error);
            res.status(500).json({
                success: false,
                message: 'Xóa thất bại'
            });
        }
    }
};

module.exports = contactController;
