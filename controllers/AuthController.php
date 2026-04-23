<?php
require_once __DIR__ . '/../config/database.php';

class AuthController {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function login() {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        
        if (!$data || !isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Email and password required"]);
            return;
        }
        
        try {
            $query = "SELECT id, full_name, email, password_hash, user_type FROM users WHERE email = :email";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([':email' => $data['email']]);
            $user = $stmt->fetch();
            
            if ($user) {
                echo json_encode([
                    "success" => true,
                    "message" => "Login successful",
                    "data" => [
                        "id" => $user['id'],
                        "name" => $user['full_name'],
                        "email" => $user['email'],
                        "user_type" => $user['user_type'],
                        "token" => bin2hex(random_bytes(32))
                    ]
                ]);
                return;
            }
            
            http_response_code(401);
            echo json_encode(["success" => false, "error" => "Invalid credentials"]);
            
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
        }
    }

    public function register() {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        
        if (!$data || !isset($data['email']) || !isset($data['password']) || !isset($data['full_name'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "All fields are required"]);
            return;
        }
        
        try {
            $checkQuery = "SELECT id FROM users WHERE email = :email";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->execute([':email' => $data['email']]);
            
            if ($checkStmt->fetch()) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Email already exists"]);
                return;
            }
            
            $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
            
            $query = "INSERT INTO users (full_name, email, password_hash, phone, user_type) 
                      VALUES (:full_name, :email, :password_hash, :phone, :user_type) RETURNING id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':full_name' => $data['full_name'],
                ':email' => $data['email'],
                ':password_hash' => $password_hash,
                ':phone' => $data['phone'] ?? '',
                ':user_type' => $data['user_type'] ?? 'graduate'
            ]);
            
            $user = $stmt->fetch();
            $user_id = $user['id'];
            
            if ($data['user_type'] === 'graduate') {
                $gradQuery = "INSERT INTO graduates (user_id) VALUES (:user_id)";
                $gradStmt = $this->conn->prepare($gradQuery);
                $gradStmt->execute([':user_id' => $user_id]);
            } elseif ($data['user_type'] === 'employer') {
                $empQuery = "INSERT INTO employers (user_id, company_name) VALUES (:user_id, :company_name)";
                $empStmt = $this->conn->prepare($empQuery);
                $empStmt->execute([
                    ':user_id' => $user_id,
                    ':company_name' => $data['full_name']
                ]);
            }
            
            echo json_encode([
                "success" => true,
                "message" => "User registered successfully",
                "user_id" => $user_id
            ]);
            
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
        }
    }
}
?>
