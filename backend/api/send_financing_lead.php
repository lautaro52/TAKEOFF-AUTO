<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->name) && !empty($data->whatsapp)) {
    $to = "comercial@takeoffauto.online";
    $subject = "Nueva Solicitud de Crédito - " . ($data->carName ?? "TAKEOFF AUTO");

    $message = "
    <html>
    <head>
        <title>Solicitud de Crédito</title>
    </head>
    <body style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
        <div style='background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #ddd;'>
            <h2 style='color: #005CB9; margin-bottom: 20px;'>📝 Nueva Solicitud de Crédito</h2>
            <p>Se ha recibido una nueva solicitud de financiación con los siguientes detalles:</p>
            
            <h3 style='border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 25px;'>Datos del Cliente</h3>
            <table style='width: 100%; border-collapse: collapse; background-color: #fff;'>
                <tr><td style='padding: 8px; border-bottom: 1px solid #eee; width: 30%;'><strong>Nombre:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>{$data->name}</td></tr>
                <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>DNI:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>{$data->dni}</td></tr>
                <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Email:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>{$data->email}</td></tr>
                <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>WhatsApp:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>{$data->whatsapp}</td></tr>
            </table>

            <h3 style='border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 25px;'>Datos del Vehículo</h3>
            <table style='width: 100%; border-collapse: collapse; background-color: #fff;'>
                <tr><td style='padding: 8px; border-bottom: 1px solid #eee; width: 30%;'><strong>Vehículo:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>{$data->carName}</td></tr>
                <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Precio:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>$" . number_format($data->carPrice, 0, ',', '.') . "</td></tr>
            </table>

            <h3 style='border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 25px;'>Detalles de Financiación</h3>
            <table style='width: 100%; border-collapse: collapse; background-color: #fff;'>
                <tr><td style='padding: 8px; border-bottom: 1px solid #eee; width: 30%;'><strong>Banco:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee; text-transform: uppercase;'>{$data->bank}</td></tr>
                <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Entrega Inicial:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>$" . number_format($data->downPayment, 0, ',', '.') . "</td></tr>
                <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Plazo:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>{$data->term} meses</td></tr>
                <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Cuota Aprox:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>$" . number_format($data->installment, 0, ',', '.') . "</td></tr>
            </table>
            
            <p style='margin-top: 30px; font-size: 12px; color: #777;'>
                Este correo fue generado automáticamente por el sistema de TAKEOFF AUTO.
            </p>
        </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: sistema@takeoffauto.online" . "\r\n";

    if (mail($to, $subject, $message, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Lead enviado exitosamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error al enviar el correo"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>