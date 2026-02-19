<?php
/* =====================================================
 * Nhà Hàng Phố Cổ - PHP Backend Helpers
 * Database connection, Auth, CORS, Utilities
 * ===================================================== */

require_once __DIR__ . '/config.php';

// =====================================================
// DATABASE CONNECTION (PDO + MySQL)
// =====================================================
$pdo = null;

function getDB() {
    global $pdo;
    if ($pdo !== null) return $pdo;

    try {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log('Database connection error: ' . $e->getMessage());
        jsonResponse(500, false, 'Lỗi kết nối database');
        exit;
    }
}

// =====================================================
// CORS HEADERS
// =====================================================
function cors() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

// =====================================================
// NO-CACHE HEADERS
// =====================================================
function noCache() {
    header('Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Surrogate-Control: no-store');
}

// =====================================================
// JSON RESPONSE
// =====================================================
function jsonResponse($statusCode, $success, $message = '', $data = null, $extra = []) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');

    $response = ['success' => $success];
    if ($message) $response['message'] = $message;
    if ($data !== null) $response['data'] = $data;
    foreach ($extra as $key => $val) {
        $response[$key] = $val;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// =====================================================
// GET JSON INPUT (from request body)
// =====================================================
function getJsonInput() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// =====================================================
// XSS SANITIZATION
// =====================================================
function sanitize($value) {
    if (is_array($value)) {
        return array_map('sanitize', $value);
    }
    if (is_string($value)) {
        return htmlspecialchars(strip_tags($value), ENT_QUOTES, 'UTF-8');
    }
    return $value;
}

// =====================================================
// ADMIN AUTHENTICATION
// =====================================================
function requireAdmin() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (empty($authHeader) || strpos($authHeader, 'Bearer ') !== 0) {
        jsonResponse(401, false, 'Yêu cầu đăng nhập admin');
    }

    $token = substr($authHeader, 7);
    $decoded = base64_decode($token, true);

    if ($decoded === false) {
        jsonResponse(401, false, 'Token không hợp lệ');
    }

    // Token format: "admin:{timestamp}"
    if (strpos($decoded, 'admin:') !== 0) {
        jsonResponse(401, false, 'Token không hợp lệ');
    }

    $timestamp = intval(substr($decoded, 6));
    $now = round(microtime(true) * 1000); // milliseconds like JS Date.now()
    $diff = $now - $timestamp;

    // Token hết hạn sau 24 giờ
    if ($diff > 24 * 60 * 60 * 1000 || $diff < 0) {
        jsonResponse(401, false, 'Phiên đăng nhập đã hết hạn');
    }
}

// =====================================================
// VALIDATION HELPERS
// =====================================================
function validateRequired($data, $fields) {
    $errors = [];
    foreach ($fields as $field => $label) {
        if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
            $errors[] = ['field' => $field, 'message' => "Vui lòng nhập $label"];
        }
    }
    return $errors;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validatePhone($phone) {
    return preg_match('/^(0|\+84)[0-9]{9,10}$/', $phone);
}

function validateDate($date) {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}

function validateTime($time) {
    return preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $time);
}

// =====================================================
// FILE UPLOAD HELPER
// =====================================================
function handleFileUpload($fileKey, $allowedExts, $maxSize) {
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
        $errorCode = $_FILES[$fileKey]['error'] ?? UPLOAD_ERR_NO_FILE;
        $errorMsg = match($errorCode) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'File quá lớn',
            UPLOAD_ERR_NO_FILE => 'Không có file',
            default => 'Lỗi upload file'
        };
        return ['error' => $errorMsg];
    }

    $file = $_FILES[$fileKey];

    // Check size
    if ($file['size'] > $maxSize) {
        $maxMB = round($maxSize / (1024 * 1024));
        return ['error' => "File quá lớn (tối đa {$maxMB}MB)"];
    }

    // Check extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExts)) {
        return ['error' => 'Loại file không được hỗ trợ'];
    }

    // Ensure upload dir exists
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }

    // Generate unique filename
    $newName = 'img_' . time() . '_' . substr(md5(uniqid()), 0, 8) . '.' . $ext;
    $destPath = UPLOAD_DIR . $newName;

    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        return ['error' => 'Lỗi lưu file'];
    }

    return ['url' => UPLOAD_URL_PREFIX . $newName, 'filename' => $newName];
}

// =====================================================
// 404 HANDLER
// =====================================================
function notFound() {
    $method = $_SERVER['REQUEST_METHOD'];
    $uri = $_SERVER['REQUEST_URI'];
    jsonResponse(404, false, "API endpoint không tồn tại: $method $uri");
}
