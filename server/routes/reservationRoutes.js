/* =====================================================
 * Reservation Routes
 * ===================================================== */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reservationController = require('../controllers/reservationController');

// Validation rules cho đặt bàn
const reservationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Vui lòng nhập họ tên')
        .isLength({ min: 2, max: 255 }).withMessage('Họ tên từ 2-255 ký tự'),

    body('phone')
        .trim()
        .notEmpty().withMessage('Vui lòng nhập số điện thoại')
        .matches(/^(0|\+84)[0-9]{9,10}$/).withMessage('Số điện thoại không hợp lệ'),

    body('email')
        .optional({ checkFalsy: true })
        .isEmail().withMessage('Email không hợp lệ'),

    body('date')
        .notEmpty().withMessage('Vui lòng chọn ngày')
        .isDate().withMessage('Ngày không hợp lệ'),

    body('time')
        .notEmpty().withMessage('Vui lòng chọn giờ')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Giờ không hợp lệ'),

    body('guests')
        .notEmpty().withMessage('Vui lòng nhập số khách')
        .isInt({ min: 1, max: 50 }).withMessage('Số khách từ 1-50 người')
];

// POST /api/reservations - Đặt bàn
router.post('/', reservationValidation, reservationController.createReservation);

// GET /api/reservations - Danh sách đặt bàn (admin)
router.get('/', reservationController.getReservations);

// PUT /api/reservations/:id/status - Cập nhật trạng thái
router.put('/:id/status', reservationController.updateStatus);

// DELETE /api/reservations/:id - Xóa đơn đặt bàn
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
