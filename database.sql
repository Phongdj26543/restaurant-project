-- =====================================================
-- DATABASE: Nhà Hàng Phố Cổ - Ninh Bình
-- PHP Backend + MySQL
-- =====================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- BẢNG: menu - Thực đơn nhà hàng
-- =====================================================
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price`       INT UNSIGNED NOT NULL DEFAULT 0,
  `image`       VARCHAR(500) DEFAULT '',
  `category`    VARCHAR(255) NOT NULL,
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG: reservations - Đặt bàn
-- =====================================================
DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(255) NOT NULL,
  `phone`       VARCHAR(20) NOT NULL,
  `email`       VARCHAR(255) DEFAULT NULL,
  `date`        DATE NOT NULL,
  `time`        VARCHAR(10) NOT NULL,
  `guests`      INT UNSIGNED NOT NULL DEFAULT 1,
  `note`        TEXT DEFAULT NULL,
  `pre_order`   JSON DEFAULT NULL,
  `status`      ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_date` (`date`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG: contacts - Liên hệ
-- =====================================================
DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(255) NOT NULL,
  `email`       VARCHAR(255) NOT NULL,
  `subject`     VARCHAR(500) DEFAULT NULL,
  `message`     TEXT NOT NULL,
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG: content - Nội dung trang web (CMS)
-- =====================================================
DROP TABLE IF EXISTS `content`;
CREATE TABLE `content` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `content_key`  VARCHAR(50) NOT NULL DEFAULT 'main',
  `data`         JSON NOT NULL,
  `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_content_key` (`content_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- DỮ LIỆU MẪU: menu
-- =====================================================
INSERT INTO `menu` (`name`, `description`, `price`, `image`, `category`, `is_active`) VALUES
('Cơm cháy Ninh Bình', 'Cơm cháy giòn tan ăn kèm thịt dê và nước sốt đặc biệt, đặc sản nổi tiếng Ninh Bình', 120000, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', 'Đặc sản Ninh Bình', 1),
('Thịt dê tái chanh', 'Thịt dê tươi thái mỏng tái chanh, ăn kèm rau thơm và bánh đa', 180000, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', 'Đặc sản Ninh Bình', 1),
('Thịt dê nướng tảng', 'Thịt dê ướp gia vị truyền thống, nướng trên than hoa', 200000, 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', 'Đặc sản Ninh Bình', 1),
('Miến lươn Ninh Bình', 'Miến lươn nấu từ lươn đồng tươi, nước dùng ngọt thanh', 85000, 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', 'Đặc sản Ninh Bình', 1),
('Ốc núi Ninh Bình', 'Ốc núi hấp lá chanh, chấm mắm gừng, vị ngọt tự nhiên', 95000, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', 'Đặc sản Ninh Bình', 1),
('Nem rán truyền thống', 'Nem rán giòn rụm với nhân thịt và mộc nhĩ, chấm nước mắm pha', 75000, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', 'Khai vị', 1),
('Gỏi cuốn tôm thịt', 'Gỏi cuốn tươi mát với tôm, thịt và rau sống', 65000, 'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=400', 'Khai vị', 1),
('Chả giò hải sản', 'Chả giò chiên giòn với nhân hải sản tươi', 85000, 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400', 'Khai vị', 1),
('Cá kho tộ', 'Cá kho tộ đậm đà vị quê hương, ăn kèm cơm nóng', 150000, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', 'Món chính', 1),
('Gà đồi nướng mật ong', 'Gà đồi ta nướng mật ong thơm lừng, da giòn thịt mềm', 250000, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', 'Món chính', 1),
('Tôm sú rang muối', 'Tôm sú tươi rang muối ớt, thơm ngon hấp dẫn', 220000, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', 'Món chính', 1),
('Lẩu dê Ninh Bình', 'Lẩu dê truyền thống Ninh Bình, nước dùng đậm đà', 350000, 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', 'Lẩu', 1),
('Lẩu hải sản chua cay', 'Lẩu hải sản tươi sống với nước dùng chua cay đặc biệt', 320000, 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=400', 'Lẩu', 1),
('Trà sen Ninh Bình', 'Trà ướp hương sen tự nhiên, thanh mát', 35000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'Đồ uống', 1),
('Nước mía lau', 'Nước mía lau tươi mát, giải nhiệt', 25000, 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400', 'Đồ uống', 1),
('Bia hơi Hà Nội', 'Bia hơi tươi mát, đặc sản vùng miền', 15000, 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400', 'Đồ uống', 1);

-- =====================================================
-- DỮ LIỆU MẪU: content (Nội dung trang web)
-- =====================================================
INSERT INTO `content` (`content_key`, `data`) VALUES
('main', '{"hero":{"subtitle":"Chào mừng đến với","title":"Nhà Hàng Phố Cổ","tagline":"Hương vị truyền thống giữa lòng phố cổ Ninh Bình","description":"Trải nghiệm ẩm thực đặc sản Ninh Bình trong không gian mang đậm hồn phố cổ","backgroundImage":""},"about":{"title":"Về Nhà Hàng Phố Cổ","description":"","image":"","experience":"15+"},"contact":{"address":"72A Đinh Tất Miễn – đường Lê Thái Tổ, Ninh Bình","phone":"0229 123 4567","email":"info@phoconinhbinh.vn","openHours":"10:00 - 22:00","mapUrl":""},"introVideo":{"url":"","enabled":false},"gallery":[],"stats":{"customers":15000,"dishes":50,"years":10,"reviews":4800},"testimonials":[],"offer":{"enabled":true,"badge":"Ưu đãi đặc biệt","title":"Giảm 15% cho đặt bàn Online","desc":"","btnText":"Đặt Bàn & Nhận Ưu Đãi"},"floatingContact":{"phone":"02293888888","zalo":"https://zalo.me/0229388888","messenger":"https://m.me/nhahangphoco"},"socialLinks":{"facebook":"","instagram":"","tiktok":"","zalo":""},"footerHours":{"weekday":"09:00 - 22:00","saturday":"08:00 - 23:00","sunday":"08:00 - 22:00"}}');
