<?php

  if($_POST){
    $email = $_POST['email'];
    $message = $_POST['message'];

    $to = "nuno@nunocoelhosantos.com";
    $subject = "New Availability Request";
    $message = $message;
    $headers = "From: $email";

    mail($to, $subject, $message, $headers);
  }

?>
