<?php
$data = file_get_contents('http://localhost/takeoffauto-api/api/cars.php');
$json = json_decode($data, true);
if ($json && isset($json['data'])) {
    foreach ($json['data'] as $car) {
        if (strpos(strtolower($car['brand'] . ' ' . $car['model']), 'clio') !== false) {
             echo "ID: " . $car['id'] . " - " . $car['brand'] . " " . $car['model'] . "\n";
             echo "KM: " . $car['km'] . "\n";
             echo "Images: " . json_encode($car['images']) . "\n";
             echo "-------------------\n";
        }
    }
} else {
    echo "Error fetching data";
}
?>
