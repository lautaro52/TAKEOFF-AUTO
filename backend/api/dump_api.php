<?php
$id = 111;
$url = "http://localhost:8000/cars.php?id=$id";
$json = file_get_contents($url);
echo "--- API Response for ID $id ---\n";
echo $json;
echo "\n--- End of Response ---\n";
?>