# Hướng dẫn triển khai - Nhà Hàng Phố Cổ
## PHP Backend trên 123host.vn

---

## 📋 Yêu cầu
- Hosting PHP (Apache + PHP 7.4+ hoặc 8.x)
- MySQL 5.7+ hoặc MariaDB 10.x+
- mod_rewrite được bật (thường mặc định trên shared hosting)

---

## 🚀 Các bước triển khai

### Bước 1: Tạo MySQL Database trên cPanel

1. Đăng nhập cPanel tại `https://client.123host.vn`
2. Vào **MySQL® Databases**
3. Tạo database mới (ví dụ: `nhahangphoco`)
4. Tạo user mới (ví dụ: `nhahang_user`) với mật khẩu mạnh
5. Gán user vào database với **ALL PRIVILEGES**
6. **Ghi nhớ**: tên database, username, password

### Bước 2: Import SQL Schema

1. Trong cPanel, vào **phpMyAdmin**
2. Chọn database vừa tạo
3. Click tab **Import**
4. Upload file `database.sql`
5. Click **Go** để chạy

### Bước 3: Cấu hình PHP Backend

Mở file `api/config.php` và sửa thông tin database:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'cpaneluser_nhahangphoco');  // Tên database thực tế
define('DB_USER', 'cpaneluser_nhahang');        // Username thực tế
define('DB_PASS', 'MatKhauCuaBan123');          // Password thực tế
```

> **Lưu ý**: Trên 123host.vn shared hosting, tên database và user thường có prefix là tên cPanel account. Ví dụ: nếu tài khoản cPanel là `abc123`, database sẽ là `abc123_nhahangphoco`.

### Bước 4: Upload files lên hosting

Sử dụng **File Manager** trong cPanel hoặc **FTP client** (FileZilla):

Upload cấu trúc sau vào thư mục `public_html/`:

```
public_html/
├── .htaccess            ← Từ file .htaccess (root)
├── index.html           ← Từ client/index.html
├── admin.html           ← Từ client/admin.html
├── css/
│   ├── style.css        ← Từ client/css/style.css
│   └── admin.css        ← Từ client/css/admin.css
├── js/
│   ├── script.js        ← Từ client/js/script.js
│   ├── admin.js         ← Từ client/js/admin.js
│   └── i18n.js          ← Từ client/js/i18n.js
├── uploads/             ← Tạo thư mục rỗng (chmod 755)
└── api/
    ├── .htaccess        ← Từ api/.htaccess
    ├── config.php       ← Từ api/config.php (đã sửa)
    ├── helpers.php      ← Từ api/helpers.php
    └── index.php        ← Từ api/index.php
```

### Bước 5: Cấu hình quyền (Permissions)

Trong File Manager hoặc FTP:
- Thư mục `uploads/`: chmod **755**
- File PHP trong `api/`: chmod **644**
- File `.htaccess`: chmod **644**

### Bước 6: Kiểm tra

1. Truy cập `https://yourdomain.com` → Trang chủ nhà hàng
2. Truy cập `https://yourdomain.com/admin` → Trang quản trị
3. Truy cập `https://yourdomain.com/api/health` → Health check API
4. Đăng nhập admin:
   - Username: `Phoconinhbinh`
   - Password: `Nhahangphoco88888888`

---

## 🔧 Xử lý lỗi thường gặp

### 500 Internal Server Error
- Kiểm tra `.htaccess` có đúng cú pháp không
- Kiểm tra mod_rewrite đã bật chưa (liên hệ 123host.vn nếu cần)
- Xem error log trong cPanel → **Error Log**

### API trả về 404
- Đảm bảo file `.htaccess` ở đúng thư mục `public_html/`
- Kiểm tra `api/index.php` đã upload đúng vị trí

### Lỗi kết nối database
- Kiểm tra lại thông tin trong `api/config.php`
- Đảm bảo user đã được gán quyền cho database
- Thử kết nối qua phpMyAdmin để xác nhận

### Upload ảnh không được
- Kiểm tra thư mục `uploads/` có permission 755
- Kiểm tra PHP `upload_max_filesize` trong cPanel → **MultiPHP INI Editor**
  - Sửa `upload_max_filesize = 10M`
  - Sửa `post_max_size = 12M`

---

## 📝 Thay đổi mật khẩu Admin

Sửa trong `api/config.php`:
```php
define('ADMIN_USERNAME', 'TenMoi');
define('ADMIN_PASSWORD', 'MatKhauMoi');
```

---

## 🔒 Bảo mật

- File `config.php` được bảo vệ bởi `.htaccess`, không thể truy cập trực tiếp từ trình duyệt
- Mật khẩu admin nên đổi sau khi triển khai
- Nên cài SSL certificate (Let's Encrypt miễn phí qua cPanel)
- Đặt `DB_PASS` mạnh: ít nhất 12 ký tự, có chữ hoa, thường, số, ký tự đặc biệt
