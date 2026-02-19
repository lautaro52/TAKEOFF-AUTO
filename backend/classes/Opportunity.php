<?php
/**
 * Opportunity Class
 * Handles sales pipeline and opportunity management
 */
class Opportunity
{
    private $conn;
    private $table_name = "opportunities";

    // Opportunity properties
    public $id;
    public $customer_id;
    public $car_id;
    public $partner_id;
    public $assigned_to;
    public $title;
    public $description;
    public $opportunity_type;
    public $stage;
    public $estimated_value;
    public $probability;
    public $commission_amount;
    public $expected_close_date;
    public $actual_close_date;
    public $lost_reason;
    public $lost_reason_details;
    public $notes;
    public $tags;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Create a new opportunity
     * @param array $data Opportunity data
     * @return int|false Opportunity ID on success, false on failure
     */
    public function create($data)
    {
        try {
            // Validate required fields
            if (empty($data['customer_id']) || empty($data['title'])) {
                throw new Exception("Customer ID and title are required");
            }

            // Validate stage enum
            $valid_stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'financing_approval', 'closed_won', 'closed_lost'];
            if (!empty($data['stage']) && !in_array($data['stage'], $valid_stages)) {
                throw new Exception("Invalid stage value");
            }

            $query = "INSERT INTO " . $this->table_name . "
                    SET customer_id = :customer_id,
                        car_id = :car_id,
                        partner_id = :partner_id,
                        assigned_to = :assigned_to,
                        title = :title,
                        description = :description,
                        opportunity_type = :opportunity_type,
                        stage = :stage,
                        estimated_value = :estimated_value,
                        probability = :probability,
                        commission_amount = :commission_amount,
                        expected_close_date = :expected_close_date,
                        notes = :notes,
                        tags = :tags";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':customer_id', $data['customer_id']);
            $stmt->bindValue(':car_id', $data['car_id'] ?? null);
            $stmt->bindValue(':partner_id', $data['partner_id'] ?? null);
            $stmt->bindValue(':assigned_to', $data['assigned_to'] ?? null);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':description', $data['description'] ?? null);
            $stmt->bindValue(':opportunity_type', $data['opportunity_type'] ?? 'purchase');
            $stmt->bindValue(':stage', $data['stage'] ?? 'new');
            $stmt->bindValue(':estimated_value', $data['estimated_value'] ?? null);
            $stmt->bindValue(':probability', $data['probability'] ?? 50);
            $stmt->bindValue(':commission_amount', $data['commission_amount'] ?? 0.00);
            $stmt->bindValue(':expected_close_date', $data['expected_close_date'] ?? null);
            $stmt->bindValue(':notes', $data['notes'] ?? null);
            $stmt->bindValue(':tags', isset($data['tags']) ? json_encode($data['tags']) : null);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }

            return false;
        } catch (Exception $e) {
            error_log("Opportunity creation error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get opportunity by ID with related data
     * @param int $id Opportunity ID
     * @return array|false Opportunity data with customer, car, partner info
     */
    public function getById($id)
    {
        try {
            $query = "SELECT o.*, 
                            c.full_name as customer_name, c.whatsapp as customer_whatsapp, c.email as customer_email,
                            car.brand, car.model, car.year, car.price as car_price,
                            p.full_name as partner_name
                     FROM " . $this->table_name . " o
                     LEFT JOIN customers c ON c.id = o.customer_id
                     LEFT JOIN cars car ON car.id = o.car_id
                     LEFT JOIN partners p ON p.id = o.partner_id
                     WHERE o.id = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $opportunity = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$opportunity) {
                return false;
            }

            // Decode JSON fields
            if ($opportunity['tags']) {
                $opportunity['tags'] = json_decode($opportunity['tags'], true);
            }

            return $opportunity;
        } catch (Exception $e) {
            error_log("Get opportunity error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all opportunities with filters
     * @param array $filters Filter options
     * @return array Opportunities array
     */
    public function getAll($filters = [])
    {
        try {
            $query = "SELECT o.*, 
                            c.full_name as customer_name, c.whatsapp as customer_whatsapp,
                            car.brand, car.model, car.year
                     FROM " . $this->table_name . " o
                     LEFT JOIN customers c ON c.id = o.customer_id
                     LEFT JOIN cars car ON car.id = o.car_id
                     WHERE 1=1";
            $params = [];

            // Apply filters
            if (!empty($filters['stage'])) {
                $query .= " AND o.stage = :stage";
                $params[':stage'] = $filters['stage'];
            }

            if (!empty($filters['customer_id'])) {
                $query .= " AND o.customer_id = :customer_id";
                $params[':customer_id'] = $filters['customer_id'];
            }

            if (!empty($filters['assigned_to'])) {
                $query .= " AND o.assigned_to = :assigned_to";
                $params[':assigned_to'] = $filters['assigned_to'];
            }

            if (!empty($filters['opportunity_type'])) {
                $query .= " AND o.opportunity_type = :opportunity_type";
                $params[':opportunity_type'] = $filters['opportunity_type'];
            }

            $query .= " ORDER BY o.created_at DESC";

            $stmt = $this->conn->prepare($query);

            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get all opportunities error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Update opportunity
     * @param int $id Opportunity ID
     * @param array $data Updated data
     * @return bool Success status
     */
    public function update($id, $data)
    {
        try {
            $query = "UPDATE " . $this->table_name . "
                    SET title = :title,
                        description = :description,
                        car_id = :car_id,
                        assigned_to = :assigned_to,
                        opportunity_type = :opportunity_type,
                        stage = :stage,
                        estimated_value = :estimated_value,
                        probability = :probability,
                        commission_amount = :commission_amount,
                        expected_close_date = :expected_close_date,
                        notes = :notes,
                        tags = :tags
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':description', $data['description'] ?? null);
            $stmt->bindValue(':car_id', $data['car_id'] ?? null);
            $stmt->bindValue(':assigned_to', $data['assigned_to'] ?? null);
            $stmt->bindValue(':opportunity_type', $data['opportunity_type']);
            $stmt->bindValue(':stage', $data['stage']);
            $stmt->bindValue(':estimated_value', $data['estimated_value'] ?? null);
            $stmt->bindValue(':probability', $data['probability']);
            $stmt->bindValue(':commission_amount', $data['commission_amount']);
            $stmt->bindValue(':expected_close_date', $data['expected_close_date'] ?? null);
            $stmt->bindValue(':notes', $data['notes'] ?? null);
            $stmt->bindValue(':tags', isset($data['tags']) ? json_encode($data['tags']) : null);

            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Update opportunity error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update opportunity stage
     * @param int $id Opportunity ID
     * @param string $new_stage New stage
     * @param string|null $lost_reason Reason if closing as lost
     * @return bool Success status
     */
    public function updateStage($id, $new_stage, $lost_reason = null)
    {
        try {
            $query = "UPDATE " . $this->table_name . "
                    SET stage = :stage,
                        lost_reason = :lost_reason,
                        actual_close_date = :actual_close_date
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $actual_close_date = null;
            if ($new_stage === 'closed_won' || $new_stage === 'closed_lost') {
                $actual_close_date = date('Y-m-d');
            }

            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':stage', $new_stage);
            $stmt->bindValue(':lost_reason', $lost_reason);
            $stmt->bindValue(':actual_close_date', $actual_close_date);

            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Update stage error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get pipeline data for Kanban board
     * @return array Opportunities grouped by stage
     */
    public function getPipeline()
    {
        try {
            $query = "SELECT o.*, 
                            c.full_name as customer_name,
                            car.brand, car.model
                     FROM " . $this->table_name . " o
                     LEFT JOIN customers c ON c.id = o.customer_id
                     LEFT JOIN cars car ON car.id = o.car_id
                     WHERE o.stage NOT IN ('closed_won', 'closed_lost')
                     ORDER BY o.created_at DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $opportunities = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Group by stage
            $pipeline = [
                'new' => [],
                'contacted' => [],
                'qualified' => [],
                'proposal' => [],
                'negotiation' => [],
                'financing_approval' => []
            ];

            foreach ($opportunities as $opp) {
                if (isset($pipeline[$opp['stage']])) {
                    $pipeline[$opp['stage']][] = $opp;
                }
            }

            return $pipeline;
        } catch (Exception $e) {
            error_log("Get pipeline error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get conversion metrics for funnel analysis
     * @param string $date_from Start date
     * @param string $date_to End date
     * @return array Conversion metrics
     */
    public function getConversionMetrics($date_from, $date_to)
    {
        try {
            $query = "SELECT 
                        stage,
                        COUNT(*) as count,
                        SUM(estimated_value) as total_value,
                        AVG(probability) as avg_probability
                     FROM " . $this->table_name . "
                     WHERE created_at BETWEEN :date_from AND :date_to
                     GROUP BY stage
                     ORDER BY FIELD(stage, 'new', 'contacted', 'qualified', 'proposal', 'negotiation', 'financing_approval', 'closed_won', 'closed_lost')";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':date_from', $date_from);
            $stmt->bindParam(':date_to', $date_to);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get conversion metrics error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Close opportunity (won or lost)
     * @param int $id Opportunity ID
     * @param bool $won True if won, false if lost
     * @param float|null $actual_value Actual sale value
     * @param string|null $reason Reason if lost
     * @return bool Success status
     */
    public function close($id, $won, $actual_value = null, $reason = null)
    {
        try {
            $stage = $won ? 'closed_won' : 'closed_lost';
            
            $query = "UPDATE " . $this->table_name . "
                    SET stage = :stage,
                        actual_close_date = :actual_close_date,
                        estimated_value = :actual_value,
                        lost_reason_details = :reason
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':stage', $stage);
            $stmt->bindValue(':actual_close_date', date('Y-m-d'));
            $stmt->bindValue(':actual_value', $actual_value);
            $stmt->bindValue(':reason', $reason);

            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Close opportunity error: " . $e->getMessage());
            return false;
        }
    }
}
?>
