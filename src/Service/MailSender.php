<?php

namespace App\Service;

use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Part\DataPart;

class MailSender
{
    private \Symfony\Component\Mailer\MailerInterface $mailer;

    public function __construct(\Symfony\Component\Mailer\MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function getBlob($data)
    {
        $blob = substr($data, strlen('data:image/png;base64,'));
        return base64_decode($blob);
    }

    public function perhapsSend($subject, $content, $imageData): bool
    {
        $blob = $this->getBlob($imageData);
        $email = (new Email())
            ->from('postmaster@goutenoir.com')
            ->to('antoine@goutenoir.com')
            //->cc('cc@example.com')
            //->bcc('bcc@example.com')
            //->replyTo('fabien@example.com')
            //->priority(Email::PRIORITY_HIGH)
            ->subject($subject)
            ->addPart((new DataPart(
                $blob,
                "doodle",
                "image/png",
                "base64"
            ))->asInline())
//            ->addPart((new DataPart(
//                $blob,
//                "doodle.png",
//                "image/png",
//                "base64"
//            )))
            //->text('New doodle')
            ->html($content)
        ;

        try {
            $this->mailer->send($email);
        } catch (\Symfony\Component\Mailer\Exception\TransportExceptionInterface $e) {
            return false;
        }

        return true;
    }
}