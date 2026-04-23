<?php
require_once __DIR__ . '/../config/database.php';

class AdminController {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    public function getStats() {
        $stats = [];
        $stmt = $this->conn->query("SELECT COUNT(*) as total FROM graduates");
        $stats['total_graduates'] = $stmt->fetch()['total'];
        $stmt = $this->conn->query("SELECT COUNT(*) as total FROM employers");
        $stats['total_employers'] = $stmt->fetch()['total'];
        $stmt = $this->conn->query("SELECT COUNT(*) as total FROM jobs WHERE status = 'active'");
        $stats['active_jobs'] = $stmt->fetch()['total'];
        $stmt = $this->conn->query("SELECT COUNT(*) as total FROM jobs");
        $stats['total_jobs'] = $stmt->fetch()['total'];
        $stmt = $this->conn->query("SELECT COUNT(*) as total FROM applications");
        $stats['total_applications'] = $stmt->fetch()['total'];
        $stmt = $this->conn->query("SELECT COUNT(*) as total FROM users");
        $stats['total_users'] = $stmt->fetch()['total'];
        echo json_encode(["success" => true, "data" => $stats]);
    }
    
    public function getAllUsers() {
        $query = "SELECT id, full_name, email, phone, user_type, is_active, created_at 
                  FROM users ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll();
        echo json_encode(["success" => true, "data" => $users]);
    }
    
    public function getUserById($id) {
        $query = "SELECT id, full_name, email, phone, user_type, is_active, created_at 
                  FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();
        echo json_encode(["success" => true, "data" => $user]);
    }
    
    public function updateUserStatus($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $isActive = $data['is_active'] ? 'true' : 'false';
        $query = "UPDATE users SET is_active = :is_active WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute([':is_active' => $isActive, ':id' => $id]);
        echo json_encode(["success" => $result]);
    }
    
    public function deleteUser($id) {
        $query = "DELETE FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute([':id' => $id]);
        echo json_encode(["success" => $result]);
    }
    
    public function createAdmin() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $checkQuery = "SELECT id FROM users WHERE email = :email";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->execute([':email' => $data['email']]);
        
        if ($checkStmt->fetch()) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Email already exists"]);
            return;
        }
        
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        $query = "INSERT INTO users (full_name, email, password_hash, phone, user_type, is_active) 
                  VALUES (:full_name, :email, :password_hash, :phone, 'admin', true) RETURNING id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            ':full_name' => $data['full_name'],
            ':email' => $data['email'],
            ':password_hash' => $password_hash,
            ':phone' => $data['phone'] ?? ''
        ]);
        $user = $stmt->fetch();
        
        echo json_encode(["success" => true, "message" => "Admin created successfully", "user_id" => $user['id']]);
    }
    
    public function getAllJobs() {
        $query = "SELECT j.*, u.full_name as company_name 
                  FROM jobs j 
                  LEFT JOIN employers e ON j.employer_id = e.user_id
                  LEFT JOIN users u ON e.user_id = u.id
                  ORDER BY j.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $jobs = $stmt->fetchAll();
        echo json_encode(["success" => true, "data" => $jobs]);
    }
    
    public function updateJob($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $skillsValue = null;
        if (isset($data['skills']) && is_array($data['skills'])) {
            $skillsValue = '{' . implode(',', array_map(function($s) { 
                return '"' . addslashes($s) . '"'; 
            }, $data['skills'])) . '}';
        }
        
        $query = "UPDATE jobs SET 
                    title = :title,
                    department = :department,
                    location = :location,
                    job_type = :job_type,
                    salary_range = :salary_range,
                    description = :description,
                    requirements = :requirements,
                    skills = :skills,
                    status = :status
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute([
            ':title' => $data['title'],
            ':department' => $data['department'] ?? '',
            ':location' => $data['location'] ?? '',
            ':job_type' => $data['job_type'] ?? 'fulltime',
            ':salary_range' => $data['salary_range'] ?? '',
            ':description' => $data['description'] ?? '',
            ':requirements' => $data['requirements'] ?? '',
            ':skills' => $skillsValue,
            ':status' => $data['status'] ?? 'active',
            ':id' => $id
        ]);
        
        echo json_encode(["success" => $result, "message" => $result ? "Job updated" : "Update failed"]);
    }
    
    public function deleteJob($id) {
        $query = "DELETE FROM jobs WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute([':id' => $id]);
        echo json_encode(["success" => $result]);
    }
    
    public function getAllCompanies() {
        $query = "SELECT u.id, u.full_name, u.email, u.phone, u.is_active, u.created_at,
                  e.company_name, e.sector, e.employee_count, e.is_verified
                  FROM users u 
                  JOIN employers e ON u.id = e.user_id
                  ORDER BY u.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $companies = $stmt->fetchAll();
        echo json_encode(["success" => true, "data" => $companies]);
    }
    
    public function getAllGraduates() {
        $query = "SELECT u.id, u.full_name, u.email, u.phone, u.is_active, u.created_at,
                  g.location, g.major, g.graduation_year, g.gpa, g.skills
                  FROM users u 
                  JOIN graduates g ON u.id = g.user_id
                  ORDER BY u.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $graduates = $stmt->fetchAll();
        echo json_encode(["success" => true, "data" => $graduates]);
    }
}
?>
