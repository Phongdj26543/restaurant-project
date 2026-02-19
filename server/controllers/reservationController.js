/* =====================================================
 * Reservation Controller - Xử lý logic đặt bàn
 * ===================================================== */

const Reservation = require('../models/reservationModel');
const { validationResult } = require('express-validator');

const reservationController = {
    /**
     * POST /api/reservations
     * Tạo đơn đặt bàn mới
     */
    async createReservation(req, res) {
        try {
            // Kiểm tra validation errors
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

            const { name, phone, email, date, time, guests, note, preOrder } = req.body;

            // Kiểm tra ngày đặt >= hôm nay
            const reservationDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (reservationDate < today) {
                return res.status(400).json({
                    success: false,
                    message: 'Ngày đặt bàn không thể là ngày trong quá khứ'
                });
            }

            const reservation = await Reservation.create({
                name, phone, email, date, time, guests: parseInt(guests), note, preOrder: preOrder || null
            });

            res.status(201).json({
                success: true,
                message: 'Đặt bàn thành công! Chúng tôi sẽ liên hệ xác nhận.',
                data: reservation
            });
        } catch (error) {
            console.error('Lỗi đặt bàn:', error);
            res.status(500).json({
                success: false,
                message: 'Đặt bàn thất bại, vui lòng thử lại'
            });
        }
    },

    /**
     * GET /api/reservations
     * Lấy danh sách đặt bàn (admin)
     */
    async getReservations(req, res) {
        try {
            const { date, limit = 50, offset = 0 } = req.query;

            let reservations;
            if (date) {
                reservations = await Reservation.getByDate(date);
            } else {
                reservations = await Reservation.getAll(
                    parseInt(limit),
                    parseInt(offset)
                );
            }

            res.json({
                success: true,
                data: reservations,
                total: reservations.length
            });
        } catch (error) {
            console.error('Lỗi lấy danh sách đặt bàn:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tải danh sách đặt bàn'
            });
        }
    },

    /**
     * PUT /api/reservations/:id/status
     * Cập nhật trạng thái đặt bàn
     */
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Trạng thái không hợp lệ'
                });
            }

            const updated = await Reservation.updateStatus(id, status);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đơn đặt bàn'
                });
            }

            res.json({
                success: true,
                message: 'Cập nhật trạng thái thành công'
            });
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            res.status(500).json({
                success: false,
                message: 'Cập nhật thất bại'
            });
        }
    },

    /**
     * DELETE /api/reservations/:id
     * Xóa đơn đặt bàn
     */
    async deleteReservation(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Reservation.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đơn đặt bàn'
                });
            }

            res.json({
                success: true,
                message: 'Xóa đơn đặt bàn thành công'
            });
        } catch (error) {
            console.error('Lỗi xóa đặt bàn:', error);
            res.status(500).json({
                success: false,
                message: 'Xóa thất bại'
            });
        }
    }
};

module.exports = reservationController;
