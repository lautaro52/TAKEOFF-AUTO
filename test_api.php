<?php
include_once 'c:/xampp/htdocs/takeoffauto-api/config/database.php';
include_once 'c:/xampp/htdocs/takeoffauto-api/classes/Car.php';

$database = new Database();
$db = $database->getConnection();
$car = new Car($db);
$car->id = 1;
$result = $car->readOne();

if ($result) {
    $car_arr = array(
        "id" => $car->id,
        "brand" => $car->brand,
        "engine_size" => $car->engine_size,
        "horsepower" => $car->horsepower,
        "abs_brakes" => intval($car->abs_brakes)
    );
    echo json_encode($car_arr, JSON_PRETTY_PRINT);
} else {
    echo "Car not found";
}
?>