<?php
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("Content-Security-Policy: default-src 'self'; script-src 'none';");
header('Content-Type: application/json');

$name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
$message = filter_input(INPUT_POST, "message", FILTER_SANITIZE_STRING);

$EmailTo = "info@mahmoudalaa.com";
$Subject = "Portfolio CV/Resume";

$Body = "Name: $name\nEmail: $email\nMessage: $message\n";

$headers = "From: noreply@mahmoudalaa.com\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

$success = mail($EmailTo, $Subject, $Body, $headers);

if ($success) {
    echo json_encode(["status" => "success"]);
} else {
    error_log("Mail failed to send to $EmailTo");
    echo json_encode(["status" => "error"]);
}
?>