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

if (!isset($data['name'], $data['surname'], $data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$name = trim($data['name']);
$surname = trim($data['surname']);
$email = trim($data['email']);
$password = $data['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email format"]);
    exit;
}

try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Email already registered"]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    //$sessionToken = bin2hex(random_bytes(32));

    $stmt = $pdo->prepare("INSERT INTO users (name, surname, email, password, isAdmin) VALUES (?, ?, ?, ?, 0)");
    $stmt->execute([$name, $surname, $email, $hashedPassword]);

    http_response_code(201);
    echo json_encode(["message" => "Registration successful"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error", "details" => $e->getMessage()]);
}
?>
