<?php
/**
 * Utility script to import car data from a CSV file.
 * Usage: Place this script in backend/api/utils/ and run it via browser or CLI.
 * Remember to upload images to backend/api/uploads/cars/ first.
 */

include_once __DIR__ . '/../../config/database.php';
include_once __DIR__ . '/../../classes/Car.php';

// Configuration
$csv_file = __DIR__ . '/../../../database/import_template.csv';
$dry_run = false; // Set to true to test without inserting

if (!file_exists($csv_file)) {
    die("CSV file not found at: $csv_file");
}

$database = new Database();
$db = $database->getConnection();
$car_manager = new Car($db);

$handle = fopen($csv_file, "r");
$header = fgetcsv($handle); // Read header

echo "Starting import...\n";

$count = 0;
while (($row = fgetcsv($handle)) !== FALSE) {
    $data = array_combine($header, $row);

    // Create new car entry
    $car_manager->brand = $data['brand'];
    $car_manager->model = $data['model'];
    $car_manager->version = $data['version'];
    $car_manager->year = $data['year'];
    $car_manager->price = $data['price'];
    $car_manager->km = $data['km'];
    $car_manager->transmission = $data['transmission'];
    $car_manager->fuel = $data['fuel'];
    $car_manager->engine_size = $data['engine_size'];
    $car_manager->horsepower = $data['horsepower'];
    $car_manager->valves_per_cylinder = $data['valves_per_cylinder'];
    $car_manager->length_mm = $data['length_mm'];
    $car_manager->width_mm = $data['width_mm'];
    $car_manager->height_mm = $data['height_mm'];
    $car_manager->wheelbase_mm = $data['wheelbase_mm'];
    $car_manager->fuel_tank_liters = $data['fuel_tank_liters'];
    $car_manager->abs_brakes = $data['abs_brakes'];
    $car_manager->airbags = $data['airbags'];
    $car_manager->cruise_control = $data['cruise_control'];
    $car_manager->air_conditioning = $data['air_conditioning'];
    $car_manager->onboard_computer = $data['onboard_computer'];
    $car_manager->cup_holders = $data['cup_holders'];
    $car_manager->steering_type = $data['steering_type'];
    $car_manager->traction_control = $data['traction_control'];
    $car_manager->am_fm_radio = $data['am_fm_radio'];
    $car_manager->bluetooth = $data['bluetooth'];
    $car_manager->mp3_player = $data['mp3_player'];
    $car_manager->type = $data['type'];
    $car_manager->color = $data['color'];
    $car_manager->doors = $data['doors'];
    $car_manager->passengers = $data['passengers'];
    $car_manager->city = $data['city'];
    $car_manager->status = $data['status'];
    $car_manager->featured = $data['featured'];

    if (!$dry_run) {
        // Use the updated create() method that now handles all fields
        $car_id = $car_manager->create();
        if ($car_id) {
            echo "Imported: {$data['brand']} {$data['model']} (ID: $car_id)\n";

            // Handle images
            if (!empty($data['images'])) {
                $images = explode('|', $data['images']);
                foreach ($images as $index => $img_name) {
                    $path = "uploads/cars/" . trim($img_name);
                    $is_primary = ($index === 0);
                    $car_manager->id = $car_id;
                    $car_manager->addImage($path, $is_primary, $index);
                }
            }
            $count++;
        } else {
            echo "Error importing: {$data['brand']} {$data['model']}\n";
        }
    }
}

fclose($handle);
echo "\nImport completed. Total car imported: $count\n";
