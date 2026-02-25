<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// TODO: Cambiar por tu API KEY de Google Cloud habilitada para Sheets API
$apiKey = "AIzaSyAfpihCOvFvCRy2_ALHukOsy96eEJFEo6Y";
// ID del Spreadsheet
$spreadsheetId = "1l1y3bmvbsFsM66OttAOK0yrY06K1fDFRH3h5UTMIjjE";
// Rango deseado (ajustar según el sheet)
$range = "Sheet1!A:B"; // Aquí se asume que dominio está en col A y stock en col B

// URL API Google Sheets
$url = "https://sheets.googleapis.com/v4/spreadsheets/$spreadsheetId/values/$range?key=$apiKey";

// Obtener datos JSON
$response = file_get_contents($url);

// Validar datos
if ($response === FALSE) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "No se pudo acceder al Google Sheet"]);
    exit();
}

$data = json_decode($response, true);

// Procesar filas
$stockData = [];
if (isset($data['values'])) {
    foreach ($data['values'] as $row) {
        if (count($row) >= 2) {
            $domain = trim($row[0]);
            $stockCount = (int)$row[1];
            $stockData[$domain] = $stockCount;
        }
    }
}

// Responder
echo json_encode(["success" => true, "data" => $stockData]);
?>