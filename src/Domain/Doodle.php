<?php

namespace App\Domain;

use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Polyfill\Intl\Icu\Exception\NotImplementedException;

class Doodle implements \Serializable
{
    const IMAGE_FORMAT = "image/png";
    const IMAGE_ENCODING = "base64";

    private string $who = "";
    private string $what = "";
    private string $doodle = "";
    private string $ip = "";

    public function getWho(): string
    {
        return $this->who;
    }

    public function setWho(string $who): void
    {
        $this->who = $who;
    }

    public function getWhat(): string
    {
        return $this->what;
    }

    public function setWhat(string $what): void
    {
        $this->what = $what;
    }

    public function getDoodle(): string
    {
        return $this->doodle;
    }

    public function setDoodle(string $doodle): void
    {
        $this->doodle = $doodle;
    }

    public function getIp(): string
    {
        return $this->ip;
    }

    public function setIp(string $ip): void
    {
        $this->ip = $ip;
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

    static public function fromRequest(Request $request): self
    {
        $props = [
            ['name' => 'who', 'maxLength' => 8000],
            ['name' => 'what', 'maxLength' => 8000],
            ['name' => 'doodle', 'maxLength' => 800000],
        ];
        $data = new self();
        foreach ($props as $p) {
            $name = $p['name'];
            $data->$name = $request->get($name, '');
            $data->$name = htmlentities($data->$name);
            $data->$name = mb_substr($data->$name, 0, min($p['maxLength'], mb_strlen($data->$name)));
        }

        $data->ip = $request->getClientIp() ?? "";
        if ("172.21." === substr($data->ip, 0, 7)) {
            $data->ip = $request->headers->get("X-REAL-IP", $data->ip);
        }

        return $data;
    }

    public function __serialize()
    {
        return [
            'who' => $this->getWho(),
            'what' => $this->getWhat(),
            'ip' => $this->getIp(),
            'doodle' => $this->getDoodle(),
        ];
    }

    public function __unserialize($data)
    {
        throw new NotImplementedException("no need for now");
    }

    public function serialize()
    {
        return $this->__serialize();
    }

    public function unserialize($data)
    {
        $this->__unserialize($data);
    }
}