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

if (!isset($data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];

try {
    $stmt = $pdo->prepare("SELECT id, name, surname, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid email or password"]);
        exit;
    }

    $sessionToken = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("UPDATE users SET session_token = ? WHERE id = ?");
    $stmt->execute([$sessionToken, $user['id']]);

    $stmt2 = $pdo->prepare("SELECT origin, destination FROM user_routes WHERE user_id = ?");
    $stmt2->execute([$user['id']]);
    $route = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "token" => $sessionToken,
        "id" => $user['id'],
        "email" => $user['email'],
        "name" => $user['name'],
        "surname" => $user['surname'],
        "origin" => $route['origin'] ?? null,
        "destination" => $route['destination'] ?? null
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error", "details" => $e->getMessage()]);
}
?>
