/* =====================================================
 * Contact Routes
 * ===================================================== */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');

// Validation rules cho liên hệ
const contactValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Vui lòng nhập họ tên')
        .isLength({ min: 2, max: 255 }).withMessage('Họ tên từ 2-255 ký tự'),

    body('email')
        .trim()
        .notEmpty().withMessage('Vui lòng nhập email')
        .isEmail().withMessage('Email không hợp lệ'),

    body('message')
        .trim()
        .notEmpty().withMessage('Vui lòng nhập nội dung')
        .isLength({ min: 10 }).withMessage('Nội dung tối thiểu 10 ký tự')
];

// POST /api/contacts - Gửi liên hệ
router.post('/', contactValidation, contactController.createContact);

// GET /api/contacts - Danh sách liên hệ (admin)
router.get('/', contactController.getContacts);

// DELETE /api/contacts/:id - Xóa tin nhắn liên hệ
router.delete('/:id', contactController.deleteContact);

module.exports = router;
