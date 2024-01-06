<?php

// Records claps and shows how many there are.
// Prints a single integer.  JSON-compliant, probably.
// Fast home brew, use with caution.  Felt good to write a PHP *script* for once.
//
// - GET /claps.php
//   Returns the amount of claps.
// - POST /claps.php
//   Increases the amount of claps by one and returns the new amount of claps.
//

// Path is usually relative to this file, but may not be.  Depends on config.
$clapsAmountFilepath = "./var/CLAPS";

$claps = file_get_contents($clapsAmountFilepath);
if (false === $claps) {
    $claps = "41";
}

$claps = trim($claps);
$claps = (int) $claps;

if ('POST' === $_SERVER['REQUEST_METHOD']) {
    $claps = $claps + 1;
    $written = file_put_contents($clapsAmountFilepath, $claps);
    if (false === $written) {
        print("43");
        trigger_error("Cannot write claps file `$clapsAmountFilepath'.", E_USER_ERROR);
        die();
    }
}

print($claps);
