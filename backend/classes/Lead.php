<?php
class Lead
{
    private $conn;
    private $table_name = "leads";

    public $id;
    public $partner_id;
    public $car_id;
    public $client_name;
    public $client_whatsapp;
    public $note;
    public $status;
    public $caida_reason;
    public $commission_amount;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Create lead
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET partner_id=:partner_id, car_id=:car_id, 
                      client_name=:client_name, client_whatsapp=:client_whatsapp, note=:note";

        $stmt = $this->conn->prepare($query);

        $this->partner_id = htmlspecialchars(strip_tags($this->partner_id));
        $this->car_id = htmlspecialchars(strip_tags($this->car_id));
        $this->client_name = htmlspecialchars(strip_tags($this->client_name));
        $this->client_whatsapp = htmlspecialchars(strip_tags($this->client_whatsapp));
        $this->note = htmlspecialchars(strip_tags($this->note));

        $stmt->bindParam(":partner_id", $this->partner_id);
        $stmt->bindParam(":car_id", $this->car_id);
        $stmt->bindParam(":client_name", $this->client_name);
        $stmt->bindParam(":client_whatsapp", $this->client_whatsapp);
        $stmt->bindParam(":note", $this->note);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Read leads by partner
    public function readByPartner($partner_id)
    {
        $query = "SELECT l.*, c.brand, c.model, c.year 
                  FROM " . $this->table_name . " l
                  LEFT JOIN cars c ON l.car_id = c.id
                  WHERE l.partner_id = ?
                  ORDER BY l.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $partner_id);
        $stmt->execute();
        return $stmt;
    }

    // Read all leads (for sellers)
    public function readAll()
    {
        $query = "SELECT l.*, c.brand, c.model, c.year, p.full_name as partner_name 
                  FROM " . $this->table_name . " l
                  LEFT JOIN cars c ON l.car_id = c.id
                  LEFT JOIN partners p ON l.partner_id = p.id
                  ORDER BY l.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Update status
    public function updateStatus($id, $status, $caida_reason = null)
    {
        $query = "UPDATE " . $this->table_name . " SET status = :status, caida_reason = :caida_reason WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":caida_reason", $caida_reason);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }
}
?>