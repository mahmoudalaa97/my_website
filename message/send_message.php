<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $message = $_POST['message'];

  // Get the name if provided
  $name = isset($_POST['name']) ? $_POST['name'] : '';

  // Replace 'mahmoudadmob@gmail.com' with your actual email address
  $to = 'mahmoudadmob@gmail.com';
  $subject = 'New Message';
  $headers = "From: Your Website <noreply@message.mahmoudalaa.com>\r\n";
  $headers .= "Reply-To: $to\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

  // Create the final message to send
  $finalMessage = "Name: $name\n\n";
  $finalMessage .= "Message:\n$message";

  if (mail($to, $subject, $finalMessage, $headers)) {
    echo '<script>alert("Message sent successfully!"); window.location.href = "index.html";</script>';
    exit;
  } else {
    echo '<script>alert("Oops! An error occurred while sending the message."); window.location.href = "index.html";</script>';
    exit;
  }
}
?>