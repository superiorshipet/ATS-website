<?php
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

$path = parse_url($request_uri, PHP_URL_PATH);
$path = ltrim($path, '/');
$path = str_replace('index.php', '', $path);
$path = trim($path, '/');

// Test endpoint
if ($path === 'test') {
    echo json_encode(["message" => "API is working!"]);
    return;
}

// ==================== AUTH ====================
if ($path === 'api/auth/login' && $request_method === 'POST') {
    require_once __DIR__ . '/../controllers/AuthController.php';
    $controller = new AuthController();
    $controller->login();
    return;
}

if ($path === 'api/auth/register' && $request_method === 'POST') {
    require_once __DIR__ . '/../controllers/AuthController.php';
    $controller = new AuthController();
    $controller->register();
    return;
}

// ==================== JOBS ====================
if ($path === 'api/jobs' && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/JobController.php';
    $controller = new JobController();
    $controller->getAllJobs();
    return;
}

if ($path === 'api/jobs' && $request_method === 'POST') {
    require_once __DIR__ . '/../controllers/JobController.php';
    $controller = new JobController();
    $controller->createJob();
    return;
}

if (preg_match('/^api\/jobs\/(\d+)$/', $path, $matches) && $request_method === 'DELETE') {
    require_once __DIR__ . '/../controllers/JobController.php';
    $controller = new JobController();
    $controller->deleteJob($matches[1]);
    return;
}

// ==================== PROFILE ====================
if ($path === 'api/profile' && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/ProfileController.php';
    $controller = new ProfileController();
    $controller->getProfile();
    return;
}

if ($path === 'api/profile' && $request_method === 'PUT') {
    require_once __DIR__ . '/../controllers/ProfileController.php';
    $controller = new ProfileController();
    $controller->updateProfile();
    return;
}

if ($path === 'api/profile/avatar' && $request_method === 'POST') {
    require_once __DIR__ . '/../controllers/ProfileController.php';
    $controller = new ProfileController();
    $controller->uploadAvatar();
    return;
}

// ==================== CV ====================
if ($path === 'api/cv' && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/CVController.php';
    $controller = new CVController();
    $controller->getCV();
    return;
}

if ($path === 'api/cv' && $request_method === 'POST') {
    require_once __DIR__ . '/../controllers/CVController.php';
    $controller = new CVController();
    $controller->saveCV();
    return;
}

if ($path === 'api/cv/upload' && $request_method === 'POST') {
    require_once __DIR__ . '/../controllers/CVController.php';
    $controller = new CVController();
    $controller->uploadCVFile();
    return;
}

// ==================== APPLICATIONS ====================
if ($path === 'api/applications' && $request_method === 'POST') {
    require_once __DIR__ . '/../controllers/ApplicationController.php';
    $controller = new ApplicationController();
    $controller->applyToJob();
    return;
}

if ($path === 'api/applications' && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/ApplicationController.php';
    $controller = new ApplicationController();
    $controller->getUserApplications();
    return;
}

if (preg_match('/^api\/applications\/(\d+)\/status$/', $path, $matches) && $request_method === 'PUT') {
    require_once __DIR__ . '/../controllers/ApplicationController.php';
    $controller = new ApplicationController();
    $controller->updateApplicationStatus($matches[1]);
    return;
}

if (preg_match('/^api\/applications\/job\/(\d+)$/', $path, $matches) && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/ApplicationController.php';
    $controller = new ApplicationController();
    $controller->getJobApplications($matches[1]);
    return;
}

// ==================== ADMIN ====================
if ($path === 'api/admin/stats' && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/AdminController.php';
    $controller = new AdminController();
    $controller->getStats();
    return;
}

if ($path === 'api/admin/users' && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/AdminController.php';
    $controller = new AdminController();
    $controller->getAllUsers();
    return;
}

// Admin - Get all jobs
if ($path === "api/admin/jobs" && $request_method === "GET") {
    require_once __DIR__ . "/../controllers/AdminController.php";
    $controller = new AdminController();
    $controller->getAllJobs();
    return;
}

// Admin - Get all companies
if ($path === "api/admin/companies" && $request_method === "GET") {
    require_once __DIR__ . "/../controllers/AdminController.php";
    $controller = new AdminController();
    $controller->getAllCompanies();
    return;
}

// Admin - Get all graduates
if ($path === "api/admin/graduates" && $request_method === "GET") {
    require_once __DIR__ . "/../controllers/AdminController.php";
    $controller = new AdminController();
    $controller->getAllGraduates();
    return;
}

// Admin - Create new admin
if ($path === "api/admin/create" && $request_method === "POST") {
    require_once __DIR__ . "/../controllers/AdminController.php";
    $controller = new AdminController();
    $controller->createAdmin();
    return;
}

// Admin - Update any job
if (preg_match("/^api/admin/jobs/(d+)$/", $path, $matches) && $request_method === "PUT") {
    require_once __DIR__ . "/../controllers/AdminController.php";
    $controller = new AdminController();
    $controller->updateJob($matches[1]);
    return;
}

// Admin - Delete any job
if (preg_match("/^api/admin/jobs/(d+)$/", $path, $matches) && $request_method === "DELETE") {
    require_once __DIR__ . "/../controllers/AdminController.php";
    $controller = new AdminController();
    $controller->deleteJob($matches[1]);
    return;
}

// 404 - Not Found

// GET /api/applications/job/{id} - Get applications for specific job
if (preg_match('/^api\/applications\/job\/(\d+)$/', $path, $matches) && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/ApplicationController.php';
    $controller = new ApplicationController();
    $controller->getJobApplications($matches[1]);
    return;
}

// GET /api/jobs/{id} - Get single job
if (preg_match('/^api\/jobs\/(\d+)$/', $path, $matches) && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/JobController.php';
    $controller = new JobController();
    $controller->getJobById($matches[1]);
    return;
}

// GET /api/applications/employer - Get applications for employer
if ($path === 'api/applications/employer' && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/ApplicationController.php';
    $controller = new ApplicationController();
    $controller->getEmployerApplications();
    return;
}
http_response_code(404);
echo json_encode(["error" => "Endpoint not found", "path" => $path, "method" => $request_method]);
?>

// PUT /api/jobs/{id} - Update job
if (preg_match('/^api\/jobs\/(\d+)$/', $path, $matches) && $request_method === 'PUT') {
    require_once __DIR__ . '/../controllers/JobController.php';
    $controller = new JobController();
    $controller->updateJob($matches[1]);
    return;
}

// Admin - Create new admin
if ($path === 'api/admin/create' && $request_method === 'POST') {
    require_once __DIR__ . '/../controllers/AdminController.php';
    $controller = new AdminController();
    $controller->createAdmin();
    return;
}

// Admin - Get all jobs
if ($path === 'api/admin/jobs' && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/AdminController.php';
    $controller = new AdminController();
    $controller->getAllJobs();
    return;
}

// Admin - Update any job
if (preg_match('/^api\/admin\/jobs\/(\d+)$/', $path, $matches) && $request_method === 'PUT') {
    require_once __DIR__ . '/../controllers/AdminController.php';
    $controller = new AdminController();
    $controller->updateJob($matches[1]);
    return;
}

// Admin - Delete any job
if (preg_match('/^api\/admin\/jobs\/(\d+)$/', $path, $matches) && $request_method === 'DELETE') {
    require_once __DIR__ . '/../controllers/AdminController.php';
    $controller = new AdminController();
    $controller->deleteJob($matches[1]);
    return;
}

// Admin - Get all companies
if ($path === 'api/admin/companies' && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/AdminController.php';
    $controller = new AdminController();
    $controller->getAllCompanies();
    return;
}

// Admin - Get all graduates
if ($path === 'api/admin/graduates' && $request_method === 'GET') {
    require_once __DIR__ . '/../controllers/AdminController.php';
    $controller = new AdminController();
    $controller->getAllGraduates();
    return;
}
