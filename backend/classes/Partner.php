<?php
class Partner
{
    private $conn;
    private $table_name = "partners";

    public $id;
    public $full_name;
    public $whatsapp;
    public $password;
    public $cbu_alias;
    public $residence_zone;
    public $balance_available;
    public $balance_pending;
    public $sales_total_amount;
    public $is_active;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Create partner
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET full_name=:full_name, whatsapp=:whatsapp, password=:password,
                      cbu_alias=:cbu_alias, residence_zone=:residence_zone";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->full_name = htmlspecialchars(strip_tags($this->full_name));
        $this->whatsapp = htmlspecialchars(strip_tags($this->whatsapp));
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        $this->cbu_alias = htmlspecialchars(strip_tags($this->cbu_alias));
        $this->residence_zone = htmlspecialchars(strip_tags($this->residence_zone));

        // Bind
        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":whatsapp", $this->whatsapp);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":cbu_alias", $this->cbu_alias);
        $stmt->bindParam(":residence_zone", $this->residence_zone);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Login partner
    public function login($whatsapp, $password)
    {
        $query = "SELECT id, full_name, password FROM " . $this->table_name . " WHERE whatsapp = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $whatsapp);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($password, $row['password'])) {
                return $row;
            }
        }
        return false;
    }

    // Get partner details
    public function readOne()
    {
        $query = "SELECT id, full_name, whatsapp, cbu_alias, residence_zone, 
                         balance_available, balance_pending, sales_total_amount 
                  FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            foreach ($row as $key => $value) {
                $this->$key = $value;
            }
            return $row;
        }
        return false;
    }
}
?>