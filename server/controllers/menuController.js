/* =====================================================
 * Menu Controller - Xử lý logic thực đơn (Full CRUD)
 * ===================================================== */

const Menu = require('../models/menuModel');

const menuController = {
    /**
     * GET /api/menu
     * Lấy toàn bộ thực đơn active, nhóm theo danh mục
     */
    async getMenu(req, res) {
        try {
            const { category } = req.query;

            let items;
            if (category) {
                items = await Menu.getByCategory(category);
            } else {
                items = await Menu.getAllActive();
            }

            // Nhóm theo category
            const grouped = items.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            }, {});

            res.json({
                success: true,
                data: items,
                grouped,
                total: items.length
            });
        } catch (error) {
            console.error('Lỗi lấy menu:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tải thực đơn'
            });
        }
    },

    /**
     * GET /api/menu/all - Admin: lấy tất cả (gồm cả ẩn)
     */
    async getAllMenu(req, res) {
        try {
            const items = await Menu.getAll();
            res.json({ success: true, data: items, total: items.length });
        } catch (error) {
            console.error('Lỗi lấy tất cả menu:', error);
            res.status(500).json({ success: false, message: 'Không thể tải thực đơn' });
        }
    },

    /**
     * GET /api/menu/categories
     * Lấy danh sách danh mục
     */
    async getCategories(req, res) {
        try {
            const categories = await Menu.getCategories();
            res.json({ success: true, data: categories });
        } catch (error) {
            console.error('Lỗi lấy categories:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tải danh mục'
            });
        }
    },

    /**
     * GET /api/menu/:id
     * Lấy chi tiết 1 món
     */
    async getMenuItem(req, res) {
        try {
            const item = await Menu.getById(req.params.id);
            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy món ăn'
                });
            }
            res.json({ success: true, data: item });
        } catch (error) {
            console.error('Lỗi lấy chi tiết món:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tải chi tiết món ăn'
            });
        }
    },

    /**
     * POST /api/menu
     * Thêm món mới
     */
    async createMenuItem(req, res) {
        try {
            const { name, description, price, image, category } = req.body;
            if (!name || !price || !category) {
                return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (tên, giá, danh mục)' });
            }
            const item = await Menu.create({ name, description, price: Number(price), image: image || '', category });
            res.status(201).json({ success: true, data: item, message: 'Đã thêm món mới' });
        } catch (error) {
            console.error('Lỗi thêm món:', error);
            res.status(500).json({ success: false, message: 'Không thể thêm món' });
        }
    },

    /**
     * PUT /api/menu/:id
     * Cập nhật món
     */
    async updateMenuItem(req, res) {
        try {
            const { name, description, price, image, category, is_active } = req.body;
            const updates = {};
            if (name !== undefined) updates.name = name;
            if (description !== undefined) updates.description = description;
            if (price !== undefined) updates.price = Number(price);
            if (image !== undefined) updates.image = image;
            if (category !== undefined) updates.category = category;
            if (is_active !== undefined) updates.is_active = Number(is_active);

            const item = await Menu.update(req.params.id, updates);
            if (!item) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy món ăn' });
            }
            res.json({ success: true, data: item, message: 'Đã cập nhật món' });
        } catch (error) {
            console.error('Lỗi cập nhật món:', error);
            res.status(500).json({ success: false, message: 'Không thể cập nhật món' });
        }
    },

    /**
     * DELETE /api/menu/:id
     * Xóa món
     */
    async deleteMenuItem(req, res) {
        try {
            const deleted = await Menu.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy món ăn' });
            }
            res.json({ success: true, message: 'Đã xóa món' });
        } catch (error) {
            console.error('Lỗi xóa món:', error);
            res.status(500).json({ success: false, message: 'Không thể xóa món' });
        }
    }
};

module.exports = menuController;
