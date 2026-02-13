<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../config/database.php';
include_once __DIR__ . '/../classes/Car.php';

$database = new Database();
$db = $database->getConnection();
$car = new Car($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get car ID from POST data
    $car_id = isset($_POST['car_id']) ? $_POST['car_id'] : null;

    if (!$car_id) {
        echo json_encode(array(
            "success" => false,
            "message" => "Car ID is required"
        ));
        exit();
    }

    // Check if files were uploaded
    if (!isset($_FILES['images']) || count($_FILES['images']['name']) == 0) {
        echo json_encode(array(
            "success" => false,
            "message" => "No images were uploaded"
        ));
        exit();
    }

    $uploaded_images = array();
    $upload_dir = __DIR__ . "/uploads/cars/" . $car_id . "/";

    // Create directory if it doesn't exist
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // Process each file
    $file_count = count($_FILES['images']['name']);
    $max_files = 15;

    if ($file_count > $max_files) {
        $file_count = $max_files;
    }

    for ($i = 0; $i < $file_count; $i++) {
        // Skip if no file
        if ($_FILES['images']['error'][$i] !== UPLOAD_ERR_OK) {
            continue;
        }

        $file_tmp = $_FILES['images']['tmp_name'][$i];
        $file_name = $_FILES['images']['name'][$i];
        $file_size = $_FILES['images']['size'][$i];
        $file_type = $_FILES['images']['type'][$i];

        // Check file type
        $allowed_types = array('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp');
        if (!in_array($file_type, $allowed_types)) {
            continue;
        }

        // Check file size (max 10MB)
        if ($file_size > 10485760) {
            continue;
        }

        // Generate unique filename
        $ext = pathinfo($file_name, PATHINFO_EXTENSION);
        $new_filename = time() . "_" . $i . "." . $ext;
        $target_file = $upload_dir . $new_filename;

        // Simple move - NO compression for now
        if (move_uploaded_file($file_tmp, $target_file)) {
            // Save to database
            $image_path = "uploads/cars/" . $car_id . "/" . $new_filename;
            $is_primary = ($i === 0); // First image is primary
            $display_order = $i + 1;

            $car->id = $car_id;
            $car->addImage($image_path, $is_primary, $display_order);

            array_push($uploaded_images, $image_path);
        }
    }

    if (count($uploaded_images) > 0) {
        echo json_encode(array(
            "success" => true,
            "message" => count($uploaded_images) . " images uploaded successfully",
            "images" => $uploaded_images
        ));
    } else {
        echo json_encode(array(
            "success" => false,
            "message" => "No images were uploaded successfully"
        ));
    }
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Method not allowed"
    ));
}
?>