<?php
/**
 * Customer Class
 * Handles all customer-related database operations for the CRM
 */
class Customer
{
    private $conn;
    private $table_name = "customers";

    // Customer properties
    public $id;
    public $full_name;
    public $email;
    public $phone;
    public $whatsapp;
    public $city;
    public $address;
    public $dni;
    public $birth_date;
    public $customer_type;
    public $source;
    public $source_partner_id;
    public $status;
    public $preferred_contact_method;
    public $marketing_consent;
    public $notes;
    public $tags;
    public $created_by;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Create a new customer
     * @param array $data Customer data
     * @return int|false Customer ID on success, false on failure
     */
    public function create($data)
    {
        try {
            // Validate required fields
            if (empty($data['full_name'])) {
                throw new Exception("Full name is required");
            }

            // Validate email if provided
            if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Invalid email format");
            }

            // Check for duplicates
            if (!empty($data['whatsapp'])) {
                $existing = $this->searchByPhone($data['whatsapp']);
                if ($existing) {
                    throw new Exception("Customer with this WhatsApp already exists");
                }
            }

            $query = "INSERT INTO " . $this->table_name . "
                    SET full_name = :full_name,
                        email = :email,
                        phone = :phone,
                        whatsapp = :whatsapp,
                        city = :city,
                        address = :address,
                        dni = :dni,
                        birth_date = :birth_date,
                        customer_type = :customer_type,
                        source = :source,
                        source_partner_id = :source_partner_id,
                        status = :status,
                        preferred_contact_method = :preferred_contact_method,
                        marketing_consent = :marketing_consent,
                        notes = :notes,
                        tags = :tags,
                        created_by = :created_by";

            $stmt = $this->conn->prepare($query);

            // Bind values
            $stmt->bindValue(':full_name', $data['full_name']);
            $stmt->bindValue(':email', $data['email'] ?? null);
            $stmt->bindValue(':phone', $data['phone'] ?? null);
            $stmt->bindValue(':whatsapp', $data['whatsapp'] ?? null);
            $stmt->bindValue(':city', $data['city'] ?? null);
            $stmt->bindValue(':address', $data['address'] ?? null);
            $stmt->bindValue(':dni', $data['dni'] ?? null);
            $stmt->bindValue(':birth_date', $data['birth_date'] ?? null);
            $stmt->bindValue(':customer_type', $data['customer_type'] ?? 'buyer');
            $stmt->bindValue(':source', $data['source'] ?? 'website');
            $stmt->bindValue(':source_partner_id', $data['source_partner_id'] ?? null);
            $stmt->bindValue(':status', $data['status'] ?? 'lead');
            $stmt->bindValue(':preferred_contact_method', $data['preferred_contact_method'] ?? 'whatsapp');
            $stmt->bindValue(':marketing_consent', $data['marketing_consent'] ?? false, PDO::PARAM_BOOL);
            $stmt->bindValue(':notes', $data['notes'] ?? null);
            $stmt->bindValue(':tags', isset($data['tags']) ? json_encode($data['tags']) : null);
            $stmt->bindValue(':created_by', $data['created_by'] ?? null);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }

            return false;
        } catch (Exception $e) {
            error_log("Customer creation error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get customer by ID with related data
     * @param int $id Customer ID
     * @return array|false Customer data with opportunities and recent activities
     */
    public function getById($id)
    {
        try {
            $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $customer = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$customer) {
                return false;
            }

            // Decode JSON fields
            if ($customer['tags']) {
                $customer['tags'] = json_decode($customer['tags'], true);
            }

            // Get opportunities
            $oppQuery = "SELECT o.*, c.brand, c.model, c.price 
                        FROM opportunities o
                        LEFT JOIN cars c ON c.id = o.car_id
                        WHERE o.customer_id = :customer_id
                        ORDER BY o.created_at DESC";
            $oppStmt = $this->conn->prepare($oppQuery);
            $oppStmt->bindParam(':customer_id', $id);
            $oppStmt->execute();
            $customer['opportunities'] = $oppStmt->fetchAll(PDO::FETCH_ASSOC);

            // Get recent activities (last 20)
            $actQuery = "SELECT * FROM activities 
                        WHERE customer_id = :customer_id
                        ORDER BY activity_date DESC
                        LIMIT 20";
            $actStmt = $this->conn->prepare($actQuery);
            $actStmt->bindParam(':customer_id', $id);
            $actStmt->execute();
            $customer['recent_activities'] = $actStmt->fetchAll(PDO::FETCH_ASSOC);

            return $customer;
        } catch (Exception $e) {
            error_log("Get customer error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all customers with filters and pagination
     * @param array $filters Filter options
     * @return array Customers array
     */
    public function getAll($filters = [])
    {
        try {
            $query = "SELECT * FROM " . $this->table_name . " WHERE 1=1";
            $params = [];

            // Apply filters
            if (!empty($filters['source'])) {
                $query .= " AND source = :source";
                $params[':source'] = $filters['source'];
            }

            if (!empty($filters['customer_type'])) {
                $query .= " AND customer_type = :customer_type";
                $params[':customer_type'] = $filters['customer_type'];
            }

            if (!empty($filters['status'])) {
                $query .= " AND status = :status";
                $params[':status'] = $filters['status'];
            }

            if (!empty($filters['search'])) {
                $query .= " AND (full_name LIKE :search OR email LIKE :search OR whatsapp LIKE :search OR phone LIKE :search)";
                $params[':search'] = '%' . $filters['search'] . '%';
            }

            // Order by
            $query .= " ORDER BY created_at DESC";

            // Pagination
            $page = $filters['page'] ?? 1;
            $limit = $filters['limit'] ?? 50;
            $offset = ($page - 1) * $limit;
            $query .= " LIMIT :limit OFFSET :offset";

            $stmt = $this->conn->prepare($query);

            // Bind filter params
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }

            // Bind pagination params
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

            $stmt->execute();
            $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Decode JSON fields
            foreach ($customers as &$customer) {
                if ($customer['tags']) {
                    $customer['tags'] = json_decode($customer['tags'], true);
                }
            }

            return $customers;
        } catch (Exception $e) {
            error_log("Get all customers error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Update customer
     * @param int $id Customer ID
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
                        whatsapp = :whatsapp,
                        city = :city,
                        address = :address,
                        dni = :dni,
                        birth_date = :birth_date,
                        customer_type = :customer_type,
                        status = :status,
                        preferred_contact_method = :preferred_contact_method,
                        marketing_consent = :marketing_consent,
                        notes = :notes,
                        tags = :tags
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':full_name', $data['full_name']);
            $stmt->bindValue(':email', $data['email'] ?? null);
            $stmt->bindValue(':phone', $data['phone'] ?? null);
            $stmt->bindValue(':whatsapp', $data['whatsapp'] ?? null);
            $stmt->bindValue(':city', $data['city'] ?? null);
            $stmt->bindValue(':address', $data['address'] ?? null);
            $stmt->bindValue(':dni', $data['dni'] ?? null);
            $stmt->bindValue(':birth_date', $data['birth_date'] ?? null);
            $stmt->bindValue(':customer_type', $data['customer_type']);
            $stmt->bindValue(':status', $data['status']);
            $stmt->bindValue(':preferred_contact_method', $data['preferred_contact_method']);
            $stmt->bindValue(':marketing_consent', $data['marketing_consent'] ?? false, PDO::PARAM_BOOL);
            $stmt->bindValue(':notes', $data['notes'] ?? null);
            $stmt->bindValue(':tags', isset($data['tags']) ? json_encode($data['tags']) : null);

            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Update customer error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete customer (cascade deletes opportunities, activities, tasks)
     * @param int $id Customer ID
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
            error_log("Delete customer error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Search customer by phone/whatsapp
     * @param string $phone Phone number
     * @return array|false Customer data or false
     */
    public function searchByPhone($phone)
    {
        try {
            $query = "SELECT * FROM " . $this->table_name . " 
                     WHERE whatsapp = :phone OR phone = :phone 
                     LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':phone', $phone);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Search by phone error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Search customer by email
     * @param string $email Email address
     * @return array|false Customer data or false
     */
    public function searchByEmail($email)
    {
        try {
            $query = "SELECT * FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Search by email error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get customer statistics
     * @return array Statistics data
     */
    public function getStats()
    {
        try {
            $stats = [];

            // Total customers
            $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $stats['total'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // New this month
            $query = "SELECT COUNT(*) as new_this_month FROM " . $this->table_name . "
                     WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
                     AND YEAR(created_at) = YEAR(CURRENT_DATE())";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $stats['new_this_month'] = $stmt->fetch(PDO::FETCH_ASSOC)['new_this_month'];

            // By source
            $query = "SELECT source, COUNT(*) as count FROM " . $this->table_name . "
                     GROUP BY source";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $stats['by_source'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // By status
            $query = "SELECT status, COUNT(*) as count FROM " . $this->table_name . "
                     GROUP BY status";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $stats['by_status'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $stats;
        } catch (Exception $e) {
            error_log("Get stats error: " . $e->getMessage());
            return [];
        }
    }
}
?>
