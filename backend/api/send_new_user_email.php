<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->name)) {
    $to = "comercial@takeoffauto.online";
    $subject = "Nuvo Usuario Registrado - TAKEOFF AUTO";
    
    $message = "
    <html>
    <head>
        <title>Nuevo Usuario Registrado</title>
    </head>
    <body style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
        <div style='background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #ddd;'>
            <h2 style='color: #000; margin-bottom: 20px;'>🚀 ¡Nuevo Usuario en TAKEOFF AUTO!</h2>
            <p>Un nuevo usuario ha iniciado sesión o se ha registrado en la plataforma.</p>
            
            <table style='width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fff;'>
                <tr>
                    <td style='padding: 12px; border-bottom: 1px solid #eee;'><strong>Nombre:</strong></td>
                    <td style='padding: 12px; border-bottom: 1px solid #eee;'>{$data->name}</td>
                </tr>
                <tr>
                    <td style='padding: 12px; border-bottom: 1px solid #eee;'><strong>Email:</strong></td>
                    <td style='padding: 12px; border-bottom: 1px solid #eee;'>{$data->email}</td>
                </tr>
                <tr>
                    <td style='padding: 12px; border-bottom: 1px solid #eee;'><strong>Fecha:</strong></td>
                    <td style='padding: 12px; border-bottom: 1px solid #eee;'>" . date("d/m/Y H:i:s") . "</td>
                </tr>
                <tr>
                    <td style='padding: 12px; border-bottom: 1px solid #eee;'><strong>ID Usuario:</strong></td>
                    <td style='padding: 12px; border-bottom: 1px solid #eee;'>{$data->uid}</td>
                </tr>
            </table>
            
            <p style='margin-top: 30px; font-size: 12px; color: #777;'>
                Este correo fue generado automáticamente por el sistema de autenticación de TAKEOFF AUTO.
            </p>
        </div>
    </body>
    </html>
    ";

    // Headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: no-reply@takeoffauto.online" . "\r\n";

    if (mail($to, $subject, $message, $headers)) {
        http_response_code(200);
        echo json_encode(["message" => "Correo enviado exitosamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error al enviar el correo"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Datos incompletos"]);
}
?>
