<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$token = $matches[1];

try {
    $stmt = $pdo->prepare("SELECT name, surname, email, id FROM users WHERE session_token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid token"]);
        exit;
    }

    $stmt2 = $pdo->prepare("SELECT origin, destination FROM user_routes WHERE user_id = ?");
    $stmt2->execute([$user['id']]);
    $route = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "id" => $user['id'],
        "name" => $user['name'],
        "surname" => $user['surname'],
        "email" => $user['email'],
        "origin" => $route['origin'] ?? null,
        "destination" => $route['destination'] ?? null
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error", "details" => $e->getMessage()]);
}
?>
