<?php

namespace App\Service;

use Doodle;
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

    public function perhapsSendDoodle(Doodle $doodle): bool
    {
        $emailSubject = "New Doodle!";
        $emailBody = <<<EMAIL_BODY
<strong>WHO</strong>
<pre>
{$doodle->getWho()}
</pre>

<strong>WHAT</strong>
<pre>
{$doodle->getWhat()}
</pre>

<hr />

<img src="cid:doodle" alt="A Doodle" width="600px" />
EMAIL_BODY;

        $imageBlob = $doodle->getBlob();
        $email = (new Email())
            ->from($this->emailSender)
            ->to($this->emailRecipient)
            //->cc('cc@example.com')
            //->bcc('bcc@example.com')
            //->replyTo('fabien@example.com')
            //->priority(Email::PRIORITY_HIGH)
            ->subject($emailSubject)
            ->addPart((new DataPart(
                $imageBlob,
                "doodle",
                self::IMAGE_FORMAT,
                self::IMAGE_ENCODING
            ))->asInline())
            ->html($emailBody);

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            return false;
        }

        return true;
    }
}
