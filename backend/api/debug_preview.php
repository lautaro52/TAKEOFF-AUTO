<?php
$data = file_get_contents('http://localhost/takeoffauto-api/api/cars.php');
$json = json_decode($data, true);
if ($json && isset($json['data'])) {
    $all = $json['data'];
    $usedForPreview = [];
    foreach ($all as $c) {
        $hasPhotos = !empty($c['images']) && $c['images'][0] != "" && strpos($c['images'][0], 'placeholder') === false;
        $arsPrice = floatval($c['price']); // Simple check similar to carsService
        if ($c['price'] < 1000000) $arsPrice *= 1500;
        
        if ($c['km'] > 0 && $arsPrice > 0 && $hasPhotos && $c['status'] == 'disponible') {
            $c['arsPrice'] = $arsPrice;
            $usedForPreview[] = $c;
        }
    }
    
    usort($usedForPreview, function($a, $b) {
        return $a['arsPrice'] - $b['arsPrice'];
    });
    
    $slice = array_slice($usedForPreview, 0, 5);
    foreach ($slice as $c) {
        echo "ID: " . $c['id'] . " - " . $c['brand'] . " " . $c['model'] . " - Price: " . $c['arsPrice'] . " - Img: " . $c['images'][0] . "\n";
    }
}
?>
