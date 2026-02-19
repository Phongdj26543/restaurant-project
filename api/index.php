<?php
/* =====================================================
 * Nhà Hàng Phố Cổ - PHP API Router
 * Handles all /api/* requests
 * ===================================================== */

require_once __DIR__ . '/helpers.php';

// CORS headers for all requests
cors();

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// No-cache for API responses
noCache();

// =====================================================
// PARSE ROUTE
// =====================================================
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove /api/ prefix (handle both /api/xxx and direct routing)
$route = $requestUri;
if (preg_match('#/api/(.*)#', $requestUri, $m)) {
    $route = $m[1];
}
$route = trim($route, '/');
$parts = $route ? explode('/', $route) : [''];

// =====================================================
// ROUTING
// =====================================================
switch ($parts[0]) {
    case 'admin':
        if (isset($parts[1]) && $parts[1] === 'login' && $method === 'POST') {
            handleAdminLogin();
        } else {
            notFound();
        }
        break;

    case 'menu':
        handleMenu($parts, $method);
        break;

    case 'reservations':
        handleReservations($parts, $method);
        break;

    case 'contacts':
        handleContacts($parts, $method);
        break;

    case 'content':
        handleContent($method);
        break;

    case 'upload':
        handleUpload();
        break;

    case 'upload-video':
        handleVideoUpload();
        break;

    case 'analytics':
        handleAnalytics();
        break;

    case 'health':
        handleHealth();
        break;

    default:
        notFound();
}

// =====================================================
// ADMIN LOGIN
// =====================================================
function handleAdminLogin() {
    $input = getJsonInput();
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        // Generate token same format as Node.js: base64("admin:{timestamp_ms}")
        $timestamp = round(microtime(true) * 1000);
        $token = base64_encode("admin:$timestamp");
        jsonResponse(200, true, '', null, ['token' => $token]);
    } else {
        jsonResponse(401, false, 'Tài khoản hoặc mật khẩu không đúng');
    }
}

// =====================================================
// MENU HANDLERS
// =====================================================
function handleMenu($parts, $method) {
    $db = getDB();

    // GET /api/menu
    if ($method === 'GET' && count($parts) === 1) {
        getMenuActive($db);
    }
    // GET /api/menu/all
    elseif ($method === 'GET' && isset($parts[1]) && $parts[1] === 'all') {
        getMenuAll($db);
    }
    // GET /api/menu/categories
    elseif ($method === 'GET' && isset($parts[1]) && $parts[1] === 'categories') {
        getMenuCategories($db);
    }
    // GET /api/menu/:id
    elseif ($method === 'GET' && isset($parts[1]) && is_numeric($parts[1])) {
        getMenuItem($db, (int)$parts[1]);
    }
    // POST /api/menu
    elseif ($method === 'POST' && count($parts) === 1) {
        requireAdmin();
        createMenuItem($db);
    }
    // PUT /api/menu/:id
    elseif ($method === 'PUT' && isset($parts[1]) && is_numeric($parts[1])) {
        requireAdmin();
        updateMenuItem($db, (int)$parts[1]);
    }
    // DELETE /api/menu/:id
    elseif ($method === 'DELETE' && isset($parts[1]) && is_numeric($parts[1])) {
        requireAdmin();
        deleteMenuItem($db, (int)$parts[1]);
    }
    else {
        notFound();
    }
}

function getMenuActive($db) {
    $category = $_GET['category'] ?? null;

    if ($category) {
        $stmt = $db->prepare('SELECT * FROM menu WHERE is_active = 1 AND category = ? ORDER BY id ASC');
        $stmt->execute([sanitize($category)]);
    } else {
        $stmt = $db->query('SELECT * FROM menu WHERE is_active = 1 ORDER BY category ASC, id ASC');
    }

    $items = $stmt->fetchAll();

    // Group by category
    $grouped = [];
    foreach ($items as $item) {
        $cat = $item['category'];
        if (!isset($grouped[$cat])) $grouped[$cat] = [];
        $grouped[$cat][] = $item;
    }

    jsonResponse(200, true, '', $items, ['grouped' => $grouped, 'total' => count($items)]);
}

function getMenuAll($db) {
    $stmt = $db->query('SELECT * FROM menu ORDER BY category ASC, id ASC');
    $items = $stmt->fetchAll();
    jsonResponse(200, true, '', $items, ['total' => count($items)]);
}

function getMenuCategories($db) {
    $stmt = $db->query('SELECT DISTINCT category FROM menu WHERE is_active = 1 ORDER BY category');
    $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
    jsonResponse(200, true, '', $categories);
}

function getMenuItem($db, $id) {
    $stmt = $db->prepare('SELECT * FROM menu WHERE id = ?');
    $stmt->execute([$id]);
    $item = $stmt->fetch();

    if (!$item) {
        jsonResponse(404, false, 'Không tìm thấy món ăn');
    }
    jsonResponse(200, true, '', $item);
}

function createMenuItem($db) {
    $input = getJsonInput();
    $input = sanitize($input);

    $name = $input['name'] ?? '';
    $description = $input['description'] ?? '';
    $price = isset($input['price']) ? (int)$input['price'] : 0;
    $image = $input['image'] ?? '';
    $category = $input['category'] ?? '';

    if (!$name || !$price || !$category) {
        jsonResponse(400, false, 'Thiếu thông tin bắt buộc (tên, giá, danh mục)');
    }

    $stmt = $db->prepare('INSERT INTO menu (name, description, price, image, category, is_active) VALUES (?, ?, ?, ?, ?, 1)');
    $stmt->execute([$name, $description, $price, $image, $category]);

    $id = $db->lastInsertId();
    $item = ['id' => (int)$id, 'name' => $name, 'description' => $description, 'price' => $price, 'image' => $image, 'category' => $category, 'is_active' => 1];

    jsonResponse(201, true, 'Đã thêm món mới', $item);
}

function updateMenuItem($db, $id) {
    $input = getJsonInput();

    $fields = [];
    $values = [];

    foreach (['name', 'description', 'image', 'category'] as $field) {
        if (isset($input[$field])) {
            $fields[] = "$field = ?";
            $values[] = sanitize($input[$field]);
        }
    }
    if (isset($input['price'])) {
        $fields[] = 'price = ?';
        $values[] = (int)$input['price'];
    }
    if (isset($input['is_active'])) {
        $fields[] = 'is_active = ?';
        $values[] = (int)$input['is_active'];
    }

    if (empty($fields)) {
        jsonResponse(400, false, 'Không có dữ liệu cập nhật');
    }

    $values[] = $id;
    $sql = 'UPDATE menu SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($values);

    if ($stmt->rowCount() === 0) {
        // Check if item exists
        $check = $db->prepare('SELECT id FROM menu WHERE id = ?');
        $check->execute([$id]);
        if (!$check->fetch()) {
            jsonResponse(404, false, 'Không tìm thấy món ăn');
        }
    }

    // Return updated item
    $stmt = $db->prepare('SELECT * FROM menu WHERE id = ?');
    $stmt->execute([$id]);
    $item = $stmt->fetch();
    jsonResponse(200, true, 'Đã cập nhật món', $item);
}

function deleteMenuItem($db, $id) {
    $stmt = $db->prepare('DELETE FROM menu WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(404, false, 'Không tìm thấy món ăn');
    }
    jsonResponse(200, true, 'Đã xóa món');
}

// =====================================================
// RESERVATION HANDLERS
// =====================================================
function handleReservations($parts, $method) {
    $db = getDB();

    // POST /api/reservations
    if ($method === 'POST' && count($parts) === 1) {
        createReservation($db);
    }
    // GET /api/reservations
    elseif ($method === 'GET' && count($parts) === 1) {
        getReservations($db);
    }
    // PUT /api/reservations/:id/status
    elseif ($method === 'PUT' && isset($parts[1]) && is_numeric($parts[1]) && isset($parts[2]) && $parts[2] === 'status') {
        requireAdmin();
        updateReservationStatus($db, (int)$parts[1]);
    }
    // DELETE /api/reservations/:id
    elseif ($method === 'DELETE' && isset($parts[1]) && is_numeric($parts[1])) {
        requireAdmin();
        deleteReservation($db, (int)$parts[1]);
    }
    else {
        notFound();
    }
}

function createReservation($db) {
    $input = getJsonInput();

    // Validation
    $errors = [];

    $name = trim($input['name'] ?? '');
    if (!$name || mb_strlen($name) < 2 || mb_strlen($name) > 255) {
        $errors[] = ['field' => 'name', 'message' => 'Họ tên từ 2-255 ký tự'];
    }

    $phone = trim($input['phone'] ?? '');
    if (!validatePhone($phone)) {
        $errors[] = ['field' => 'phone', 'message' => 'Số điện thoại không hợp lệ'];
    }

    $email = trim($input['email'] ?? '');
    if ($email && !validateEmail($email)) {
        $errors[] = ['field' => 'email', 'message' => 'Email không hợp lệ'];
    }

    $date = $input['date'] ?? '';
    if (!validateDate($date)) {
        $errors[] = ['field' => 'date', 'message' => 'Ngày không hợp lệ'];
    }

    $time = $input['time'] ?? '';
    if (!validateTime($time)) {
        $errors[] = ['field' => 'time', 'message' => 'Giờ không hợp lệ'];
    }

    $guests = isset($input['guests']) ? (int)$input['guests'] : 0;
    if ($guests < 1 || $guests > 50) {
        $errors[] = ['field' => 'guests', 'message' => 'Số khách từ 1-50 người'];
    }

    if (!empty($errors)) {
        jsonResponse(400, false, 'Dữ liệu không hợp lệ', null, ['errors' => $errors]);
    }

    // Check date >= today
    $reservationDate = new DateTime($date);
    $today = new DateTime('today');
    if ($reservationDate < $today) {
        jsonResponse(400, false, 'Ngày đặt bàn không thể là ngày trong quá khứ');
    }

    $note = sanitize(trim($input['note'] ?? ''));
    $preOrder = $input['preOrder'] ?? null;
    $preOrderJson = $preOrder ? json_encode($preOrder, JSON_UNESCAPED_UNICODE) : null;

    $stmt = $db->prepare('INSERT INTO reservations (name, phone, email, date, time, guests, note, pre_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "pending")');
    $stmt->execute([
        sanitize($name),
        sanitize($phone),
        $email ? sanitize($email) : null,
        $date,
        $time,
        $guests,
        $note ?: null,
        $preOrderJson
    ]);

    $id = $db->lastInsertId();
    $reservation = [
        'id' => (int)$id,
        'name' => $name,
        'phone' => $phone,
        'email' => $email ?: null,
        'date' => $date,
        'time' => $time,
        'guests' => $guests,
        'note' => $note ?: null,
        'pre_order' => $preOrder,
        'status' => 'pending',
        'created_at' => date('c')
    ];

    jsonResponse(201, true, 'Đặt bàn thành công! Chúng tôi sẽ liên hệ xác nhận.', $reservation);
}

function getReservations($db) {
    $date = $_GET['date'] ?? null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    if ($date) {
        $stmt = $db->prepare('SELECT * FROM reservations WHERE date = ? ORDER BY time ASC');
        $stmt->execute([$date]);
    } else {
        $stmt = $db->prepare('SELECT * FROM reservations ORDER BY created_at DESC LIMIT ? OFFSET ?');
        $stmt->execute([$limit, $offset]);
    }

    $reservations = $stmt->fetchAll();

    // Decode pre_order JSON for each
    foreach ($reservations as &$r) {
        if (isset($r['pre_order']) && is_string($r['pre_order'])) {
            $r['pre_order'] = json_decode($r['pre_order'], true);
        }
    }

    jsonResponse(200, true, '', $reservations, ['total' => count($reservations)]);
}

function updateReservationStatus($db, $id) {
    $input = getJsonInput();
    $status = $input['status'] ?? '';

    if (!in_array($status, ['pending', 'confirmed', 'cancelled'])) {
        jsonResponse(400, false, 'Trạng thái không hợp lệ');
    }

    $stmt = $db->prepare('UPDATE reservations SET status = ? WHERE id = ?');
    $stmt->execute([$status, $id]);

    if ($stmt->rowCount() === 0) {
        $check = $db->prepare('SELECT id FROM reservations WHERE id = ?');
        $check->execute([$id]);
        if (!$check->fetch()) {
            jsonResponse(404, false, 'Không tìm thấy đơn đặt bàn');
        }
    }

    jsonResponse(200, true, 'Cập nhật trạng thái thành công');
}

function deleteReservation($db, $id) {
    $stmt = $db->prepare('DELETE FROM reservations WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(404, false, 'Không tìm thấy đơn đặt bàn');
    }
    jsonResponse(200, true, 'Xóa đơn đặt bàn thành công');
}

// =====================================================
// CONTACT HANDLERS
// =====================================================
function handleContacts($parts, $method) {
    $db = getDB();

    // POST /api/contacts
    if ($method === 'POST' && count($parts) === 1) {
        createContact($db);
    }
    // GET /api/contacts
    elseif ($method === 'GET' && count($parts) === 1) {
        getContacts($db);
    }
    // DELETE /api/contacts/:id
    elseif ($method === 'DELETE' && isset($parts[1]) && is_numeric($parts[1])) {
        requireAdmin();
        deleteContact($db, (int)$parts[1]);
    }
    else {
        notFound();
    }
}

function createContact($db) {
    $input = getJsonInput();

    // Validation
    $errors = [];

    $name = trim($input['name'] ?? '');
    if (!$name || mb_strlen($name) < 2 || mb_strlen($name) > 255) {
        $errors[] = ['field' => 'name', 'message' => 'Họ tên từ 2-255 ký tự'];
    }

    $email = trim($input['email'] ?? '');
    if (!$email || !validateEmail($email)) {
        $errors[] = ['field' => 'email', 'message' => 'Email không hợp lệ'];
    }

    $message = trim($input['message'] ?? '');
    if (!$message || mb_strlen($message) < 10) {
        $errors[] = ['field' => 'message', 'message' => 'Nội dung tối thiểu 10 ký tự'];
    }

    if (!empty($errors)) {
        jsonResponse(400, false, 'Dữ liệu không hợp lệ', null, ['errors' => $errors]);
    }

    $subject = sanitize(trim($input['subject'] ?? ''));

    $stmt = $db->prepare('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)');
    $stmt->execute([sanitize($name), sanitize($email), $subject ?: null, sanitize($message)]);

    $id = $db->lastInsertId();
    $contact = [
        'id' => (int)$id,
        'name' => $name,
        'email' => $email,
        'subject' => $subject ?: null,
        'message' => $message,
        'created_at' => date('c')
    ];

    jsonResponse(201, true, 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.', $contact);
}

function getContacts($db) {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    $stmt = $db->prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?');
    $stmt->execute([$limit, $offset]);
    $contacts = $stmt->fetchAll();

    jsonResponse(200, true, '', $contacts, ['total' => count($contacts)]);
}

function deleteContact($db, $id) {
    $stmt = $db->prepare('DELETE FROM contacts WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(404, false, 'Không tìm thấy tin nhắn');
    }
    jsonResponse(200, true, 'Xóa tin nhắn thành công');
}

// =====================================================
// CONTENT HANDLERS
// =====================================================
function handleContent($method) {
    $db = getDB();

    if ($method === 'GET') {
        getContent($db);
    } elseif ($method === 'PUT') {
        requireAdmin();
        updateContent($db);
    } else {
        notFound();
    }
}

function getContent($db) {
    try {
        $stmt = $db->prepare("SELECT data FROM content WHERE content_key = 'main'");
        $stmt->execute();
        $row = $stmt->fetch();

        if ($row && isset($row['data'])) {
            $data = json_decode($row['data'], true);
            if ($data) {
                jsonResponse(200, true, '', $data);
            }
        }

        // Return default if not found
        jsonResponse(200, true, '', DEFAULT_CONTENT);
    } catch (Exception $e) {
        error_log('getContent error: ' . $e->getMessage());
        jsonResponse(200, true, '', DEFAULT_CONTENT);
    }
}

function updateContent($db) {
    $input = getJsonInput();

    if (empty($input)) {
        jsonResponse(400, false, 'Không có dữ liệu cập nhật');
    }

    // Read current content
    $stmt = $db->prepare("SELECT data FROM content WHERE content_key = 'main'");
    $stmt->execute();
    $row = $stmt->fetch();

    $current = DEFAULT_CONTENT;
    if ($row && isset($row['data'])) {
        $decoded = json_decode($row['data'], true);
        if ($decoded) $current = $decoded;
    }

    // Deep merge sections
    $updated = array_merge($current, $input);

    $sections = ['hero', 'about', 'contact', 'introVideo', 'stats', 'offer', 'floatingContact', 'socialLinks', 'footerHours'];
    foreach ($sections as $section) {
        if (isset($input[$section]) && is_array($input[$section]) && isset($current[$section]) && is_array($current[$section])) {
            $updated[$section] = array_merge($current[$section], $input[$section]);
        }
    }
    // Array sections (replace entirely)
    if (isset($input['gallery'])) $updated['gallery'] = $input['gallery'];
    if (isset($input['testimonials'])) $updated['testimonials'] = $input['testimonials'];

    $jsonData = json_encode($updated, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    // Upsert
    $stmt = $db->prepare("INSERT INTO content (content_key, data) VALUES ('main', ?) ON DUPLICATE KEY UPDATE data = VALUES(data)");
    $stmt->execute([$jsonData]);

    jsonResponse(200, true, 'Đã cập nhật nội dung thành công! Thay đổi sẽ hiển thị ngay.', $updated);
}

// =====================================================
// UPLOAD HANDLERS
// =====================================================
function handleUpload() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        notFound();
    }

    requireAdmin();

    $result = handleFileUpload('image', ALLOWED_IMAGE_EXTS, MAX_IMAGE_SIZE);

    if (isset($result['error'])) {
        jsonResponse(400, false, $result['error']);
    }

    jsonResponse(200, true, 'Upload thành công', null, ['url' => $result['url']]);
}

function handleVideoUpload() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        notFound();
    }

    requireAdmin();

    $result = handleFileUpload('video', ALLOWED_VIDEO_EXTS, MAX_VIDEO_SIZE);

    if (isset($result['error'])) {
        jsonResponse(400, false, $result['error']);
    }

    jsonResponse(200, true, 'Upload video thành công', null, ['url' => $result['url']]);
}

// =====================================================
// ANALYTICS HANDLER
// =====================================================
function handleAnalytics() {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        notFound();
    }

    $db = getDB();
    $period = $_GET['period'] ?? '30';

    // Get reservations
    if ($period === 'all') {
        $stmt = $db->query('SELECT * FROM reservations ORDER BY created_at DESC');
    } else {
        $days = (int)$period;
        $stmt = $db->prepare('SELECT * FROM reservations WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) ORDER BY created_at DESC');
        $stmt->execute([$days]);
    }

    $reservations = $stmt->fetchAll();

    // Decode pre_order JSON
    foreach ($reservations as &$r) {
        if (isset($r['pre_order']) && is_string($r['pre_order'])) {
            $r['pre_order'] = json_decode($r['pre_order'], true);
        }
    }
    unset($r);

    $totalRevenue = 0;
    $ordersWithPreOrder = 0;
    $totalGuests = 0;
    $dishCount = [];
    $dailyData = [];
    $statusCount = ['pending' => 0, 'confirmed' => 0, 'cancelled' => 0];

    foreach ($reservations as $r) {
        // Status count
        $st = $r['status'] ?? 'pending';
        $statusCount[$st] = ($statusCount[$st] ?? 0) + 1;

        // Guests (confirmed only)
        if ($st === 'confirmed') {
            $totalGuests += ($r['guests'] ?? 0);
        }

        // Pre-order revenue
        $preOrder = $r['pre_order'];
        if (is_string($preOrder)) {
            $preOrder = json_decode($preOrder, true);
        }

        $dateKey = $r['date'] ?? ($r['created_at'] ? explode(' ', $r['created_at'])[0] : 'unknown');
        if (!isset($dailyData[$dateKey])) {
            $dailyData[$dateKey] = ['orders' => 0, 'revenue' => 0, 'guests' => 0];
        }
        $dailyData[$dateKey]['orders']++;
        $dailyData[$dateKey]['guests'] += ($r['guests'] ?? 0);

        if (is_array($preOrder) && count($preOrder) > 0) {
            $ordersWithPreOrder++;
            $orderTotal = 0;
            foreach ($preOrder as $item) {
                $itemRevenue = ($item['price'] ?? 0) * ($item['qty'] ?? 1);
                $orderTotal += $itemRevenue;
                $name = $item['name'] ?? 'Không rõ';
                if (!isset($dishCount[$name])) $dishCount[$name] = ['qty' => 0, 'revenue' => 0];
                $dishCount[$name]['qty'] += ($item['qty'] ?? 1);
                $dishCount[$name]['revenue'] += $itemRevenue;
            }
            $totalRevenue += $orderTotal;
            $dailyData[$dateKey]['revenue'] += $orderTotal;
        }
    }

    // Top dishes sorted by quantity
    $topDishes = [];
    foreach ($dishCount as $name => $data) {
        $topDishes[] = ['name' => $name, 'qty' => $data['qty'], 'revenue' => $data['revenue']];
    }
    usort($topDishes, fn($a, $b) => $b['qty'] - $a['qty']);
    $topDishes = array_slice($topDishes, 0, 10);

    // Daily data sorted by date desc
    $dailySorted = [];
    foreach ($dailyData as $date => $data) {
        $dailySorted[] = ['date' => $date, 'orders' => $data['orders'], 'revenue' => $data['revenue'], 'guests' => $data['guests']];
    }
    usort($dailySorted, fn($a, $b) => strcmp($b['date'], $a['date']));

    jsonResponse(200, true, '', [
        'totalRevenue' => $totalRevenue,
        'ordersWithPreOrder' => $ordersWithPreOrder,
        'avgOrderValue' => $ordersWithPreOrder > 0 ? round($totalRevenue / $ordersWithPreOrder) : 0,
        'totalGuests' => $totalGuests,
        'totalReservations' => count($reservations),
        'statusCount' => $statusCount,
        'topDishes' => $topDishes,
        'daily' => $dailySorted
    ]);
}

// =====================================================
// HEALTH CHECK
// =====================================================
function handleHealth() {
    $dbOk = false;
    $dbError = '';

    try {
        $db = getDB();
        $db->query('SELECT 1');
        $dbOk = true;
    } catch (Exception $e) {
        $dbError = $e->getMessage();
    }

    jsonResponse(200, true, '', null, [
        'status' => $dbOk ? 'ok' : 'degraded',
        'message' => 'Nhà Hàng Phố Cổ API is running',
        'database' => [
            'connected' => $dbOk,
            'type' => 'MySQL',
            'error' => $dbError ?: null
        ],
        'timestamp' => date('c')
    ]);
}
