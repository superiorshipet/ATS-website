<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database {
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            // Use DATABASE_URL from Railway
            $databaseUrl = getenv('DATABASE_URL');
            if (!$databaseUrl) {
                // Fallback for local development
                $databaseUrl = "pgsql:host=localhost;dbname=ats_system";
            }
            $this->conn = new PDO($databaseUrl);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
            exit();
        }
        return $this->conn;
    }
}
?>
