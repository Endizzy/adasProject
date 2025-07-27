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

$data = json_decode(file_get_contents("php://input"), true);

$userId = $data['userId'] ?? null;
$email = $data['email'] ?? '';
$surname = $data['surname'] ?? '';
$origin = $data['origin'] ?? '';
$destination = $data['destination'] ?? '';

if (!$userId || !$origin || !$destination) {
    http_response_code(400);
    echo json_encode(['error' => 'Trūkst obligāto lauku']);
    exit;
}

try {
    // Проверка: уже существует заказ с таким email
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE email = ?");
    $checkStmt->execute([$email]);
    if ($checkStmt->fetchColumn() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['error' => 'Lietotājs jau ir veicis pasūtījumu ar šo e-pastu']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO orders (user_id, email, surname, origin, destination) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$userId, $email, $surname, $origin, $destination]);

    $stmt2 = $pdo->prepare("INSERT INTO user_routes (user_id, origin, destination) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE origin = VALUES(origin), destination = VALUES(destination)");
    $stmt2->execute([$userId, $origin, $destination]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Datu bāzes kļūda']);
}
