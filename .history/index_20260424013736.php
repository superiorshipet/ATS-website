<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (strpos($path, '/api/') === 0) {
    header("Content-Type: application/json");
    require_once __DIR__ . '/config/database.php';
    require_once __DIR__ . '/routes/api.php';
    exit;
}

// Serve static files (Vite build output is in dist/)
$file_path = __DIR__ . $path;
if (strpos($path, '/assets/') === 0) {
    $file_path = __DIR__ . '/dist' . $path;
}
if (is_file($file_path)) {
    $ext = pathinfo($file_path, PATHINFO_EXTENSION);
    $mime = 'application/octet-stream';
    if ($ext === 'css') $mime = 'text/css';
    elseif ($ext === 'js') $mime = 'application/javascript';
    elseif ($ext === 'html') $mime = 'text/html';
    elseif ($ext === 'png') $mime = 'image/png';
    elseif ($ext === 'jpg' || $ext === 'jpeg') $mime = 'image/jpeg';
    elseif ($ext === 'gif') $mime = 'image/gif';
    elseif ($ext === 'svg') $mime = 'image/svg+xml';
    elseif ($ext === 'json') $mime = 'application/json';
    header('Content-Type: ' . $mime);
    readfile($file_path);
    exit;
}

// SPA fallback
$spa = __DIR__ . '/dist/index.html';
if (file_exists($spa)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($spa);
    exit;
}

header('Content-Type: application/json');
http_response_code(404);
echo json_encode(['error' => 'Not Found', 'path' => $path]);
?>
