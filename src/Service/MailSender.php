<?php

namespace App\Service;

use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Part\DataPart;

class MailSender
{
    const IMAGE_FORMAT = "image/png";
    const IMAGE_ENCODING = "base64";

    private MailerInterface $mailer;
    private string $emailSender;
    private string $emailRecipient;

    public function __construct(
        MailerInterface $mailer,
        string $emailSender,
        string $emailRecipient,
    )
    {
        $this->mailer = $mailer;
        $this->emailSender = $emailSender;
        $this->emailRecipient = $emailRecipient;
    }

    public function getBlob($data): string
    {
        $blob = substr($data, strlen(
            "data:" .
            self::IMAGE_FORMAT .
            ";" .
            self::IMAGE_ENCODING .
            ","
        ));
        $decoded = base64_decode($blob);
        if ($decoded === false) {
            return "";
        }
        return $decoded;
    }

    public function perhapsSend($subject, $contentHtml, $imageData): bool
    {
        $imageBlob = $this->getBlob($imageData);
        $email = (new Email())
            ->from($this->emailSender)
            ->to($this->emailRecipient)
            //->cc('cc@example.com')
            //->bcc('bcc@example.com')
            //->replyTo('fabien@example.com')
            //->priority(Email::PRIORITY_HIGH)
            ->subject($subject)
            ->addPart((new DataPart(
                $imageBlob,
                "doodle",
                self::IMAGE_FORMAT,
                self::IMAGE_ENCODING
            ))->asInline())
            ->html($contentHtml);

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            return false;
        }

        return true;
    }
}
