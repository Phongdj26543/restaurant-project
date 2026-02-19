/* =====================================================
 * Menu Routes - Full CRUD
 * ===================================================== */

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/menu - Lấy thực đơn active (hỗ trợ ?category=...)
router.get('/', menuController.getMenu);

// GET /api/menu/all - Admin: lấy tất cả (gồm ẩn)
router.get('/all', menuController.getAllMenu);

// GET /api/menu/categories - Lấy danh sách danh mục
router.get('/categories', menuController.getCategories);

// GET /api/menu/:id - Lấy chi tiết 1 món
router.get('/:id', menuController.getMenuItem);

// POST /api/menu - Thêm món mới
router.post('/', menuController.createMenuItem);

// PUT /api/menu/:id - Cập nhật món
router.put('/:id', menuController.updateMenuItem);

// DELETE /api/menu/:id - Xóa món
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
