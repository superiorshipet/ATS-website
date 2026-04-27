<?php
require_once __DIR__ . '/../config/database.php';

class ChatbotController {
    private $conn;
    private $apiKey;
    private $model;

    // Static cache for jobs
    private static $cachedJobsContent = null;
    private static $cacheTime = 0;
    private const CACHE_MINUTES = 30;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
        $this->apiKey = getenv('GROQ_API_KEY') ?: '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';
        $this->model  = getenv('GROQ_MODEL')   ?: 'llama-3.3-70b-versatile';
    }

    private function log($message) {
        error_log("[Chatbot] " . $message);
    }

    // ==================== MAIN CHAT ENDPOINT ====================
    public function handleChat() {
        $input = file_get_contents("php://input");
        $data  = json_decode($input, true);

        if (!$data || !isset($data['message'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Message is required"]);
            return;
        }

        $userMessage = trim($data['message']);
        $userType    = $data['user_type'] ?? 'guest';
        $userId      = $data['user_id']   ?? null;
        $messages    = $data['messages']  ?? [];

        try {
            $reply = $this->getGroqResponse($userMessage, $messages, $userType, $userId);

            if (empty($reply)) {
                $reply = 'عذراً، خدمة الذكاء الاصطناعي غير متاحة حالياً. جرّب مرة أخرى بعد قليل.';
            }

            if ($userId) {
                $this->saveChatMessage($userId, $userMessage, $reply);
            }

            echo json_encode([
                "success"   => true,
                "response"  => $reply,
                "timestamp" => date('Y-m-d H:i:s')
            ]);

        } catch (Exception $e) {
            $this->log("Chat error: " . $e->getMessage());
            echo json_encode([
                "success"   => true,
                "response"  => "عذراً، حدث خطأ تقني. الرجاء المحاولة لاحقاً.",
                "timestamp" => date('Y-m-d H:i:s')
            ]);
        }
    }

    // ==================== GROQ API ====================
    private function getGroqResponse($userMessage, $messages, $userType, $userId) {
        if (empty($this->apiKey)) {
            return null;
        }

        try {
            $systemPrompt = $this->buildSystemPrompt($userType, $userId);

            // Start with system message
            $groqMessages = [
                ["role" => "system", "content" => $systemPrompt]
            ];

            // Add conversation history (last 8 messages)
            if (!empty($messages)) {
                $history = array_slice($messages, -8);
                foreach ($history as $msg) {
                    $role = ($msg['role'] === 'user') ? 'user' : 'assistant';
                    $groqMessages[] = ["role" => $role, "content" => $msg['content']];
                }
            }

            // Append the current user message only if not already last
            $lastMsg = end($groqMessages);
            $alreadyAdded = ($lastMsg && $lastMsg['role'] === 'user' && $lastMsg['content'] === $userMessage);
            if (!$alreadyAdded) {
                $groqMessages[] = ["role" => "user", "content" => $userMessage];
            }

            $payload = [
                "model"       => $this->model,
                "messages"    => $groqMessages,
                "max_tokens"  => 400,
                "temperature" => 0.8,
                "top_p"       => 0.95
            ];

            $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->apiKey
            ]);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);

            $response  = curl_exec($ch);
            $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            if ($curlError) {
                $this->log("cURL error: " . $curlError);
                return null;
            }

            if ($httpCode === 200 && $response) {
                $result = json_decode($response, true);
                if (isset($result['choices'][0]['message']['content'])) {
                    return trim($result['choices'][0]['message']['content']);
                }
            }

            $this->log("Groq API returned HTTP $httpCode. Body: " . substr($response, 0, 300));
            return null;

        } catch (Exception $e) {
            $this->log("Groq API exception: " . $e->getMessage());
            return null;
        }
    }

    // ==================== SYSTEM PROMPT ====================
    private function buildSystemPrompt($userType, $userId) {
        $userInfo    = $this->getUserInfo($userId);
        $jobsContent = $this->getCachedJobsContent();
        $stats       = $this->getPlatformStats();

        $userContext = "";
        if ($userInfo) {
            $userContext  = "معلومات المستخدم الحالي:\n";
            $userContext .= "- الاسم: {$userInfo['full_name']}\n";
            $userContext .= "- نوع الحساب: " . $this->translateUserType($userInfo['user_type']) . "\n";

            if ($userInfo['user_type'] === 'graduate') {
                if (!empty($userInfo['major']))         $userContext .= "- التخصص: {$userInfo['major']}\n";
                if (!empty($userInfo['grad_skills']))   $userContext .= "- المهارات: {$userInfo['grad_skills']}\n";
                if (!empty($userInfo['graduation_year'])) $userContext .= "- سنة التخرج: {$userInfo['graduation_year']}\n";
            }

            if ($userInfo['user_type'] === 'employer') {
                if (!empty($userInfo['company_name'])) $userContext .= "- الشركة: {$userInfo['company_name']}\n";
                if (!empty($userInfo['sector']))        $userContext .= "- القطاع: {$userInfo['sector']}\n";
            }
        }

        $prompt  = "أنت مساعد ذكي اسمك \"سيرتي\" في منصة \"سيرتي الذكية\" - منصة توظيف متكاملة للخريجين وجهات التوظيف.\n";
        $prompt .= "أنت ودود، محترف، ومتخصص في مجال التوظيف والموارد البشرية.\n\n";

        if ($userContext) {
            $prompt .= $userContext . "\n";
        }

        $prompt .= "إحصائيات المنصة:\n";
        $prompt .= "- الوظائف النشطة: {$stats['active_jobs']}\n";
        $prompt .= "- إجمالي الوظائف: {$stats['total_jobs']}\n";
        $prompt .= "- عدد الخريجين: {$stats['total_graduates']}\n";
        $prompt .= "- عدد جهات التوظيف: {$stats['total_employers']}\n";
        $prompt .= "- إجمالي التقديمات: {$stats['total_applications']}\n\n";

        $prompt .= "الوظائف المتاحة حالياً:\n$jobsContent\n\n";

        $prompt .= "تعليمات مهمة:\n";
        $prompt .= "1. رد بشكل طبيعي ومتنوع - لا تكرر نفس الرد أبداً\n";
        $prompt .= "2. استخدم لغة عربية فصحى واضحة مع لمسة ودودة\n";
        $prompt .= "3. أجب مباشرة وبإيجاز (3-5 جمل كحد أقصى)\n";
        $prompt .= "4. استخدم الإيموجي المناسبة بشكل معتدل\n";
        $prompt .= "5. إذا سأل عن وظيفة، اذكر تفاصيلها من القائمة أعلاه\n";
        $prompt .= "6. إذا سأل عن المنصة، قدّم خطوات واضحة\n";
        $prompt .= "7. لا تقدم وعوداً بالتوظيف - أنت مساعد إرشادي\n";
        $prompt .= "8. للخريج: ركّز على البحث عن وظائف وبناء السيرة الذاتية\n";
        $prompt .= "9. لجهة التوظيف: ركّز على نشر الوظائف وإدارة المتقدمين\n";
        $prompt .= "10. روابط الصفحات المهمة:\n";
        $prompt .= "    - الخريجون: /home/graduates\n";
        $prompt .= "    - الوظائف: /home/graduates/jobs\n";
        $prompt .= "    - بناء السيرة: /home/graduates/cv-builder\n";
        $prompt .= "    - جهات التوظيف: /home/employers\n";
        $prompt .= "    - نشر وظيفة: /home/employers/post-job\n";

        return $prompt;
    }

    // ==================== DATA HELPERS ====================
    private function getCachedJobsContent() {
        if (self::$cachedJobsContent !== null && (time() - self::$cacheTime) < (self::CACHE_MINUTES * 60)) {
            return self::$cachedJobsContent;
        }

        try {
            $query = "SELECT j.title, j.department, j.location, j.job_type, j.description,
                             u.full_name AS company_name
                      FROM jobs j
                      LEFT JOIN employers e ON j.employer_id = e.user_id
                      LEFT JOIN users u ON e.user_id = u.id
                      WHERE j.status = 'active'
                      ORDER BY j.created_at DESC
                      LIMIT 20";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $jobs = $stmt->fetchAll();

            if (empty($jobs)) {
                self::$cachedJobsContent = "لا توجد وظائف نشطة حالياً.";
                self::$cacheTime = time();
                return self::$cachedJobsContent;
            }

            $lines = [];
            foreach ($jobs as $job) {
                $desc  = mb_substr($job['description'] ?? '', 0, 120);
                $desc .= mb_strlen($job['description'] ?? '') > 120 ? "..." : "";

                $lines[] = "• {$job['title']} | {$job['company_name']} | {$job['location']} | {$job['job_type']}";
                if ($desc) $lines[] = "  الوصف: {$desc}";
            }

            self::$cachedJobsContent = implode("\n", $lines);
            self::$cacheTime = time();
            return self::$cachedJobsContent;

        } catch (Exception $e) {
            $this->log("Error fetching jobs: " . $e->getMessage());
            return "معلومات الوظائف غير متاحة حالياً.";
        }
    }

    private function getPlatformStats() {
        try {
            $stats = [];
            $stats['total_graduates']   = $this->conn->query("SELECT COUNT(*) FROM graduates")->fetchColumn() ?? 0;
            $stats['total_employers']   = $this->conn->query("SELECT COUNT(*) FROM employers")->fetchColumn() ?? 0;
            $stats['active_jobs']       = $this->conn->query("SELECT COUNT(*) FROM jobs WHERE status = 'active'")->fetchColumn() ?? 0;
            $stats['total_jobs']        = $this->conn->query("SELECT COUNT(*) FROM jobs")->fetchColumn() ?? 0;
            $stats['total_applications']= $this->conn->query("SELECT COUNT(*) FROM applications")->fetchColumn() ?? 0;
            return $stats;
        } catch (Exception $e) {
            return ['total_graduates' => 0, 'total_employers' => 0, 'active_jobs' => 0, 'total_jobs' => 0, 'total_applications' => 0];
        }
    }

    private function getUserInfo($userId) {
        if (!$userId) return null;
        try {
            $query = "SELECT u.id, u.full_name, u.email, u.user_type,
                             g.major, g.skills AS grad_skills, g.graduation_year, g.gpa,
                             e.company_name, e.sector
                      FROM users u
                      LEFT JOIN graduates g ON u.id = g.user_id
                      LEFT JOIN employers e ON u.id = e.user_id
                      WHERE u.id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([':id' => $userId]);
            return $stmt->fetch();
        } catch (Exception $e) {
            return null;
        }
    }

    private function translateUserType($type) {
        $map = ['graduate' => 'خريج', 'employer' => 'جهة توظيف', 'admin' => 'مدير'];
        return $map[$type] ?? $type;
    }

    // ==================== CHAT HISTORY ====================
    private function saveChatMessage($userId, $message, $response) {
        try {
            $this->ensureChatMessagesTable();
            $query = "INSERT INTO chat_messages (user_id, message, response, created_at)
                      VALUES (:user_id, :message, :response, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':user_id'  => $userId,
                ':message'  => $message,
                ':response' => $response
            ]);
        } catch (Exception $e) {
            $this->log("Error saving chat message: " . $e->getMessage());
        }
    }

    private function ensureChatMessagesTable() {
        try {
            $this->conn->exec("CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                response TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )");
        } catch (Exception $e) {
            $this->log("Error creating chat_messages table: " . $e->getMessage());
        }
    }

    public function getChatHistory($userId) {
        try {
            $this->ensureChatMessagesTable();
            $query = "SELECT id, message, response, created_at
                      FROM chat_messages
                      WHERE user_id = :user_id
                      ORDER BY created_at DESC
                      LIMIT 50";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([':user_id' => $userId]);
            $history = array_reverse($stmt->fetchAll());

            echo json_encode(["success" => true, "data" => $history]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Failed to fetch chat history"]);
        }
    }
}