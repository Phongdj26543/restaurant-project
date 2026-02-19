<?php
/* =====================================================
 * Nhà Hàng Phố Cổ - PHP Backend Configuration
 * 123host.vn Shared Hosting
 * ===================================================== */

// =====================================================
// DATABASE CONFIG - CẬP NHẬT THÔNG TIN TỪ cPANEL
// =====================================================
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');     // Tên database từ cPanel
define('DB_USER', 'your_database_user');     // Username từ cPanel
define('DB_PASS', 'your_database_password'); // Password từ cPanel
define('DB_CHARSET', 'utf8mb4');

// =====================================================
// ADMIN CREDENTIALS
// =====================================================
define('ADMIN_USERNAME', 'Phoconinhbinh');
define('ADMIN_PASSWORD', 'Nhahangphoco88888888');

// =====================================================
// UPLOAD CONFIG
// =====================================================
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_URL_PREFIX', '/uploads/');
define('MAX_IMAGE_SIZE', 5 * 1024 * 1024);      // 5MB
define('MAX_VIDEO_SIZE', 100 * 1024 * 1024);     // 100MB

define('ALLOWED_IMAGE_EXTS', ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
define('ALLOWED_IMAGE_MIMES', ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']);
define('ALLOWED_VIDEO_EXTS', ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg']);

// =====================================================
// DEFAULT CONTENT (Nội dung mặc định)
// =====================================================
define('DEFAULT_CONTENT', [
    'hero' => [
        'subtitle' => 'Chào mừng đến với',
        'title' => 'Nhà Hàng Phố Cổ',
        'tagline' => 'Hương vị truyền thống giữa lòng phố cổ Ninh Bình',
        'description' => 'Trải nghiệm ẩm thực đặc sản Ninh Bình trong không gian mang đậm hồn phố cổ',
        'backgroundImage' => ''
    ],
    'about' => ['title' => 'Về Nhà Hàng Phố Cổ', 'description' => '', 'image' => '', 'experience' => '15+'],
    'contact' => [
        'address' => '72A Đinh Tất Miễn – đường Lê Thái Tổ, Ninh Bình',
        'phone' => '0229 123 4567',
        'email' => 'info@phoconinhbinh.vn',
        'openHours' => '10:00 - 22:00',
        'mapUrl' => ''
    ],
    'introVideo' => ['url' => '', 'enabled' => false],
    'gallery' => [],
    'stats' => ['customers' => 15000, 'dishes' => 50, 'years' => 10, 'reviews' => 4800],
    'testimonials' => [],
    'offer' => [
        'enabled' => true,
        'badge' => 'Ưu đãi đặc biệt',
        'title' => 'Giảm 15% cho đặt bàn Online',
        'desc' => '',
        'btnText' => 'Đặt Bàn & Nhận Ưu Đãi'
    ],
    'floatingContact' => [
        'phone' => '02293888888',
        'zalo' => 'https://zalo.me/0229388888',
        'messenger' => 'https://m.me/nhahangphoco'
    ],
    'socialLinks' => ['facebook' => '', 'instagram' => '', 'tiktok' => '', 'zalo' => ''],
    'footerHours' => [
        'weekday' => '09:00 - 22:00',
        'saturday' => '08:00 - 23:00',
        'sunday' => '08:00 - 22:00'
    ]
]);
