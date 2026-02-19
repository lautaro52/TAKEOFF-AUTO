<?php
/**
 * User Class
 * Handles user authentication and management
 */
class User
{
    private $conn;
    private $table_name = "users";

    // User properties
    public $id;
    public $email;
    public $phone;
    public $password_hash;
    public $full_name;
    public $avatar_url;
    public $role;
    public $permissions;
    public $is_active;
    public $email_verified;
    public $phone_verified;
    public $last_login;
    public $session_token;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Create a new user
     * @param array $data User data
     * @return int|false User ID on success, false on failure
     */
    public function create($data)
    {
        try {
            // Validate required fields
            if (empty($data['full_name']) || empty($data['password']) || empty($data['role'])) {
                throw new Exception("Full name, password, and role are required");
            }

            // Validate email or phone (at least one required)
            if (empty($data['email']) && empty($data['phone'])) {
                throw new Exception("Email or phone is required");
            }

            // Validate email format if provided
            if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Invalid email format");
            }

            // Validate role
            $valid_roles = ['admin', 'seller', 'partner', 'manager'];
            if (!in_array($data['role'], $valid_roles)) {
                throw new Exception("Invalid role");
            }

            // Check for duplicate email
            if (!empty($data['email'])) {
                $checkQuery = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
                $checkStmt = $this->conn->prepare($checkQuery);
                $checkStmt->bindValue(':email', $data['email']);
                $checkStmt->execute();
                if ($checkStmt->fetch()) {
                    throw new Exception("Email already exists");
                }
            }

            // Check for duplicate phone
            if (!empty($data['phone'])) {
                $checkQuery = "SELECT id FROM " . $this->table_name . " WHERE phone = :phone";
                $checkStmt = $this->conn->prepare($checkQuery);
                $checkStmt->bindValue(':phone', $data['phone']);
                $checkStmt->execute();
                if ($checkStmt->fetch()) {
                    throw new Exception("Phone already exists");
                }
            }

            // Hash password
            $password_hash = password_hash($data['password'], PASSWORD_BCRYPT);

            $query = "INSERT INTO " . $this->table_name . "
                    SET email = :email,
                        phone = :phone,
                        password_hash = :password_hash,
                        full_name = :full_name,
                        avatar_url = :avatar_url,
                        role = :role,
                        permissions = :permissions,
                        is_active = :is_active";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':email', $data['email'] ?? null);
            $stmt->bindValue(':phone', $data['phone'] ?? null);
            $stmt->bindValue(':password_hash', $password_hash);
            $stmt->bindValue(':full_name', $data['full_name']);
            $stmt->bindValue(':avatar_url', $data['avatar_url'] ?? null);
            $stmt->bindValue(':role', $data['role']);
            $stmt->bindValue(':permissions', isset($data['permissions']) ? json_encode($data['permissions']) : null);
            $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }

            return false;
        } catch (Exception $e) {
            error_log("User creation error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Authenticate user
     * @param string $email Email address
     * @param string $password Password
     * @return array|false User data on success, false on failure
     */
    public function authenticate($email, $password)
    {
        try {
            $query = "SELECT * FROM " . $this->table_name . " 
                     WHERE email = :email AND is_active = 1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                return false;
            }

            // Verify password
            if (!password_verify($password, $user['password_hash'])) {
                return false;
            }

            // Update last login
            $updateQuery = "UPDATE " . $this->table_name . " 
                          SET last_login = NOW() 
                          WHERE id = :id";
            $updateStmt = $this->conn->prepare($updateQuery);
            $updateStmt->bindParam(':id', $user['id']);
            $updateStmt->execute();

            // Remove password hash from response
            unset($user['password_hash']);

            // Decode JSON fields
            if ($user['permissions']) {
                $user['permissions'] = json_decode($user['permissions'], true);
            }

            return $user;
        } catch (Exception $e) {
            error_log("Authentication error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user by ID
     * @param int $id User ID
     * @return array|false User data
     */
    public function getById($id)
    {
        try {
            $query = "SELECT id, email, phone, full_name, avatar_url, role, permissions, 
                            is_active, email_verified, phone_verified, last_login, 
                            created_at, updated_at
                     FROM " . $this->table_name . " 
                     WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                return false;
            }

            // Decode JSON fields
            if ($user['permissions']) {
                $user['permissions'] = json_decode($user['permissions'], true);
            }

            return $user;
        } catch (Exception $e) {
            error_log("Get user error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all users
     * @return array Users array
     */
    public function getAll()
    {
        try {
            $query = "SELECT id, email, phone, full_name, avatar_url, role, 
                            is_active, email_verified, phone_verified, last_login, 
                            created_at
                     FROM " . $this->table_name . "
                     ORDER BY created_at DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Decode JSON fields
            foreach ($users as &$user) {
                if (isset($user['permissions']) && $user['permissions']) {
                    $user['permissions'] = json_decode($user['permissions'], true);
                }
            }

            return $users;
        } catch (Exception $e) {
            error_log("Get all users error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Update user
     * @param int $id User ID
     * @param array $data Updated data
     * @return bool Success status
     */
    public function update($id, $data)
    {
        try {
            // Validate email if provided
            if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Invalid email format");
            }

            $query = "UPDATE " . $this->table_name . "
                    SET full_name = :full_name,
                        email = :email,
                        phone = :phone,
                        avatar_url = :avatar_url,
                        role = :role,
                        permissions = :permissions,
                        is_active = :is_active
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':full_name', $data['full_name']);
            $stmt->bindValue(':email', $data['email'] ?? null);
            $stmt->bindValue(':phone', $data['phone'] ?? null);
            $stmt->bindValue(':avatar_url', $data['avatar_url'] ?? null);
            $stmt->bindValue(':role', $data['role']);
            $stmt->bindValue(':permissions', isset($data['permissions']) ? json_encode($data['permissions']) : null);
            $stmt->bindValue(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);

            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Update user error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update user password
     * @param int $id User ID
     * @param string $new_password New password
     * @return bool Success status
     */
    public function updatePassword($id, $new_password)
    {
        try {
            if (strlen($new_password) < 6) {
                throw new Exception("Password must be at least 6 characters");
            }

            $password_hash = password_hash($new_password, PASSWORD_BCRYPT);

            $query = "UPDATE " . $this->table_name . "
                    SET password_hash = :password_hash
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':password_hash', $password_hash);

            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Update password error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if user has permission
     * @param int $user_id User ID
     * @param string $permission Permission to check
     * @return bool Has permission
     */
    public function checkPermission($user_id, $permission)
    {
        try {
            $user = $this->getById($user_id);
            
            if (!$user) {
                return false;
            }

            // Admin has all permissions
            if ($user['role'] === 'admin') {
                return true;
            }

            // Check specific permission
            if (isset($user['permissions']) && is_array($user['permissions'])) {
                return in_array($permission, $user['permissions']);
            }

            return false;
        } catch (Exception $e) {
            error_log("Check permission error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete user
     * @param int $id User ID
     * @return bool Success status
     */
    public function delete($id)
    {
        try {
            $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Delete user error: " . $e->getMessage());
            return false;
        }
    }
}
?>
