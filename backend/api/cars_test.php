<?php
// Set CORS headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database and object files
include_once __DIR__ . '/../config/database.php';
include_once __DIR__ . '/../classes/Car.php';

// Instantiate database and car object
$database = new Database();
$db = $database->getConnection();
$car = new Car($db);

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

//Handle different HTTP methods
switch ($method) {
    case 'GET':
        // Check if ID is provided
        if (isset($_GET['id'])) {
            // Get single car
            $car->id = isset($_GET['id']) ? $_GET['id'] : die();
            $result = $car->readOne();

            if ($result) {
                $car_arr = array(
                    "id" => $car->id,
                    "brand" => $car->brand,
                    "model" => $car->model,
                    "version" => $car->version,
                    "year" => $car->year,
                    "price" => $car->price,
                    "specs" => $car->specs,
                    "km" => $car->km,
                    "transmission" => $car->transmission,
                    "fuel" => $car->fuel,
                    "engine_size" => $car->engine_size,
                    "horsepower" => $car->horsepower,
                    "valves_per_cylinder" => $car->valves_per_cylinder,
                    "length_mm" => $car->length_mm,
                    "width_mm" => $car->width_mm,
                    "height_mm" => $car->height_mm,
                    "wheelbase_mm" => $car->wheelbase_mm,
                    "fuel_tank_liters" => $car->fuel_tank_liters,
                    "abs_brakes" => $car->abs_brakes == 1,
                    "airbags" => $car->airbags,
                    "cruise_control" => $car->cruise_control == 1,
                    "air_conditioning" => $car->air_conditioning == 1,
                    "onboard_computer" => $car->onboard_computer == 1,
                    "cup_holders" => $car->cup_holders == 1,
                    "steering_type" => $car->steering_type,
                    "traction_control" => $car->traction_control,
                    "am_fm_radio" => $car->am_fm_radio == 1,
                    "bluetooth" => $car->bluetooth == 1,
                    "mp3_player" => $car->mp3_player == 1,
                    "type" => $car->type,
                    "color" => $car->color,
                    "doors" => $car->doors,
                    "passengers" => $car->passengers,
                    "city" => $car->city,
                    "status" => $car->status,
                    "featured" => $car->featured == 1,
                    "home_section" => $car->home_section,
                    "domain" => $car->domain,
                    "photos_sorted" => ($car->photos_sorted ?? 0) == 1,
                    "images" => $result['images'] ? explode('||', $result['images']) : []
                );

                echo json_encode(array(
                    "success" => true,
                    "data" => $car_arr
                ));
            } else {
                echo json_encode(array(
                    "success" => false,
                    "message" => "Car not found."
                ));
            }
        } else {
            // Get all cars
            $stmt = $car->read();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $cars_arr = array();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);

                    $car_item = array(
                        "id" => $id,
                        "brand" => $brand,
                        "model" => $model,
                        "version" => $version ?? null,
                        "year" => $year,
                        "price" => floatval($price),
                        "specs" => $specs,
                        "km" => $km,
                        "transmission" => $transmission,
                        "fuel" => $fuel,
                        "engine_size" => $engine_size ?? null,
                        "horsepower" => $horsepower ?? null,
                        "valves_per_cylinder" => $valves_per_cylinder ?? null,
                        "length_mm" => $length_mm ?? null,
                        "width_mm" => $width_mm ?? null,
                        "height_mm" => $height_mm ?? null,
                        "wheelbase_mm" => $wheelbase_mm ?? null,
                        "fuel_tank_liters" => $fuel_tank_liters ?? null,
                        "abs_brakes" => ($abs_brakes ?? 0) == 1,
                        "airbags" => $airbags ?? null,
                        "cruise_control" => ($cruise_control ?? 0) == 1,
                        "air_conditioning" => ($air_conditioning ?? 0) == 1,
                        "onboard_computer" => ($onboard_computer ?? 0) == 1,
                        "cup_holders" => ($cup_holders ?? 0) == 1,
                        "steering_type" => $steering_type ?? null,
                        "traction_control" => $traction_control ?? null,
                        "am_fm_radio" => ($am_fm_radio ?? 0) == 1,
                        "bluetooth" => ($bluetooth ?? 0) == 1,
                        "mp3_player" => ($mp3_player ?? 0) == 1,
                        "type" => $type,
                        "color" => $color,
                        "doors" => $doors ?? null,
                        "passengers" => $passengers ?? null,
                        "city" => $city,
                        "status" => $status,
                        "featured" => $featured == 1,
                        "home_section" => $home_section ?? null,
                        "domain" => $domain ?? null,
                        "photos_sorted" => ($photos_sorted ?? 0) == 1,
                        "images" => $images ? explode('||', $images) : []
                    );

                    array_push($cars_arr, $car_item);
                }

                echo json_encode(array(
                    "success" => true,
                    "data" => $cars_arr
                ));
            } else {
                echo json_encode(array(
                    "success" => true,
                    "data" => array()
                ));
            }
        }
        break;

    case 'POST':
        // Catalog is locked
        http_response_code(403);
        echo json_encode(array(
            "success" => false,
            "message" => "El catálogo está bloqueado. No se permiten nuevos ingresos por el momento."
        ));
        break;

    case 'PUT':
        // Catalog is locked
        http_response_code(403);
        echo json_encode(array(
            "success" => false,
            "message" => "El catálogo está bloqueado. No se permiten modificaciones por el momento."
        ));
        break;

    case 'DELETE':
        // Catalog is locked
        http_response_code(403);
        echo json_encode(array(
            "success" => false,
            "message" => "El catálogo está bloqueado. No se permiten eliminaciones por el momento."
        ));
        break;

    default:
        http_response_code(405);
        echo json_encode(array(
            "success" => false,
            "message" => "Method not allowed."
        ));
        break;
}
?>