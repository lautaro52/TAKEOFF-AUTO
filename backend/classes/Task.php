<?php
/**
 * Task Class
 * Handles task and reminder management for the CRM
 */
class Task
{
    private $conn;
    private $table_name = "tasks";

    // Task properties
    public $id;
    public $customer_id;
    public $opportunity_id;
    public $assigned_to;
    public $title;
    public $description;
    public $task_type;
    public $priority;
    public $status;
    public $due_date;
    public $completed_at;
    public $reminder_sent;
    public $reminder_date;
    public $created_by;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Create a new task
     * @param array $data Task data
     * @return int|false Task ID on success, false on failure
     */
    public function create($data)
    {
        try {
            // Validate required fields
            if (empty($data['title']) || empty($data['due_date'])) {
                throw new Exception("Title and due date are required");
            }

            // Validate date format
            $date = DateTime::createFromFormat('Y-m-d H:i:s', $data['due_date']);
            if (!$date) {
                $date = DateTime::createFromFormat('Y-m-d', $data['due_date']);
                if ($date) {
                    $data['due_date'] = $date->format('Y-m-d') . ' 23:59:59';
                } else {
                    throw new Exception("Invalid due date format");
                }
            }

            $query = "INSERT INTO " . $this->table_name . "
                    SET customer_id = :customer_id,
                        opportunity_id = :opportunity_id,
                        assigned_to = :assigned_to,
                        title = :title,
                        description = :description,
                        task_type = :task_type,
                        priority = :priority,
                        status = :status,
                        due_date = :due_date,
                        reminder_date = :reminder_date,
                        created_by = :created_by";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':customer_id', $data['customer_id'] ?? null);
            $stmt->bindValue(':opportunity_id', $data['opportunity_id'] ?? null);
            $stmt->bindValue(':assigned_to', $data['assigned_to'] ?? null);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':description', $data['description'] ?? null);
            $stmt->bindValue(':task_type', $data['task_type'] ?? 'follow_up');
            $stmt->bindValue(':priority', $data['priority'] ?? 'medium');
            $stmt->bindValue(':status', $data['status'] ?? 'pending');
            $stmt->bindValue(':due_date', $data['due_date']);
            $stmt->bindValue(':reminder_date', $data['reminder_date'] ?? null);
            $stmt->bindValue(':created_by', $data['created_by'] ?? null);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }

            return false;
        } catch (Exception $e) {
            error_log("Task creation error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get tasks by assigned user
     * @param int $user_id User ID
     * @param string|null $status Filter by status (pending, in_progress, completed, cancelled)
     * @return array Tasks array
     */
    public function getByAssignedUser($user_id, $status = 'pending')
    {
        try {
            $query = "SELECT t.*,
                            c.full_name as customer_name,
                            o.title as opportunity_title
                     FROM " . $this->table_name . " t
                     LEFT JOIN customers c ON c.id = t.customer_id
                     LEFT JOIN opportunities o ON o.id = t.opportunity_id
                     WHERE t.assigned_to = :user_id";

            if ($status) {
                $query .= " AND t.status = :status";
            }

            $query .= " ORDER BY t.due_date ASC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            
            if ($status) {
                $stmt->bindParam(':status', $status);
            }

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get tasks by user error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get overdue tasks for a user
     * @param int $user_id User ID
     * @return array Overdue tasks
     */
    public function getOverdue($user_id)
    {
        try {
            $query = "SELECT t.*,
                            c.full_name as customer_name,
                            o.title as opportunity_title
                     FROM " . $this->table_name . " t
                     LEFT JOIN customers c ON c.id = t.customer_id
                     LEFT JOIN opportunities o ON o.id = t.opportunity_id
                     WHERE t.assigned_to = :user_id
                     AND t.status IN ('pending', 'in_progress')
                     AND t.due_date < NOW()
                     ORDER BY t.due_date ASC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get overdue tasks error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Mark task as complete
     * @param int $id Task ID
     * @return bool Success status
     */
    public function complete($id)
    {
        try {
            $query = "UPDATE " . $this->table_name . "
                    SET status = 'completed',
                        completed_at = NOW()
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Complete task error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update task
     * @param int $id Task ID
     * @param array $data Updated data
     * @return bool Success status
     */
    public function update($id, $data)
    {
        try {
            $query = "UPDATE " . $this->table_name . "
                    SET title = :title,
                        description = :description,
                        task_type = :task_type,
                        priority = :priority,
                        status = :status,
                        due_date = :due_date,
                        reminder_date = :reminder_date
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':description', $data['description'] ?? null);
            $stmt->bindValue(':task_type', $data['task_type']);
            $stmt->bindValue(':priority', $data['priority']);
            $stmt->bindValue(':status', $data['status']);
            $stmt->bindValue(':due_date', $data['due_date']);
            $stmt->bindValue(':reminder_date', $data['reminder_date'] ?? null);

            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Update task error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete task
     * @param int $id Task ID
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
            error_log("Delete task error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get upcoming tasks for a user
     * @param int $user_id User ID
     * @param int $days Number of days to look ahead
     * @return array Upcoming tasks
     */
    public function getUpcoming($user_id, $days = 7)
    {
        try {
            $query = "SELECT t.*,
                            c.full_name as customer_name,
                            o.title as opportunity_title
                     FROM " . $this->table_name . " t
                     LEFT JOIN customers c ON c.id = t.customer_id
                     LEFT JOIN opportunities o ON o.id = t.opportunity_id
                     WHERE t.assigned_to = :user_id
                     AND t.status IN ('pending', 'in_progress')
                     AND t.due_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL :days DAY)
                     ORDER BY t.due_date ASC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':days', $days, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get upcoming tasks error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get all tasks with filters
     * @param array $filters Filter options
     * @return array Tasks array
     */
    public function getAll($filters = [])
    {
        try {
            $query = "SELECT t.*,
                            c.full_name as customer_name,
                            o.title as opportunity_title
                     FROM " . $this->table_name . " t
                     LEFT JOIN customers c ON c.id = t.customer_id
                     LEFT JOIN opportunities o ON o.id = t.opportunity_id
                     WHERE 1=1";
            $params = [];

            // Apply filters
            if (!empty($filters['status'])) {
                $query .= " AND t.status = :status";
                $params[':status'] = $filters['status'];
            }

            if (!empty($filters['priority'])) {
                $query .= " AND t.priority = :priority";
                $params[':priority'] = $filters['priority'];
            }

            if (!empty($filters['assigned_to'])) {
                $query .= " AND t.assigned_to = :assigned_to";
                $params[':assigned_to'] = $filters['assigned_to'];
            }

            if (!empty($filters['customer_id'])) {
                $query .= " AND t.customer_id = :customer_id";
                $params[':customer_id'] = $filters['customer_id'];
            }

            $query .= " ORDER BY t.due_date ASC";

            $stmt = $this->conn->prepare($query);

            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get all tasks error: " . $e->getMessage());
            return [];
        }
    }
}
?>
