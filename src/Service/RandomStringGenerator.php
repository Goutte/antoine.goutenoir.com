<?php

namespace App\Service;

use Random\RandomException;

use function assert;
use function mb_strlen;
use function random_int;

class RandomStringGenerator
{
    const LOWER_ALPHANUMERIC_UNAMBIGUOUS = '23456789abcdefghijkmnpqrstuvwxyz';

    /**
     * @throws RandomException
     */
    public function generate(
        int $length,
        string $characters = self::LOWER_ALPHANUMERIC_UNAMBIGUOUS,
    ): string {
        assert($length >= 0);
        $maxIndex = mb_strlen($characters) - 1;
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $index = random_int(0, $maxIndex);
            $randomString .= $characters[$index];
        }

        return $randomString;
    }
}