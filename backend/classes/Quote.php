<?php
class Quote
{
    private $conn;
    private $table_name = "quote_submissions";
    private $images_table = "quote_images";

    public $id;
    public $brand;
    public $year;
    public $model;
    public $version;
    public $km;
    public $email;
    public $vehicle_condition;
    public $features;
    public $recent_improvements;
    public $other_features;
    public $other_improvements;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET brand=:brand, year=:year, model=:model, version=:version, 
                      km=:km, email=:email, vehicle_condition=:vehicle_condition, 
                      features=:features, recent_improvements=:recent_improvements, 
                      other_features=:other_features, other_improvements=:other_improvements";

        $stmt = $this->conn->prepare($query);

        $this->brand = htmlspecialchars(strip_tags($this->brand));
        $this->year = htmlspecialchars(strip_tags($this->year));
        $this->model = htmlspecialchars(strip_tags($this->model));
        $this->version = htmlspecialchars(strip_tags($this->version));
        $this->km = htmlspecialchars(strip_tags($this->km));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->vehicle_condition = htmlspecialchars(strip_tags($this->vehicle_condition));
        $this->features = htmlspecialchars(strip_tags($this->features));
        $this->recent_improvements = htmlspecialchars(strip_tags($this->recent_improvements));
        $this->other_features = htmlspecialchars(strip_tags($this->other_features));
        $this->other_improvements = htmlspecialchars(strip_tags($this->other_improvements));

        $stmt->bindParam(":brand", $this->brand);
        $stmt->bindParam(":year", $this->year);
        $stmt->bindParam(":model", $this->model);
        $stmt->bindParam(":version", $this->version);
        $stmt->bindParam(":km", $this->km);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":vehicle_condition", $this->vehicle_condition);
        $stmt->bindParam(":features", $this->features);
        $stmt->bindParam(":recent_improvements", $this->recent_improvements);
        $stmt->bindParam(":other_features", $this->other_features);
        $stmt->bindParam(":other_improvements", $this->other_improvements);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function addImage($submission_id, $image_path)
    {
        $query = "INSERT INTO " . $this->images_table . "
                  SET submission_id=:submission_id, image_path=:image_path";

        $stmt = $this->conn->prepare($query);

        $submission_id = htmlspecialchars(strip_tags($submission_id));
        $image_path = htmlspecialchars(strip_tags($image_path));

        $stmt->bindParam(":submission_id", $submission_id);
        $stmt->bindParam(":image_path", $image_path);

        return $stmt->execute();
    }
}
?>