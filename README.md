# 🏮 Nhà Hàng Phố Cổ - Ninh Bình

Website nhà hàng đầy đủ Frontend + Backend + Database.

**Địa chỉ:** 72A Đinh Tất Miễn – đường Lê Thái Tổ, Ninh Bình  
**Dev by Mphong**

---

## 📦 Stack Công Nghệ

| Layer    | Công nghệ                          |
|----------|-------------------------------------|
| Frontend | HTML5, CSS3 (Flexbox + Grid), JS ES6 |
| Backend  | Node.js + Express (MVC)             |
| Database | MySQL (mysql2)                      |

---

## 🚀 Chạy Local

### 1. Cài đặt MySQL

Tải MySQL từ [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/) và cài đặt.

### 2. Import Database

```bash
mysql -u root -p < database.sql
```

Hoặc mở MySQL Workbench, chạy nội dung file `database.sql`.

### 3. Cấu hình .env

Sửa file `.env` với thông tin MySQL của bạn:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=nhahangphoconb
```

### 4. Cài đặt dependencies

```bash
cd restaurant-project
npm install
```

### 5. Chạy server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Truy cập: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

| Method | Endpoint                       | Mô tả                     |
|--------|--------------------------------|----------------------------|
| GET    | `/api/menu`                    | Lấy thực đơn               |
| GET    | `/api/menu?category=Lẩu`      | Lọc theo danh mục          |
| GET    | `/api/menu/categories`         | Danh sách danh mục          |
| GET    | `/api/menu/:id`                | Chi tiết 1 món              |
| POST   | `/api/reservations`            | Đặt bàn                    |
| GET    | `/api/reservations`            | Danh sách đặt bàn (admin)   |
| PUT    | `/api/reservations/:id/status` | Cập nhật trạng thái         |
| POST   | `/api/contacts`                | Gửi liên hệ                |
| GET    | `/api/contacts`                | Danh sách liên hệ (admin)   |
| GET    | `/api/health`                  | Health check                |

---

## 🌐 Deploy lên VPS (Ubuntu)

### Bước 1: Chuẩn bị VPS

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra
node -v
npm -v
```

### Bước 2: Cài đặt MySQL

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Đăng nhập MySQL
sudo mysql -u root -p

# Tạo user cho ứng dụng
CREATE USER 'nhahang'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON nhahangphoconb.* TO 'nhahang'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import database
mysql -u nhahang -p < /path/to/database.sql
```

### Bước 3: Upload code lên VPS

```bash
# Dùng git
cd /var/www
git clone <your-repo-url> nhahangphoco
cd nhahangphoco

# Hoặc dùng SCP
scp -r restaurant-project/ user@your-vps-ip:/var/www/nhahangphoco
```

### Bước 4: Cấu hình .env trên server

```bash
cd /var/www/nhahangphoco
nano .env
```

```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=nhahang
DB_PASSWORD=StrongPassword123!
DB_NAME=nhahangphoconb
ALLOWED_ORIGIN=https://yourdomain.com
```

### Bước 5: Cài đặt dependencies

```bash
npm install --production
```

### Bước 6: Dùng PM2 để quản lý process

```bash
# Cài PM2
sudo npm install -g pm2

# Khởi chạy
pm2 start server/server.js --name "nhahangphoco"

# Tự động restart khi VPS reboot
pm2 startup
pm2 save

# Các lệnh PM2 hữu ích
pm2 list              # Xem danh sách app
pm2 logs nhahangphoco # Xem log
pm2 restart nhahangphoco  # Restart
pm2 stop nhahangphoco     # Dừng
pm2 monit             # Monitor realtime
```

### Bước 7: Cấu hình Nginx Reverse Proxy

```bash
# Cài Nginx
sudo apt install -y nginx

# Tạo config
sudo nano /etc/nginx/sites-available/nhahangphoco
```

Nội dung file config Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect www to non-www
    if ($host = www.yourdomain.com) {
        return 301 https://yourdomain.com$request_uri;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2|svg)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Kích hoạt site:

```bash
sudo ln -s /etc/nginx/sites-available/nhahangphoco /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 8: Cấu hình Domain

1. Vào nhà cung cấp domain (GoDaddy, Namecheap, Tenten...)
2. Tạo **A Record**:
   - **Host**: `@` → Trỏ về IP VPS
   - **Host**: `www` → Trỏ về IP VPS
3. Đợi DNS propagate (5 phút - 48 giờ)

### Bước 9: Cài SSL (HTTPS) bằng Let's Encrypt

```bash
# Cài Certbot
sudo apt install -y certbot python3-certbot-nginx

# Tạo SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Tự động renew
sudo certbot renew --dry-run
```

---

## 📁 Cấu trúc thư mục

```
restaurant-project/
│
├── client/                    # Frontend
│   ├── index.html             # Trang chính (SPA)
│   ├── css/style.css          # Stylesheet
│   └── js/script.js           # JavaScript
│
├── server/                    # Backend
│   ├── server.js              # Entry point
│   ├── config/db.js           # MySQL connection
│   ├── models/                # Data layer
│   │   ├── menuModel.js
│   │   ├── reservationModel.js
│   │   └── contactModel.js
│   ├── controllers/           # Business logic
│   │   ├── menuController.js
│   │   ├── reservationController.js
│   │   └── contactController.js
│   └── routes/                # API routes
│       ├── menuRoutes.js
│       ├── reservationRoutes.js
│       └── contactRoutes.js
│
├── database.sql               # SQL schema + seed data
├── package.json
├── .env                       # Environment variables
├── .gitignore
└── README.md
```

---

## ✅ Tính năng

- [x] Responsive mobile-first design
- [x] Single-page navigation mượt mà
- [x] Thực đơn load từ API với filter theo danh mục
- [x] Form đặt bàn với validation frontend + backend
- [x] Form liên hệ
- [x] Gallery ảnh
- [x] Scroll animations
- [x] Toast notification
- [x] Chống SQL injection (parameterized queries)
- [x] CORS configuration
- [x] Input validation (express-validator)
- [x] Fallback data khi API chưa sẵn sàng

---

**Dev by Mphong** 🏮
