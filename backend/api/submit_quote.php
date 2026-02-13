<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../config/database.php';
include_once __DIR__ . '/../classes/Quote.php';

$database = new Database();
$db = $database->getConnection();
$quote = new Quote($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect form data
    $quote->brand = $_POST['marca'] ?? '';
    $quote->year = $_POST['año'] ?? '';
    $quote->model = $_POST['modelo'] ?? '';
    $quote->version = $_POST['version'] ?? '';
    $quote->km = $_POST['kilometraje'] ?? '';
    $quote->email = $_POST['email'] ?? '';
    $quote->vehicle_condition = $_POST['condicion'] ?? '';
    $quote->features = $_POST['caracteristicas'] ?? '[]'; // Expecting JSON string from frontend
    $quote->recent_improvements = $_POST['mejoras'] ?? '[]'; // Expecting JSON string from frontend
    $quote->other_features = $_POST['otroCaracteristica'] ?? '';
    $quote->other_improvements = $_POST['otraMejora'] ?? '';

    // Create the quote submission
    $submission_id = $quote->create();

    if ($submission_id) {
        $uploaded_images = [];

        // Handle image uploads
        if (isset($_FILES['photos']) && !empty($_FILES['photos']['name'][0])) {
            $upload_dir = __DIR__ . "/uploads/quotes/" . $submission_id . "/";

            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $file_count = count($_FILES['photos']['name']);
            for ($i = 0; $i < $file_count; $i++) {
                if ($_FILES['photos']['error'][$i] === UPLOAD_ERR_OK) {
                    $file_tmp = $_FILES['photos']['tmp_name'][$i];
                    $file_name = $_FILES['photos']['name'][$i];
                    $ext = pathinfo($file_name, PATHINFO_EXTENSION);
                    $new_filename = time() . "_" . $i . "." . $ext;
                    $target_file = $upload_dir . $new_filename;

                    if (move_uploaded_file($file_tmp, $target_file)) {
                        $image_path = "uploads/quotes/" . $submission_id . "/" . $new_filename;
                        $quote->addImage($submission_id, $image_path);
                        $uploaded_images[] = $image_path;
                    }
                }
            }
        }

        // Send Email Notification
        $to = "comercial@takeoffauto.online";
        $subject = "Nueva Cotización de Auto - " . $quote->brand . " " . $quote->model;

        // Decode features and improvements if they are JSON strings
        $features_list = json_decode($quote->features);
        $improvements_list = json_decode($quote->recent_improvements);

        $features_text = is_array($features_list) ? implode(", ", $features_list) : $quote->features;
        $improvements_text = is_array($improvements_list) ? implode(", ", $improvements_list) : $quote->recent_improvements;

        $message = "
        <html>
        <head>
            <title>Nueva Cotización de Auto</title>
        </head>
        <body style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
            <div style='background-color: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #0066FF; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #0066FF; margin-top: 0;'>🚗 Nueva Solicitud de Cotización</h2>
                <p>Se ha recibido una nueva consulta de tasación desde el sitio web.</p>
                
                <h3 style='border-bottom: 2px solid #eee; padding-bottom: 5px; color: #1a1a1a;'>Datos del Vehículo</h3>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr><td style='padding: 8px 0;'><strong>Marca:</strong></td><td>{$quote->brand}</td></tr>
                    <tr><td style='padding: 8px 0;'><strong>Modelo:</strong></td><td>{$quote->model}</td></tr>
                    <tr><td style='padding: 8px 0;'><strong>Versión:</strong></td><td>{$quote->version}</td></tr>
                    <tr><td style='padding: 8px 0;'><strong>Año:</strong></td><td>{$quote->year}</td></tr>
                    <tr><td style='padding: 8px 0;'><strong>Kilometraje:</strong></td><td>{$quote->km}</td></tr>
                    <tr><td style='padding: 8px 0;'><strong>Condición:</strong></td><td>{$quote->vehicle_condition}</td></tr>
                </table>

                <h3 style='border-bottom: 2px solid #eee; padding-bottom: 5px; color: #1a1a1a; margin-top: 20px;'>Equipamiento y Mejoras</h3>
                <p><strong>Características:</strong> {$features_text}</p>
                " . ($quote->other_features ? "<p><strong>Otras características:</strong> {$quote->other_features}</p>" : "") . "
                <p><strong>Mejoras:</strong> {$improvements_text}</p>
                " . ($quote->other_improvements ? "<p><strong>Otras mejoras:</strong> {$quote->other_improvements}</p>" : "") . "

                <h3 style='border-bottom: 2px solid #eee; padding-bottom: 5px; color: #1a1a1a; margin-top: 20px;'>Contacto</h3>
                <p><strong>Email:</strong> <a href='mailto:{$quote->email}' style='color: #0066FF;'>{$quote->email}</a></p>

                <h3 style='border-bottom: 2px solid #eee; padding-bottom: 5px; color: #1a1a1a; margin-top: 20px;'>Fotos</h3>
                <p>Se han adjuntado <strong>" . count($uploaded_images) . "</strong> fotos.</p>
                <p style='font-size: 13px; color: #666;'>Las fotos están guardadas en el servidor bajo el ID de envío #{$submission_id}.</p>
                
                <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;'>
                    Mensaje generado automáticamente por el sistema de cotizaciones de TAKEOFF AUTO.
                </div>
            </div>
        </body>
        </html>
        ";

        // Headers
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: no-reply@takeoffauto.online" . "\r\n";

        mail($to, $subject, $message, $headers);

        echo json_encode([
            "success" => true,
            "message" => "Quote submission successful and email sent",
            "id" => $submission_id,
            "images" => $uploaded_images
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to save quote submission"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);
}
?>