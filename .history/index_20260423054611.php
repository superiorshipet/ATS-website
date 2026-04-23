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

// Serve static files
$file_path = __DIR__ . $path;
if (is_file($file_path)) {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file_path);
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
