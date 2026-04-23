<?php
// API or Static/SPA router
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (strpos($path, '/api/') === 0) {
  require_once __DIR__ . '/config/database.php';
  require_once __DIR__ . '/routes/api.php';
  return;
}

// Serve static files
$file_path = __DIR__ . $path;
$extension = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));

$mime_types = [
  'css' => 'text/css',
  'js' => 'application/javascript',
  'json' => 'application/json',
  'png' => 'image/png',
  'jpg' => 'image/jpeg',
  'jpeg' => 'image/jpeg',
  'gif' => 'image/gif',
  'ico' => 'image/x-icon',
  'svg' => 'image/svg+xml',
  'woff' => 'font/woff',
  'woff2' => 'font/woff2',
  'ttf' => 'font/ttf',
  'pdf' => 'application/pdf'
];

if ($extension && isset($mime_types[$extension]) && file_exists($file_path)) {
  header('Content-Type: ' . $mime_types[$extension]);
  readfile($file_path);
  return;
}

// SPA fallback to dist/index.html
$spa_path = __DIR__ . '/dist/index.html';
if (file_exists($spa_path)) {
  header('Content-Type: text/html; charset=utf-8');
  readfile($spa_path);
  return;
}

http_response_code(404);
echo json_encode(['error' => 'Not Found']); 
?>
