<?php
/**
 * Session Class
 * Handles user session management and token validation
 */
class Session
{
    private $conn;
    private $table_name = "user_sessions";
    private $token_expiry_days = 30;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Create a new session for user
     * @param int $user_id User ID
     * @param string|null $ip_address Client IP address
     * @param string|null $user_agent Client user agent
     * @return string|false Session token on success, false on failure
     */
    public function create($user_id, $ip_address = null, $user_agent = null)
    {
        try {
            // Generate secure random token
            $token = bin2hex(random_bytes(32)); // 64 character hex string

            // Calculate expiry date
            $expires_at = date('Y-m-d H:i:s', strtotime('+' . $this->token_expiry_days . ' days'));

            $query = "INSERT INTO " . $this->table_name . "
                    SET user_id = :user_id,
                        session_token = :session_token,
                        ip_address = :ip_address,
                        user_agent = :user_agent,
                        expires_at = :expires_at";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':user_id', $user_id);
            $stmt->bindValue(':session_token', $token);
            $stmt->bindValue(':ip_address', $ip_address);
            $stmt->bindValue(':user_agent', $user_agent);
            $stmt->bindValue(':expires_at', $expires_at);

            if ($stmt->execute()) {
                return $token;
            }

            return false;
        } catch (Exception $e) {
            error_log("Session creation error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Validate session token
     * @param string $token Session token
     * @return int|false User ID on success, false on failure
     */
    public function validate($token)
    {
        try {
            $query = "SELECT user_id, expires_at FROM " . $this->table_name . "
                     WHERE session_token = :token
                     AND expires_at > NOW()";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();

            $session = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$session) {
                return false;
            }

            return (int)$session['user_id'];
        } catch (Exception $e) {
            error_log("Session validation error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get session data including user info
     * @param string $token Session token
     * @return array|false Session data with user info
     */
    public function getSessionData($token)
    {
        try {
            $query = "SELECT s.*, u.email, u.full_name, u.role, u.avatar_url
                     FROM " . $this->table_name . " s
                     INNER JOIN users u ON u.id = s.user_id
                     WHERE s.session_token = :token
                     AND s.expires_at > NOW()";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get session data error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Destroy session (logout)
     * @param string $token Session token
     * @return bool Success status
     */
    public function destroy($token)
    {
        try {
            $query = "DELETE FROM " . $this->table_name . " 
                     WHERE session_token = :token";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Session destroy error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Destroy all sessions for a user
     * @param int $user_id User ID
     * @return bool Success status
     */
    public function destroyAllUserSessions($user_id)
    {
        try {
            $query = "DELETE FROM " . $this->table_name . " 
                     WHERE user_id = :user_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Destroy all sessions error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Clean up expired sessions (should be run via cron)
     * @return int Number of sessions deleted
     */
    public function cleanup()
    {
        try {
            $query = "DELETE FROM " . $this->table_name . " 
                     WHERE expires_at < NOW()";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $stmt->rowCount();
        } catch (Exception $e) {
            error_log("Session cleanup error: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Extend session expiry
     * @param string $token Session token
     * @return bool Success status
     */
    public function extend($token)
    {
        try {
            $expires_at = date('Y-m-d H:i:s', strtotime('+' . $this->token_expiry_days . ' days'));

            $query = "UPDATE " . $this->table_name . "
                    SET expires_at = :expires_at
                    WHERE session_token = :token";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':token', $token);
            $stmt->bindValue(':expires_at', $expires_at);

            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Session extend error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get active sessions for a user
     * @param int $user_id User ID
     * @return array Active sessions
     */
    public function getUserSessions($user_id)
    {
        try {
            $query = "SELECT id, ip_address, user_agent, created_at, expires_at
                     FROM " . $this->table_name . "
                     WHERE user_id = :user_id
                     AND expires_at > NOW()
                     ORDER BY created_at DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get user sessions error: " . $e->getMessage());
            return [];
        }
    }
}
?>
