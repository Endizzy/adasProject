<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM orders ORDER BY id DESC");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($orders);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch orders']);
}

