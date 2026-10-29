<?php

namespace App\Domain;

use App\Service\RandomStringGenerator;
use DateTime;
use Symfony\Component\HttpFoundation\Request;

class Doodle
{
    const IMAGE_FORMAT = "image/png";
    const IMAGE_ENCODING = "base64";

    private string $id = ""; // 2026-10-29
    private ?DateTime $when = null;
    private string $who = "";
    private string $what = "";
    private string $doodle = "";
    private string $ip = "";

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getWhen(): ?DateTime
    {
        return $this->when;
    }

    public function setWhen(?DateTime $when): static
    {
        $this->when = $when;

        return $this;
    }

    public function getWho(): string
    {
        return $this->who;
    }

    public function setWho(string $who): static
    {
        $this->who = $who;

        return $this;
    }

    public function getWhat(): string
    {
        return $this->what;
    }

    public function setWhat(string $what): static
    {
        $this->what = $what;

        return $this;
    }

    public function getDoodle(): string
    {
        return $this->doodle;
    }

    public function setDoodle(string $doodle): static
    {
        $this->doodle = $doodle;

        return $this;
    }

    public function getIp(): string
    {
        return $this->ip;
    }

    public function setIp(string $ip): static
    {
        $this->ip = $ip;

        return $this;
    }

    public function getBlob(): string
    {
        $blob = substr($this->doodle, strlen(
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

    public function normalize(): array
    {
        return [
            'id' => $this->getId(),
            'who' => $this->getWho(),
            'what' => $this->getWhat(),
            'when' => $this->getWhen()->format(DATE_W3C),
            'ip' => $this->getIp(),
            'doodle' => $this->getDoodle(),
        ];
    }

    public function denormalize($data): static
    {
        $when = DateTime::createFromFormat(DATE_W3C, $data['when'] ?? '');
        return $this
            ->setId($data['id'] ?? '')
            ->setWho($data['who'] ?? '')
            ->setWhat($data['what'] ?? '')
            ->setWhen($when !== false ? $when : null)
            ->setIp($data['ip'] ?? '')
            ->setDoodle($data['doodle'] ?? '')
            ;
    }

    static public function fromRequest(
        Request $request,
        RandomStringGenerator $rsg,
    ): self
    {
        // Absolutely disgusting pantomime of the Validator Component
        $props = [
            ['name' => 'who', 'maxLength' => 8000],
            ['name' => 'what', 'maxLength' => 8000],
            ['name' => 'doodle', 'maxLength' => 800000],
        ];
        $doodle = new self();
        foreach ($props as $p) {
            $name = $p['name'];
            $doodle->$name = $request->get($name, '');
            $doodle->$name = htmlentities($doodle->$name);
            $doodle->$name = mb_substr($doodle->$name, 0, min($p['maxLength'], mb_strlen($doodle->$name)));
        }

        $doodle->when = new DateTime();

        $doodle->ip = $request->getClientIp() ?? "";

        // A very sorry workaround — use TRUSTED_PROXIES instead, Symfony will handle it
        if ("172.21." === substr($doodle->ip, 0, 7)) {
            $doodle->ip = $request->headers->get("X-REAL-IP", $doodle->ip);
        }

        $doodle->id = (
            $doodle->when->format("Y-m-d_H:i:s") .
            '_' .
            $rsg->generate(4)
        );

        return $doodle;
    }

    static function sanitizeId(string $id): string {
        // Rule: Doodle identifier MUST be a safe filename
        return preg_replace("/[^a-zA-Z0-9:_-]+/", "", $id);
    }
}
