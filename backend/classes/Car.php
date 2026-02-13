<?php
class Car
{
    private $conn;
    private $table_name = "cars";
    private $images_table = "car_images";

    public $id;
    public $brand;
    public $model;
    public $version;
    public $year;
    public $price;
    public $specs;
    public $km;
    public $transmission;
    public $fuel;
    public $engine_size;
    public $horsepower;
    public $valves_per_cylinder;
    public $length_mm;
    public $width_mm;
    public $height_mm;
    public $wheelbase_mm;
    public $fuel_tank_liters;
    public $abs_brakes;
    public $airbags;
    public $cruise_control;
    public $air_conditioning;
    public $onboard_computer;
    public $cup_holders;
    public $steering_type;
    public $traction_control;
    public $am_fm_radio;
    public $bluetooth;
    public $mp3_player;
    public $type;
    public $color;
    public $doors;
    public $passengers;
    public $city;
    public $status;
    public $featured;
    public $home_section;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all cars
    public function read()
    {
        $query = "SELECT c.*, 
                  GROUP_CONCAT(ci.image_path ORDER BY ci.display_order SEPARATOR '||') as images
                  FROM " . $this->table_name . " c
                  LEFT JOIN " . $this->images_table . " ci ON c.id = ci.car_id
                  GROUP BY c.id
                  ORDER BY c.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Get single car
    public function readOne()
    {
        $query = "SELECT c.*, 
                  GROUP_CONCAT(ci.image_path ORDER BY ci.display_order SEPARATOR '||') as images
                  FROM " . $this->table_name . " c
                  LEFT JOIN " . $this->images_table . " ci ON c.id = ci.car_id
                  WHERE c.id = ?
                  GROUP BY c.id
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->brand = $row['brand'];
            $this->model = $row['model'];
            $this->version = $row['version'] ?? null;
            $this->year = $row['year'];
            $this->price = $row['price'];
            $this->specs = $row['specs'];
            $this->km = $row['km'];
            $this->transmission = $row['transmission'];
            $this->fuel = $row['fuel'];
            $this->engine_size = $row['engine_size'] ?? null;
            $this->horsepower = $row['horsepower'] ?? null;
            $this->valves_per_cylinder = $row['valves_per_cylinder'] ?? null;
            $this->length_mm = $row['length_mm'] ?? null;
            $this->width_mm = $row['width_mm'] ?? null;
            $this->height_mm = $row['height_mm'] ?? null;
            $this->wheelbase_mm = $row['wheelbase_mm'] ?? null;
            $this->fuel_tank_liters = $row['fuel_tank_liters'] ?? null;
            $this->abs_brakes = $row['abs_brakes'] ?? 0;
            $this->airbags = $row['airbags'] ?? null;
            $this->cruise_control = $row['cruise_control'] ?? 0;
            $this->air_conditioning = $row['air_conditioning'] ?? 0;
            $this->onboard_computer = $row['onboard_computer'] ?? 0;
            $this->cup_holders = $row['cup_holders'] ?? 0;
            $this->steering_type = $row['steering_type'] ?? null;
            $this->traction_control = $row['traction_control'] ?? null;
            $this->am_fm_radio = $row['am_fm_radio'] ?? 0;
            $this->bluetooth = $row['bluetooth'] ?? 0;
            $this->mp3_player = $row['mp3_player'] ?? 0;
            $this->type = $row['type'];
            $this->color = $row['color'];
            $this->doors = $row['doors'] ?? null;
            $this->passengers = $row['passengers'] ?? null;
            $this->city = $row['city'];
            $this->status = $row['status'];
            $this->featured = $row['featured'];
            $this->home_section = $row['home_section'];

            return $row;
        }

        return false;
    }

    // Create car
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET brand=:brand, model=:model, version=:version, year=:year, price=:price,
                      specs=:specs, km=:km, transmission=:transmission,
                      fuel=:fuel, engine_size=:engine_size, horsepower=:horsepower, 
                      valves_per_cylinder=:valves_per_cylinder, length_mm=:length_mm, 
                      width_mm=:width_mm, height_mm=:height_mm, wheelbase_mm=:wheelbase_mm,
                      fuel_tank_liters=:fuel_tank_liters, abs_brakes=:abs_brakes, 
                      airbags=:airbags, cruise_control=:cruise_control, 
                      air_conditioning=:air_conditioning, onboard_computer=:onboard_computer,
                      cup_holders=:cup_holders, steering_type=:steering_type, 
                      traction_control=:traction_control, am_fm_radio=:am_fm_radio, 
                      bluetooth=:bluetooth, mp3_player=:mp3_player,
                      type=:type, color=:color, doors=:doors, passengers=:passengers, 
                      city=:city, status=:status, featured=:featured, home_section=:home_section";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->brand = htmlspecialchars(strip_tags($this->brand));
        $this->model = htmlspecialchars(strip_tags($this->model));
        $this->version = htmlspecialchars(strip_tags($this->version));
        $this->year = htmlspecialchars(strip_tags($this->year));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->specs = htmlspecialchars(strip_tags($this->specs));
        $this->km = htmlspecialchars(strip_tags($this->km));
        $this->city = htmlspecialchars(strip_tags($this->city));
        $this->airbags = htmlspecialchars(strip_tags($this->airbags));
        $this->steering_type = htmlspecialchars(strip_tags($this->steering_type));
        $this->traction_control = htmlspecialchars(strip_tags($this->traction_control));

        // Bind
        $stmt->bindParam(":brand", $this->brand);
        $stmt->bindParam(":model", $this->model);
        $stmt->bindParam(":version", $this->version);
        $stmt->bindParam(":year", $this->year);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":specs", $this->specs);
        $stmt->bindParam(":km", $this->km);
        $stmt->bindParam(":transmission", $this->transmission);
        $stmt->bindParam(":fuel", $this->fuel);
        $stmt->bindParam(":engine_size", $this->engine_size);
        $stmt->bindParam(":horsepower", $this->horsepower);
        $stmt->bindParam(":valves_per_cylinder", $this->valves_per_cylinder);
        $stmt->bindParam(":length_mm", $this->length_mm);
        $stmt->bindParam(":width_mm", $this->width_mm);
        $stmt->bindParam(":height_mm", $this->height_mm);
        $stmt->bindParam(":wheelbase_mm", $this->wheelbase_mm);
        $stmt->bindParam(":fuel_tank_liters", $this->fuel_tank_liters);
        $stmt->bindParam(":abs_brakes", $this->abs_brakes);
        $stmt->bindParam(":airbags", $this->airbags);
        $stmt->bindParam(":cruise_control", $this->cruise_control);
        $stmt->bindParam(":air_conditioning", $this->air_conditioning);
        $stmt->bindParam(":onboard_computer", $this->onboard_computer);
        $stmt->bindParam(":cup_holders", $this->cup_holders);
        $stmt->bindParam(":steering_type", $this->steering_type);
        $stmt->bindParam(":traction_control", $this->traction_control);
        $stmt->bindParam(":am_fm_radio", $this->am_fm_radio);
        $stmt->bindParam(":bluetooth", $this->bluetooth);
        $stmt->bindParam(":mp3_player", $this->mp3_player);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":color", $this->color);
        $stmt->bindParam(":doors", $this->doors);
        $stmt->bindParam(":passengers", $this->passengers);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":featured", $this->featured);
        $stmt->bindParam(":home_section", $this->home_section);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }

        return false;
    }

    // Update car
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET brand=:brand, model=:model, version=:version, year=:year, price=:price,
                      specs=:specs, km=:km, transmission=:transmission,
                      fuel=:fuel, engine_size=:engine_size, horsepower=:horsepower, 
                      valves_per_cylinder=:valves_per_cylinder, length_mm=:length_mm, 
                      width_mm=:width_mm, height_mm=:height_mm, wheelbase_mm=:wheelbase_mm,
                      fuel_tank_liters=:fuel_tank_liters, abs_brakes=:abs_brakes, 
                      airbags=:airbags, cruise_control=:cruise_control, 
                      air_conditioning=:air_conditioning, onboard_computer=:onboard_computer,
                      cup_holders=:cup_holders, steering_type=:steering_type, 
                      traction_control=:traction_control, am_fm_radio=:am_fm_radio, 
                      bluetooth=:bluetooth, mp3_player=:mp3_player,
                      type=:type, color=:color, doors=:doors, passengers=:passengers, 
                      city=:city, status=:status, featured=:featured, home_section=:home_section
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->brand = htmlspecialchars(strip_tags($this->brand));
        $this->model = htmlspecialchars(strip_tags($this->model));
        $this->version = htmlspecialchars(strip_tags($this->version));
        $this->year = htmlspecialchars(strip_tags($this->year));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->specs = htmlspecialchars(strip_tags($this->specs));
        $this->km = htmlspecialchars(strip_tags($this->km));
        $this->city = htmlspecialchars(strip_tags($this->city));
        $this->airbags = htmlspecialchars(strip_tags($this->airbags));
        $this->steering_type = htmlspecialchars(strip_tags($this->steering_type));
        $this->traction_control = htmlspecialchars(strip_tags($this->traction_control));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind
        $stmt->bindParam(":brand", $this->brand);
        $stmt->bindParam(":model", $this->model);
        $stmt->bindParam(":version", $this->version);
        $stmt->bindParam(":year", $this->year);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":specs", $this->specs);
        $stmt->bindParam(":km", $this->km);
        $stmt->bindParam(":transmission", $this->transmission);
        $stmt->bindParam(":fuel", $this->fuel);
        $stmt->bindParam(":engine_size", $this->engine_size);
        $stmt->bindParam(":horsepower", $this->horsepower);
        $stmt->bindParam(":valves_per_cylinder", $this->valves_per_cylinder);
        $stmt->bindParam(":length_mm", $this->length_mm);
        $stmt->bindParam(":width_mm", $this->width_mm);
        $stmt->bindParam(":height_mm", $this->height_mm);
        $stmt->bindParam(":wheelbase_mm", $this->wheelbase_mm);
        $stmt->bindParam(":fuel_tank_liters", $this->fuel_tank_liters);
        $stmt->bindParam(":abs_brakes", $this->abs_brakes);
        $stmt->bindParam(":airbags", $this->airbags);
        $stmt->bindParam(":cruise_control", $this->cruise_control);
        $stmt->bindParam(":air_conditioning", $this->air_conditioning);
        $stmt->bindParam(":onboard_computer", $this->onboard_computer);
        $stmt->bindParam(":cup_holders", $this->cup_holders);
        $stmt->bindParam(":steering_type", $this->steering_type);
        $stmt->bindParam(":traction_control", $this->traction_control);
        $stmt->bindParam(":am_fm_radio", $this->am_fm_radio);
        $stmt->bindParam(":bluetooth", $this->bluetooth);
        $stmt->bindParam(":mp3_player", $this->mp3_player);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":color", $this->color);
        $stmt->bindParam(":doors", $this->doors);
        $stmt->bindParam(":passengers", $this->passengers);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":featured", $this->featured);
        $stmt->bindParam(":home_section", $this->home_section);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete car
    public function delete()
    {
        // First, delete all images from filesystem
        $query = "SELECT image_path FROM " . $this->images_table . " WHERE car_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $file_path = "../" . $row['image_path'];
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }

        // Delete car (images will be deleted by CASCADE)
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Add image to car
    public function addImage($image_path, $is_primary = false, $display_order = 0)
    {
        $query = "INSERT INTO " . $this->images_table . "
                  SET car_id=:car_id, image_path=:image_path,
                      is_primary=:is_primary, display_order=:display_order";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":car_id", $this->id);
        $stmt->bindParam(":image_path", $image_path);
        $stmt->bindParam(":is_primary", $is_primary);
        $stmt->bindParam(":display_order", $display_order);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete all images for a car
    public function deleteImages()
    {
        $query = "DELETE FROM " . $this->images_table . " WHERE car_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>