/* =====================================================
 * Menu Routes - Full CRUD
 * ===================================================== */

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Middleware lấy requireAdmin từ app.locals
function getRequireAdmin(req, res, next) {
    const requireAdmin = req.app.locals.requireAdmin;
    if (requireAdmin) {
        return requireAdmin(req, res, next);
    }
    next();
}

// GET /api/menu - Lấy thực đơn active (hỗ trợ ?category=...)
router.get('/', menuController.getMenu);

// GET /api/menu/all - Admin: lấy tất cả (gồm ẩn)
router.get('/all', menuController.getAllMenu);

// GET /api/menu/categories - Lấy danh sách danh mục
router.get('/categories', menuController.getCategories);

// GET /api/menu/:id - Lấy chi tiết 1 món
router.get('/:id', menuController.getMenuItem);

// POST /api/menu - Thêm món mới (yêu cầu admin)
router.post('/', getRequireAdmin, menuController.createMenuItem);

// PUT /api/menu/:id - Cập nhật món (yêu cầu admin)
router.put('/:id', getRequireAdmin, menuController.updateMenuItem);

// DELETE /api/menu/:id - Xóa món (yêu cầu admin)
router.delete('/:id', getRequireAdmin, menuController.deleteMenuItem);

module.exports = router;
