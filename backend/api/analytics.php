<?php
// Set CORS headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database configuration
include_once __DIR__ . '/../config/database.php';

// Instantiate database
$database = new Database();
$db = $database->getConnection();

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Record analytics event
        recordAnalyticsEvent($db);
        break;

    case 'GET':
        // Get analytics data based on type parameter
        $type = isset($_GET['type']) ? $_GET['type'] : 'popular_models';

        switch ($type) {
            case 'popular_models':
                getPopularModels($db);
                break;
            case 'search_trends':
                getSearchTrends($db);
                break;
            case 'location_insights':
                getLocationInsights($db);
                break;
            default:
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid analytics type'
                ]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
}

/**
 * Record an analytics event
 */
function recordAnalyticsEvent($db)
{
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->event_type)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Event type is required'
        ]);
        return;
    }

    try {
        $query = "INSERT INTO search_analytics 
                  (event_type, car_id, brand, model, type, 
                   price_min, price_max, fuel, transmission, color,
                   latitude, longitude, city, region, country,
                   user_agent, ip_address) 
                  VALUES 
                  (:event_type, :car_id, :brand, :model, :type,
                   :price_min, :price_max, :fuel, :transmission, :color,
                   :latitude, :longitude, :city, :region, :country,
                   :user_agent, :ip_address)";

        $stmt = $db->prepare($query);

        // Bind values
        $stmt->bindValue(':event_type', $data->event_type);
        $stmt->bindValue(':car_id', $data->car_id ?? null, PDO::PARAM_INT);
        $stmt->bindValue(':brand', $data->brand ?? null);
        $stmt->bindValue(':model', $data->model ?? null);
        $stmt->bindValue(':type', $data->type ?? null);
        $stmt->bindValue(':price_min', $data->price_min ?? null);
        $stmt->bindValue(':price_max', $data->price_max ?? null);
        $stmt->bindValue(':fuel', $data->fuel ?? null);
        $stmt->bindValue(':transmission', $data->transmission ?? null);
        $stmt->bindValue(':color', $data->color ?? null);
        $stmt->bindValue(':latitude', $data->latitude ?? null);
        $stmt->bindValue(':longitude', $data->longitude ?? null);
        $stmt->bindValue(':city', $data->city ?? null);
        $stmt->bindValue(':region', $data->region ?? null);
        $stmt->bindValue(':country', $data->country ?? 'Argentina');
        $stmt->bindValue(':user_agent', $_SERVER['HTTP_USER_AGENT'] ?? null);
        $stmt->bindValue(':ip_address', $_SERVER['REMOTE_ADDR'] ?? null);

        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Event recorded successfully'
            ]);
        } else {
            throw new Exception('Failed to insert event');
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error recording event: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get most popular car models
 */
function getPopularModels($db)
{
    $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
    $city = isset($_GET['city']) ? $_GET['city'] : null;
    $region = isset($_GET['region']) ? $_GET['region'] : null;

    try {
        $query = "SELECT 
                    brand,
                    model,
                    type,
                    COUNT(*) as search_count,
                    COUNT(DISTINCT DATE(created_at)) as days_searched
                  FROM search_analytics
                  WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                    AND brand IS NOT NULL
                    AND model IS NOT NULL";

        if ($city) {
            $query .= " AND city = :city";
        }
        if ($region) {
            $query .= " AND region = :region";
        }

        $query .= " GROUP BY brand, model, type
                    ORDER BY search_count DESC
                    LIMIT 20";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':days', $days, PDO::PARAM_INT);

        if ($city) {
            $stmt->bindParam(':city', $city);
        }
        if ($region) {
            $stmt->bindParam(':region', $region);
        }

        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => array_map(function ($item) {
                return [
                    'brand' => $item['brand'],
                    'model' => $item['model'],
                    'type' => $item['type'],
                    'search_count' => intval($item['search_count']),
                    'days_searched' => intval($item['days_searched'])
                ];
            }, $results)
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching popular models: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get search trends over time
 */
function getSearchTrends($db)
{
    $period = isset($_GET['period']) ? $_GET['period'] : 'day';
    $days = isset($_GET['days']) ? intval($_GET['days']) : 30;

    try {
        $dateFormat = match ($period) {
            'hour' => '%Y-%m-%d %H:00:00',
            'day' => '%Y-%m-%d',
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d'
        };

        $query = "SELECT 
                    DATE_FORMAT(created_at, :date_format) as period,
                    event_type,
                    COUNT(*) as event_count
                  FROM search_analytics
                  WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                  GROUP BY period, event_type
                  ORDER BY period ASC";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':date_format', $dateFormat);
        $stmt->bindParam(':days', $days, PDO::PARAM_INT);

        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => $results
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching trends: ' . $e->getMessage()
        ]);
    }
}

/**
 * Get location-based insights
 */
function getLocationInsights($db)
{
    $days = isset($_GET['days']) ? intval($_GET['days']) : 30;

    try {
        $query = "SELECT 
                    city,
                    region,
                    brand,
                    model,
                    COUNT(*) as search_count
                  FROM search_analytics
                  WHERE created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                    AND city IS NOT NULL
                    AND brand IS NOT NULL
                  GROUP BY city, region, brand, model
                  ORDER BY city, search_count DESC";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':days', $days, PDO::PARAM_INT);

        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Group by city
        $grouped = [];
        foreach ($results as $row) {
            $city = $row['city'];
            if (!isset($grouped[$city])) {
                $grouped[$city] = [
                    'city' => $city,
                    'region' => $row['region'],
                    'total_searches' => 0,
                    'top_models' => []
                ];
            }

            $grouped[$city]['total_searches'] += intval($row['search_count']);

            if (count($grouped[$city]['top_models']) < 5) {
                $grouped[$city]['top_models'][] = [
                    'brand' => $row['brand'],
                    'model' => $row['model'],
                    'search_count' => intval($row['search_count'])
                ];
            }
        }

        echo json_encode([
            'success' => true,
            'data' => array_values($grouped)
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching location insights: ' . $e->getMessage()
        ]);
    }
}
?>