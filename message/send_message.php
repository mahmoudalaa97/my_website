<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $message = $_POST['message'];

  // Record all characters written and deleted
  $writtenChars = $_POST['message'];
  $deletedChars = $_POST['deleted_chars'];

  // Replace 'mahmoudadmob@gmail.com' with your actual email address
  $to = 'mahmoudadmob@gmail.com';
  $subject = 'New Message';
  $headers = "From: Your Website <noreply@message.mahmoudalaa.com>\r\n";
  $headers .= "Reply-To: $to\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

  // Create the final message to send
  $finalMessage = "Written characters: $writtenChars\n\n";
  $finalMessage .= "Deleted characters: $deletedChars\n\n";
  $finalMessage .= "Message:\n$message";

  if (mail($to, $subject, $finalMessage, $headers)) {
    echo 'Message sent successfully!';
  } else {
    echo 'Oops! An error occurred while sending the message.';
  }
}
?>