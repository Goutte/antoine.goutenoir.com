<?php

namespace Goutte\DoodleBundle\Controller;

use Goutte\DoodleBundle\Entity\Doodle;
use Goutte\DoodleBundle\Tools\PHPMailer\PHPMailer;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

abstract class BaseController extends Controller
{
    /**
     * Returns the Entity Manager
     * @return \Doctrine\ORM\EntityManager
     */
    protected function getEm()
    {
        return $this->get('doctrine')->getEntityManager();
    }

    /**
     * Util for easy json Response creation (old sf2 version)
     * @param $json
     * @return Response
     */
    public function createJsonResponse($json)
    {
        $response = new Response();
        $response->setContent(json_encode($json));
        $response->setStatusCode(200);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function sendDoodleImageByEmail($doodle)
    {
        $subject = "Nouveau Doodle sur antoine.goutenoir.com";
        $content = <<<EOF

<a href="http://antoine.goutenoir.com/contact/doodle/view/{{ doodle_id }}">
    View Doodle #{{ doodle_id }}
</a>

<p>
Author : {{ doodle_ip }}
</p>

EOF;

        $id = $doodle->getId();
        $content = str_replace('{{ doodle_id }}', $id, $content);
        $content = str_replace('{{ doodle_ip }}', $doodle->getCreatedBy(), $content);

        $mail = $this->createNewMail($subject, $content);
        $mail->addStringEmbeddedImage($doodle->getBlob(),"cid.doodle.{$id}","doodle{$id}.png",'base64','image/png');

        $success = true;
        if (!$mail->send()) {
            $success = false;
        }

        return $success;
    }

    public function sendDoodleMessageByEmail($doodle)
    {

        $subject = "Nouveau Message sur antoine.goutenoir.com";
        $content = <<<EOF

<a href="http://antoine.goutenoir.com/contact/doodle/view/{{ doodle_id }}">
    View Doodle #{{ doodle_id }}
</a>

<p>
Author : {{ doodle_ip }}
</p>

<p>
{{ doodle_msg }}
</p>

EOF;

        $content = str_replace('{{ doodle_id }}', $doodle->getId(), $content);
        $content = str_replace('{{ doodle_ip }}', $doodle->getCreatedBy(), $content);
        $content = str_replace('{{ doodle_msg }}', $this->safeForEmail($doodle->getMessage()), $content);

        $mail = $this->createNewMail($subject, $content);

        $success = true;
        if (!$mail->send()) {
            $success = false;
        }

        return $success;
    }

    /**
     * Handy Helper to create a Mail ready to be sent (to me !)
     *
     * @param $subject
     * @param $content
     * @return PHPMailer
     */
    public function createNewMail($subject, $content)
    {
        $to = array(
            'antoine.goutenoir@gmail.com' => 'Antoine Goutenoir',
        );

        $mail = new PHPMailer(true);

        $mail->isSMTP();

        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 587;
        $mail->SMTPSecure = 'tls';
        $mail->SMTPAuth = true;
        $mail->Username = "gouttemailer@gmail.com";
        $mail->Password = "/~k)*Y2i=)Wg&}^(*o_z0"; // T_T

        $mail->setFrom('gouttemailer@gmail.com', 'GoutteMailer');

        foreach ($to as $email => $name) {
            $mail->addAddress($email, $name);
        }

        $mail->Subject = $subject;
        $mail->Body    = $content;
        $mail->AltBody = $content;

        return $mail;
    }

    protected function safeForEmail($text)
    {
        return nl2br(htmlentities($text, ENT_COMPAT, 'UTF-8'));
    }
}