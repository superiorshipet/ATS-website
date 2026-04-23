<?php
require_once __DIR__ . '/../config/database.php';

class ProfileController {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function getProfile() {
        $user_id = $_GET['user_id'] ?? $_GET['id'] ?? 1;
        $user_type = $_GET['user_type'] ?? 'graduate';
        
        $query = "SELECT id, full_name, email, phone, user_type, avatar_url, created_at 
                  FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $user_id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "User not found"]);
            return;
        }
        
        $response = [
            "id" => $user['id'],
            "full_name" => $user['full_name'],
            "email" => $user['email'],
            "phone" => $user['phone'] ?? '',
            "user_type" => $user['user_type'],
            "avatar_url" => $user['avatar_url'] ?? null,
            "joined_date" => date('F Y', strtotime($user['created_at']))
        ];
        
        if ($user_type === 'graduate') {
            $gradQuery = "SELECT location, bio, skills, graduation_year, major, gpa 
                          FROM graduates WHERE user_id = :id";
            $gradStmt = $this->conn->prepare($gradQuery);
            $gradStmt->execute([':id' => $user_id]);
            $grad = $gradStmt->fetch();
            
            if ($grad) {
                $response['location'] = $grad['location'] ?? '';
                $response['bio'] = $grad['bio'] ?? '';
                $response['skills'] = $grad['skills'] ? trim($grad['skills'], '{}') : '';
                $response['graduation_year'] = $grad['graduation_year'];
                $response['major'] = $grad['major'] ?? '';
                $response['gpa'] = $grad['gpa'];
            }
        } elseif ($user_type === 'employer') {
            $empQuery = "SELECT company_name, sector, employee_count, website, is_verified 
                          FROM employers WHERE user_id = :id";
            $empStmt = $this->conn->prepare($empQuery);
            $empStmt->execute([':id' => $user_id]);
            $emp = $empStmt->fetch();
            
            if ($emp) {
                $response['company_name'] = $emp['company_name'] ?? '';
                $response['sector'] = $emp['sector'] ?? '';
                $response['employee_count'] = $emp['employee_count'] ?? '';
                $response['website'] = $emp['website'] ?? '';
                $response['is_verified'] = $emp['is_verified'] ?? false;
            }
        }
        
        echo json_encode(["success" => true, "data" => $response]);
    }

    public function updateProfile() {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        
        $user_id = $data['user_id'] ?? 1;
        $user_type = $data['user_type'] ?? 'graduate';
        
        try {
            $userQuery = "UPDATE users SET full_name = :name, phone = :phone WHERE id = :id";
            $userStmt = $this->conn->prepare($userQuery);
            $userStmt->execute([
                ':name' => $data['full_name'],
                ':phone' => $data['phone'],
                ':id' => $user_id
            ]);
            
            if ($user_type === 'graduate') {
                $skillsValue = null;
                if (isset($data['skills']) && !empty($data['skills'])) {
                    $skillsArray = explode(',', $data['skills']);
                    $skillsArray = array_map('trim', $skillsArray);
                    $skillsValue = '{' . implode(',', array_map(function($s) { 
                        return '"' . addslashes($s) . '"'; 
                    }, $skillsArray)) . '}';
                }
                
                $gradQuery = "UPDATE graduates SET 
                              location = :location, bio = :bio, skills = :skills,
                              major = :major, graduation_year = :grad_year, gpa = :gpa 
                              WHERE user_id = :id";
                $gradStmt = $this->conn->prepare($gradQuery);
                $gradStmt->execute([
                    ':location' => $data['location'] ?? null,
                    ':bio' => $data['bio'] ?? null,
                    ':skills' => $skillsValue,
                    ':major' => $data['major'] ?? null,
                    ':grad_year' => isset($data['graduation_year']) ? (int)$data['graduation_year'] : null,
                    ':gpa' => isset($data['gpa']) ? (float)$data['gpa'] : null,
                    ':id' => $user_id
                ]);
            } elseif ($user_type === 'employer') {
                $empQuery = "UPDATE employers SET 
                              company_name = :company, sector = :sector, 
                              employee_count = :employees, website = :website 
                              WHERE user_id = :id";
                $empStmt = $this->conn->prepare($empQuery);
                $empStmt->execute([
                    ':company' => $data['company_name'] ?? $data['full_name'],
                    ':sector' => $data['sector'] ?? null,
                    ':employees' => $data['employee_count'] ?? null,
                    ':website' => $data['website'] ?? null,
                    ':id' => $user_id
                ]);
            }
            
            echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
            
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }

    public function uploadAvatar() {
        if (!isset($_FILES['avatar'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "No file uploaded"]);
            return;
        }
        
        $user_id = $_POST['user_id'] ?? 1;
        $upload_dir = __DIR__ . '/../uploads/avatars/';
        
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file = $_FILES['avatar'];
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = 'avatar_' . $user_id . '_' . time() . '.' . $extension;
        $destination = $upload_dir . $filename;
        
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($extension, $allowed)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Invalid file type"]);
            return;
        }
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $url = '/uploads/avatars/' . $filename;
            
            $query = "UPDATE users SET avatar_url = :url WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([':url' => $url, ':id' => $user_id]);
            
            echo json_encode(["success" => true, "avatar_url" => $url]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Upload failed"]);
        }
    }
}
?>
