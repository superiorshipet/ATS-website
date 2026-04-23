<?php
require_once __DIR__ . '/../config/database.php';

class JobController {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function getAllJobs() {
        $employer_id = $_GET['employer_id'] ?? null;
        
        if ($employer_id) {
            $query = "SELECT j.*, u.full_name as company_name 
                      FROM jobs j 
                      JOIN employers e ON j.employer_id = e.user_id
                      JOIN users u ON e.user_id = u.id
                      WHERE j.employer_id = :employer_id
                      ORDER BY j.created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([':employer_id' => $employer_id]);
        } else {
            $query = "SELECT j.*, u.full_name as company_name 
                      FROM jobs j 
                      JOIN employers e ON j.employer_id = e.user_id
                      JOIN users u ON e.user_id = u.id
                      WHERE j.status = 'active'
                      ORDER BY j.created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
        }
        
        $jobs = $stmt->fetchAll();
        echo json_encode(["success" => true, "data" => $jobs]);
    }

    public function getJobById($id) {
        $query = "SELECT j.*, u.full_name as company_name 
                  FROM jobs j 
                  JOIN employers e ON j.employer_id = e.user_id
                  JOIN users u ON e.user_id = u.id
                  WHERE j.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);
        $job = $stmt->fetch();
        
        if ($job) {
            echo json_encode(["success" => true, "data" => $job]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "Job not found"]);
        }
    }

    public function createJob() {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Invalid JSON input"]);
            return;
        }
        
        if (!isset($data['employer_id']) || !isset($data['title']) || !isset($data['location']) || !isset($data['description'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Missing required fields"]);
            return;
        }
        
        $skillsValue = null;
        if (isset($data['skills']) && is_array($data['skills'])) {
            $skillsValue = '{' . implode(',', array_map(function($s) { 
                return '"' . addslashes($s) . '"'; 
            }, $data['skills'])) . '}';
        }
        
        $query = "INSERT INTO jobs (employer_id, title, department, location, job_type, salary_range, description, requirements, skills, status) 
                  VALUES (:employer_id, :title, :department, :location, :job_type, :salary_range, :description, :requirements, :skills, :status)";
        
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute([
            ':employer_id' => $data['employer_id'],
            ':title' => $data['title'],
            ':department' => $data['department'] ?? '',
            ':location' => $data['location'] ?? '',
            ':job_type' => $data['job_type'] ?? 'fulltime',
            ':salary_range' => $data['salary_range'] ?? '',
            ':description' => $data['description'] ?? '',
            ':requirements' => $data['requirements'] ?? '',
            ':skills' => $skillsValue,
            ':status' => $data['status'] ?? 'active'
        ]);
        
        if ($result) {
            echo json_encode([
                "success" => true,
                "message" => "Job created successfully",
                "job_id" => $this->conn->lastInsertId()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Failed to create job"]);
        }
    }

    public function updateJob($id) {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Invalid JSON input"]);
            return;
        }
        
        $skillsValue = null;
        if (isset($data['skills']) && is_array($data['skills'])) {
            $skillsValue = '{' . implode(',', array_map(function($s) { 
                return '"' . addslashes($s) . '"'; 
            }, $data['skills'])) . '}';
        } elseif (isset($data['skills']) && is_string($data['skills'])) {
            $skillsArray = explode(',', $data['skills']);
            $skillsArray = array_map('trim', $skillsArray);
            $skillsValue = '{' . implode(',', array_map(function($s) { 
                return '"' . addslashes($s) . '"'; 
            }, $skillsArray)) . '}';
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
        
        if ($result) {
            echo json_encode(["success" => true, "message" => "Job updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Failed to update job"]);
        }
    }

    public function deleteJob($id) {
        $query = "DELETE FROM jobs WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute([':id' => $id]);
        
        if ($result) {
            echo json_encode(["success" => true, "message" => "Job deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Failed to delete job"]);
        }
    }
}
?>
