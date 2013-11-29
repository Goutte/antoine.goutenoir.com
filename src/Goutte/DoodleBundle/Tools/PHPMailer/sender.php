<?php

/**
 * This is a server-side script that sends an email to the configured addresses
 * It uses Gmail as SMTP server.
 */


$to = array(
    'antoine.goutenoir@gmail.com' => 'Antoine Goutenoir',
//    'info@fantassin.fr' => 'Info Fantassin',
);
$bcc = array(
    'antoine.goutenoir@gmail.com' => 'Antoine Goutenoir',
);

$subject = "Transmission d'un brief via fantassin.fr";
$content = <<<EOF

<h2>Transmission de brief</h2>

<h3>Contact</h3>

Nom/prénom : {{ nom }} <br>
Société : {{ societe }} <br>
Email : {{ email }} <br>
Tél. : {{ telephone }} <br>

<h3>Projet</h3>

Nature : {{ projet_client }} <br>

<p>
{{ description_projet }}
</p>

<h3>Details</h3>

Budget : {{ budget }} <br>
Deadline : {{ deadline }} <br>
Détails : {{ elements_projet }} <br>

EOF;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function get_value($k) {
    if (isset($_POST[$k])) {
        $v = nl2br(htmlentities($_POST[$k], ENT_COMPAT, 'UTF-8'));
    } else {
        $v = '-';
    }
    if ($v == '') $v = '-';
    
    return $v;
}

$subject = preg_replace('#\{\{ *([a-zA-Z0-9_-]+) *\}\}#e', 'get_value($1)', $subject);
$content = preg_replace('#\{\{ *([a-zA-Z0-9_-]+) *\}\}#e', 'get_value($1)', $content);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


require_once 'autoloader.php';

$mail = new PHPMailer(true);

$mail->isSMTP();

//Enable SMTP debugging
//$mail->SMTPDebug = 2;
//$mail->Debugoutput = 'html';

$mail->Host = 'smtp.gmail.com';
$mail->Port = 587;
$mail->SMTPSecure = 'tls';
$mail->SMTPAuth = true;
$mail->Username = "gouttemailer@gmail.com";
$mail->Password = "/~k)*Y2i=)Wg&}^(*o_z0"; // T_T

$mail->setFrom('gouttemailer@gmail.com', 'GoutteMailer');
$mail->addReplyTo(get_value('email'), get_value('nom'));

foreach ($to as $email => $name) {
    $mail->addAddress($email, $name);
}
foreach ($bcc as $email => $name) {
    $mail->addBCC($email, $name);
}

$mail->Subject = $subject;
$mail->Body    = $content;
$mail->AltBody = $content;

$success = true;

if (!$mail->send()) {
    $message = "Votre demande de contact a échoué : ".$mail->ErrorInfo.".";
    $success = false;
}

$message = 'Votre demande de contact a bien été envoyée.';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


echo json_encode(array(
    'success' => $success,
    'message' => $message,
));

