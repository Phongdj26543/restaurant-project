-- =====================================================
-- DATABASE: Nhà Hàng Phố Cổ - Ninh Bình
-- Author: Mphong
-- =====================================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS nhahangphoconb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nhahangphoconb;

-- =====================================================
-- BẢNG: menu - Thực đơn nhà hàng
-- =====================================================
CREATE TABLE IF NOT EXISTS menu (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  price       DECIMAL(12, 0) NOT NULL DEFAULT 0,
  image       VARCHAR(500) DEFAULT NULL,
  category    VARCHAR(100) DEFAULT 'Món chính',
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG: reservations - Đặt bàn
-- =====================================================
CREATE TABLE IF NOT EXISTS reservations (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  phone       VARCHAR(20) NOT NULL,
  email       VARCHAR(255) DEFAULT NULL,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  guests      INT NOT NULL DEFAULT 1,
  note        TEXT,
  status      ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG: contacts - Liên hệ
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  subject     VARCHAR(500) DEFAULT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DỮ LIỆU MẪU: menu
-- =====================================================
INSERT INTO menu (name, description, price, image, category) VALUES
-- Đặc sản Ninh Bình
('Cơm cháy Ninh Bình', 'Cơm cháy giòn tan ăn kèm thịt dê và nước sốt đặc biệt, đặc sản nổi tiếng Ninh Bình', 120000, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', 'Đặc sản Ninh Bình'),
('Thịt dê tái chanh', 'Thịt dê tươi thái mỏng tái chanh, ăn kèm rau thơm và bánh đa', 180000, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', 'Đặc sản Ninh Bình'),
('Thịt dê nướng tảng', 'Thịt dê ướp gia vị truyền thống, nướng trên than hoa', 200000, 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', 'Đặc sản Ninh Bình'),
('Miến lươn Ninh Bình', 'Miến lươn nấu từ lươn đồng tươi, nước dùng ngọt thanh', 85000, 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', 'Đặc sản Ninh Bình'),
('Ốc núi Ninh Bình', 'Ốc núi hấp lá chanh, chấm mắm gừng, vị ngọt tự nhiên', 95000, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', 'Đặc sản Ninh Bình'),

-- Món khai vị
('Nem rán truyền thống', 'Nem rán giòn rụm với nhân thịt và mộc nhĩ, chấm nước mắm pha', 75000, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', 'Khai vị'),
('Gỏi cuốn tôm thịt', 'Gỏi cuốn tươi mát với tôm, thịt và rau sống', 65000, 'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=400', 'Khai vị'),
('Chả giò hải sản', 'Chả giò chiên giòn với nhân hải sản tươi', 85000, 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400', 'Khai vị'),

-- Món chính
('Cá kho tộ', 'Cá kho tộ đậm đà vị quê hương, ăn kèm cơm nóng', 150000, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', 'Món chính'),
('Gà đồi nướng mật ong', 'Gà đồi ta nướng mật ong thơm lừng, da giòn thịt mềm', 250000, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', 'Món chính'),
('Tôm sú rang muối', 'Tôm sú tươi rang muối ớt, thơm ngon hấp dẫn', 220000, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', 'Món chính'),

-- Lẩu
('Lẩu dê Ninh Bình', 'Lẩu dê truyền thống Ninh Bình, nước dùng đậm đà', 350000, 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', 'Lẩu'),
('Lẩu hải sản chua cay', 'Lẩu hải sản tươi sống với nước dùng chua cay đặc biệt', 320000, 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=400', 'Lẩu'),

-- Đồ uống
('Trà sen Ninh Bình', 'Trà ướp hương sen tự nhiên, thanh mát', 35000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'Đồ uống'),
('Nước mía lau', 'Nước mía lau tươi mát, giải nhiệt', 25000, 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400', 'Đồ uống'),
('Bia hơi Hà Nội', 'Bia hơi tươi mát, đặc sản vùng miền', 15000, 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400', 'Đồ uống');

-- =====================================================
-- INDEX
-- =====================================================
CREATE INDEX idx_menu_category ON menu(category);
CREATE INDEX idx_menu_active ON menu(is_active);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);
