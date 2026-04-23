<?php
require_once __DIR__ . '/../config/database.php';

class ApplicationController {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function applyToJob() {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        
        $job_id = $data['job_id'] ?? null;
        $graduate_id = $data['graduate_id'] ?? $data['user_id'] ?? null;
        $cover_letter = $data['cover_letter'] ?? '';
        
        if (!$job_id || !$graduate_id) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Job ID and Graduate ID required"]);
            return;
        }
        
        try {
            $checkQuery = "SELECT id FROM applications WHERE job_id = :job_id AND graduate_id = :graduate_id";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->execute([
                ':job_id' => $job_id,
                ':graduate_id' => $graduate_id
            ]);
            
            if ($checkStmt->fetch()) {
                echo json_encode(["success" => false, "error" => "You have already applied for this job"]);
                return;
            }
            
            $query = "INSERT INTO applications (job_id, graduate_id, cover_letter, status) 
                      VALUES (:job_id, :graduate_id, :cover_letter, 'pending')";
            
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute([
                ':job_id' => $job_id,
                ':graduate_id' => $graduate_id,
                ':cover_letter' => $cover_letter
            ]);
            
            echo json_encode([
                "success" => $result,
                "message" => $result ? "Application submitted successfully" : "Failed to submit application"
            ]);
            
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }

    public function getUserApplications() {
        $graduate_id = $_GET['graduate_id'] ?? $_GET['user_id'] ?? 1;
        
        $query = "SELECT a.*, j.title, j.location, j.job_type, j.salary_range,
                  u.full_name as company_name
                  FROM applications a 
                  JOIN jobs j ON a.job_id = j.id 
                  JOIN employers e ON j.employer_id = e.user_id
                  JOIN users u ON e.user_id = u.id
                  WHERE a.graduate_id = :graduate_id
                  ORDER BY a.applied_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':graduate_id' => $graduate_id]);
        $applications = $stmt->fetchAll();
        
        foreach ($applications as &$app) {
            $statusAr = [
                'pending' => 'قيد المراجعة',
                'reviewing' => 'جاري المراجعة',
                'accepted' => 'مقبول',
                'rejected' => 'مرفوض'
            ];
            $app['status_ar'] = $statusAr[$app['status']] ?? $app['status'];
        }
        
        echo json_encode(["success" => true, "data" => $applications]);
    }
    
    public function updateApplicationStatus($id) {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        
        $query = "UPDATE applications SET status = :status, score = :score, updated_at = CURRENT_TIMESTAMP 
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute([
            ':status' => $data['status'],
            ':score' => $data['score'] ?? null,
            ':id' => $id
        ]);
        
        echo json_encode(["success" => $result, "message" => "Application status updated"]);
    }
    
    public function getJobApplications($job_id) {
        $query = "SELECT a.*, u.full_name, u.email, u.phone, g.skills, g.cv_url
                  FROM applications a 
                  JOIN graduates g ON a.graduate_id = g.user_id
                  JOIN users u ON g.user_id = u.id
                  WHERE a.job_id = :job_id
                  ORDER BY a.applied_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':job_id' => $job_id]);
        $applications = $stmt->fetchAll();
        
        echo json_encode(["success" => true, "data" => $applications]);
    }

    public function getEmployerApplications() {
        $employer_id = $_GET['employer_id'] ?? null;
        
        if (!$employer_id) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "employer_id required"]);
            return;
        }
        
        $query = "SELECT a.*, j.title, j.location, j.job_type, u.full_name as graduate_name, a.score
                  FROM applications a 
                  JOIN jobs j ON a.job_id = j.id 
                  JOIN graduates g ON a.graduate_id = g.user_id
                  JOIN users u ON g.user_id = u.id
                  WHERE j.employer_id = :employer_id
                  ORDER BY a.applied_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':employer_id' => $employer_id]);
        $applications = $stmt->fetchAll();
        
        echo json_encode(["success" => true, "data" => $applications]);
    }
}
?>
