<?php
require_once __DIR__ . '/../config/database.php';

class CVController {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    public function getCV() {
        $graduate_id = $_GET['graduate_id'] ?? $_GET['user_id'] ?? 1;
        
        $query = "SELECT u.id, u.full_name, u.email, u.phone, 
                  g.location, g.bio, g.skills, g.cv_url,
                  g.graduation_year, g.major, g.gpa
                  FROM users u 
                  JOIN graduates g ON u.id = g.user_id 
                  WHERE u.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $graduate_id]);
        $cv = $stmt->fetch();
        
        if (!$cv) {
            echo json_encode(["success" => true, "data" => null]);
            return;
        }
        
        $workQuery = "SELECT id, title, company, duration, description FROM work_experiences WHERE graduate_id = :id ORDER BY id DESC";
        $workStmt = $this->conn->prepare($workQuery);
        $workStmt->execute([':id' => $graduate_id]);
        $cv['experiences'] = $workStmt->fetchAll();
        
        $eduQuery = "SELECT id, degree, institution, year FROM educations WHERE graduate_id = :id ORDER BY id DESC";
        $eduStmt = $this->conn->prepare($eduQuery);
        $eduStmt->execute([':id' => $graduate_id]);
        $cv['education'] = $eduStmt->fetchAll();
        
        $cv['skills'] = $cv['skills'] ? str_replace(['{', '}'], '', $cv['skills']) : '';
        
        echo json_encode(["success" => true, "data" => $cv]);
    }
    
    public function saveCV() {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        $graduate_id = $data['graduate_id'] ?? $data['user_id'] ?? 1;
        
        try {
            $skillsValue = null;
            if (isset($data['skills']) && !empty($data['skills'])) {
                $skillsArray = explode(',', $data['skills']);
                $skillsArray = array_map('trim', $skillsArray);
                $skillsValue = '{' . implode(',', array_map(function($s) { 
                    return '"' . addslashes($s) . '"'; 
                }, $skillsArray)) . '}';
            }
            
            $query = "UPDATE graduates SET 
                      location = :location, 
                      bio = :bio, 
                      skills = :skills,
                      major = :major, 
                      graduation_year = :grad_year, 
                      gpa = :gpa 
                      WHERE user_id = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':location' => $data['location'] ?? null,
                ':bio' => $data['bio'] ?? null,
                ':skills' => $skillsValue,
                ':major' => $data['major'] ?? null,
                ':grad_year' => isset($data['graduation_year']) ? (int)$data['graduation_year'] : null,
                ':gpa' => isset($data['gpa']) ? (float)$data['gpa'] : null,
                ':id' => $graduate_id
            ]);
            
            if (isset($data['experiences']) && is_array($data['experiences'])) {
                $delQuery = "DELETE FROM work_experiences WHERE graduate_id = :id";
                $delStmt = $this->conn->prepare($delQuery);
                $delStmt->execute([':id' => $graduate_id]);
                
                $insQuery = "INSERT INTO work_experiences (graduate_id, title, company, duration, description) 
                             VALUES (:grad_id, :title, :company, :duration, :desc)";
                $insStmt = $this->conn->prepare($insQuery);
                
                foreach ($data['experiences'] as $exp) {
                    $insStmt->execute([
                        ':grad_id' => $graduate_id,
                        ':title' => $exp['title'],
                        ':company' => $exp['company'],
                        ':duration' => $exp['duration'],
                        ':desc' => $exp['description']
                    ]);
                }
            }
            
            if (isset($data['education']) && is_array($data['education'])) {
                $delQuery = "DELETE FROM educations WHERE graduate_id = :id";
                $delStmt = $this->conn->prepare($delQuery);
                $delStmt->execute([':id' => $graduate_id]);
                
                $insQuery = "INSERT INTO educations (graduate_id, degree, institution, year) 
                             VALUES (:grad_id, :degree, :institution, :year)";
                $insStmt = $this->conn->prepare($insQuery);
                
                foreach ($data['education'] as $edu) {
                    $insStmt->execute([
                        ':grad_id' => $graduate_id,
                        ':degree' => $edu['degree'],
                        ':institution' => $edu['institution'],
                        ':year' => $edu['year']
                    ]);
                }
            }
            
            echo json_encode(["success" => true, "message" => "CV saved successfully"]);
            
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }
    
    public function uploadCVFile() {
        // Create upload directory with absolute path
        $upload_dir = dirname(__DIR__) . '/uploads/resumes/';
        
        // Create directory if not exists
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        // Check if directory is writable
        if (!is_writable($upload_dir)) {
            chmod($upload_dir, 0777);
        }
        
        if (!isset($_FILES['cv_file'])) {
            echo json_encode(["success" => false, "error" => "No file uploaded"]);
            return;
        }
        
        $file = $_FILES['cv_file'];
        
        if ($file['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(["success" => false, "error" => "Upload error code: " . $file['error']]);
            return;
        }
        
        $graduate_id = $_POST['graduate_id'] ?? $_POST['user_id'] ?? 1;
        
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['pdf', 'doc', 'docx'];
        
        if (!in_array($extension, $allowed)) {
            echo json_encode(["success" => false, "error" => "Invalid file type. Allowed: PDF, DOC, DOCX"]);
            return;
        }
        
        $filename = 'resume_' . $graduate_id . '_' . time() . '.' . $extension;
        $destination = $upload_dir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $url = '/uploads/resumes/' . $filename;
            
            $query = "UPDATE graduates SET cv_url = :url WHERE user_id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([':url' => $url, ':id' => $graduate_id]);
            
            echo json_encode(["success" => true, "cv_url" => $url]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to save file. Check: " . $upload_dir]);
        }
    }
}
?>
