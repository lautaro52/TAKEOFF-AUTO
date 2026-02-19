<?php
/**
 * Activity Class
 * Handles customer interaction logging and activity tracking
 */
class Activity
{
    private $conn;
    private $table_name = "activities";

    // Activity properties
    public $id;
    public $customer_id;
    public $opportunity_id;
    public $related_car_id;
    public $activity_type;
    public $subject;
    public $description;
    public $outcome;
    public $activity_date;
    public $duration_minutes;
    public $created_by;
    public $attachments;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Create a new activity
     * @param array $data Activity data
     * @return int|false Activity ID on success, false on failure
     */
    public function create($data)
    {
        try {
            // Validate required fields
            if (empty($data['customer_id']) || empty($data['activity_type']) || empty($data['subject'])) {
                throw new Exception("Customer ID, activity type, and subject are required");
            }

            // Validate activity_type enum
            $valid_types = ['call', 'email', 'meeting', 'note', 'whatsapp', 'sms', 'visit', 'test_drive'];
            if (!in_array($data['activity_type'], $valid_types)) {
                throw new Exception("Invalid activity type");
            }

            $query = "INSERT INTO " . $this->table_name . "
                    SET customer_id = :customer_id,
                        opportunity_id = :opportunity_id,
                        related_car_id = :related_car_id,
                        activity_type = :activity_type,
                        subject = :subject,
                        description = :description,
                        outcome = :outcome,
                        activity_date = :activity_date,
                        duration_minutes = :duration_minutes,
                        created_by = :created_by,
                        attachments = :attachments";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':customer_id', $data['customer_id']);
            $stmt->bindValue(':opportunity_id', $data['opportunity_id'] ?? null);
            $stmt->bindValue(':related_car_id', $data['related_car_id'] ?? null);
            $stmt->bindValue(':activity_type', $data['activity_type']);
            $stmt->bindValue(':subject', $data['subject']);
            $stmt->bindValue(':description', $data['description'] ?? null);
            $stmt->bindValue(':outcome', $data['outcome'] ?? null);
            $stmt->bindValue(':activity_date', $data['activity_date'] ?? date('Y-m-d H:i:s'));
            $stmt->bindValue(':duration_minutes', $data['duration_minutes'] ?? null);
            $stmt->bindValue(':created_by', $data['created_by'] ?? null);
            $stmt->bindValue(':attachments', isset($data['attachments']) ? json_encode($data['attachments']) : null);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }

            return false;
        } catch (Exception $e) {
            error_log("Activity creation error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get activities by customer (timeline)
     * @param int $customer_id Customer ID
     * @param int $limit Maximum number of activities to return
     * @return array Activities array
     */
    public function getByCustomer($customer_id, $limit = 50)
    {
        try {
            $query = "SELECT a.*,
                            o.title as opportunity_title,
                            car.brand, car.model
                     FROM " . $this->table_name . " a
                     LEFT JOIN opportunities o ON o.id = a.opportunity_id
                     LEFT JOIN cars car ON car.id = a.related_car_id
                     WHERE a.customer_id = :customer_id
                     ORDER BY a.activity_date DESC
                     LIMIT :limit";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':customer_id', $customer_id);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->execute();

            $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Decode JSON fields
            foreach ($activities as &$activity) {
                if ($activity['attachments']) {
                    $activity['attachments'] = json_decode($activity['attachments'], true);
                }
            }

            return $activities;
        } catch (Exception $e) {
            error_log("Get activities by customer error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get activities by opportunity
     * @param int $opportunity_id Opportunity ID
     * @return array Activities array
     */
    public function getByOpportunity($opportunity_id)
    {
        try {
            $query = "SELECT a.*,
                            c.full_name as customer_name
                     FROM " . $this->table_name . " a
                     LEFT JOIN customers c ON c.id = a.customer_id
                     WHERE a.opportunity_id = :opportunity_id
                     ORDER BY a.activity_date DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':opportunity_id', $opportunity_id);
            $stmt->execute();

            $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Decode JSON fields
            foreach ($activities as &$activity) {
                if ($activity['attachments']) {
                    $activity['attachments'] = json_decode($activity['attachments'], true);
                }
            }

            return $activities;
        } catch (Exception $e) {
            error_log("Get activities by opportunity error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get all activities with filters
     * @param array $filters Filter options
     * @return array Activities array
     */
    public function getAll($filters = [])
    {
        try {
            $query = "SELECT a.*,
                            c.full_name as customer_name,
                            o.title as opportunity_title
                     FROM " . $this->table_name . " a
                     LEFT JOIN customers c ON c.id = a.customer_id
                     LEFT JOIN opportunities o ON o.id = a.opportunity_id
                     WHERE 1=1";
            $params = [];

            // Apply filters
            if (!empty($filters['activity_type'])) {
                $query .= " AND a.activity_type = :activity_type";
                $params[':activity_type'] = $filters['activity_type'];
            }

            if (!empty($filters['created_by'])) {
                $query .= " AND a.created_by = :created_by";
                $params[':created_by'] = $filters['created_by'];
            }

            if (!empty($filters['date_from'])) {
                $query .= " AND a.activity_date >= :date_from";
                $params[':date_from'] = $filters['date_from'];
            }

            if (!empty($filters['date_to'])) {
                $query .= " AND a.activity_date <= :date_to";
                $params[':date_to'] = $filters['date_to'];
            }

            $query .= " ORDER BY a.activity_date DESC";

            // Pagination
            if (!empty($filters['limit'])) {
                $query .= " LIMIT :limit";
            }

            $stmt = $this->conn->prepare($query);

            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }

            if (!empty($filters['limit'])) {
                $stmt->bindValue(':limit', (int)$filters['limit'], PDO::PARAM_INT);
            }

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get all activities error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Update activity
     * @param int $id Activity ID
     * @param array $data Updated data
     * @return bool Success status
     */
    public function update($id, $data)
    {
        try {
            $query = "UPDATE " . $this->table_name . "
                    SET subject = :subject,
                        description = :description,
                        outcome = :outcome,
                        activity_date = :activity_date,
                        duration_minutes = :duration_minutes,
                        attachments = :attachments
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':subject', $data['subject']);
            $stmt->bindValue(':description', $data['description'] ?? null);
            $stmt->bindValue(':outcome', $data['outcome'] ?? null);
            $stmt->bindValue(':activity_date', $data['activity_date']);
            $stmt->bindValue(':duration_minutes', $data['duration_minutes'] ?? null);
            $stmt->bindValue(':attachments', isset($data['attachments']) ? json_encode($data['attachments']) : null);

            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Update activity error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete activity
     * @param int $id Activity ID
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
            error_log("Delete activity error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get upcoming scheduled activities
     * @param int $user_id User ID
     * @param int $days Number of days to look ahead
     * @return array Upcoming activities
     */
    public function getUpcoming($user_id, $days = 7)
    {
        try {
            $query = "SELECT a.*,
                            c.full_name as customer_name,
                            o.title as opportunity_title
                     FROM " . $this->table_name . " a
                     LEFT JOIN customers c ON c.id = a.customer_id
                     LEFT JOIN opportunities o ON o.id = a.opportunity_id
                     WHERE a.created_by = :user_id
                     AND a.activity_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL :days DAY)
                     AND a.activity_type IN ('meeting', 'call')
                     ORDER BY a.activity_date ASC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':days', $days, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get upcoming activities error: " . $e->getMessage());
            return [];
        }
    }
}
?>
