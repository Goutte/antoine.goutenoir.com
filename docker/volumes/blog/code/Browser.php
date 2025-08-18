<?php

// your namespace here

/**
 * Browser detection static methods, simple but effective
 *
 * Usage example :
 *
 * if ( Browser::isIpad() ) {
 *   // do some stuff only for iPad
 * }
 *
 * You can use :
 *
 * Browser::isIE()
 * Browser::isIE6()
 * Browser::isIE7()
 * Browser::isIE8()
 * Browser::isIE9()
 * Browser::isChrome()
 * Browser::isFirefox()
 * Browser::isSafari()
 * Browser::isOpera()
 * Browser::isIphone()
 * Browser::isIpad()
 * Browser::isAndroid()
 *
 *
 * Thanks to whoever wrote the original get_browser() function
 * Academic Free Licence
 */

class Browser
{

    private static $known_browsers = array(
        'msie', 'firefox', 'safari',
        'webkit', 'opera', 'netscape',
        'konqueror', 'gecko', 'chrome'
    );

    static public function get_info($agent = null)
    {
        // Clean up agent and build regex that matches phrases for known browsers
        // (e.g. "Firefox/2.0" or "MSIE 6.0" (This only matches the major and minor
        // version numbers.  E.g. "2.0.0.6" is parsed as simply "2.0"
        $agent = strtolower($agent ? $agent : $_SERVER['HTTP_USER_AGENT']);

        // Build up the regex
        $pattern = '#(' . join('|', self::$known_browsers) .
                   ')[/ ]+([0-9]+(?:.[0-9]+)?)#';

        // Find all phrases (or return empty array if none found)
        if (!preg_match_all($pattern, $agent, $matches)) return array();

        // Since some UAs have more than one phrase (e.g Firefox has a Gecko phrase,
        // Opera 7,8 have a MSIE phrase), use the last two found (the right-most one
        // in the UA).  That's usually the most correct.

        $i = count($matches[1]) - 1;
        $r = array($matches[1][$i] => $matches[2][$i]);
        if ($i) $r[$matches[1][$i - 1]] = $matches[2][$i - 1];

        return $r;
    }

    /**
     * Is the user's browser that %#$@! of IE ?
     * @return boolean
     */
    static public function isIE()
    {
        $bi = self::get_info();
        return (!empty($bi['msie']));
    }

    static public function isIE6()
    {
        $bi = self::get_info();
        return (!empty($bi['msie']) && $bi['msie'] == 6.0);
    }

    static public function isIE7()
    {
        $bi = self::get_info();
        return (!empty($bi['msie']) && $bi['msie'] == 7.0);
    }

    static public function isIE8()
    {
        $bi = self::get_info();
        return (!empty($bi['msie']) && $bi['msie'] == 8.0);
    }

    static public function isIE9()
    {
        $bi = self::get_info();
        return (!empty($bi['msie']) && $bi['msie'] == 9.0);
    }

    /**
     * Is the user's browser the shiny Chrome ?
     * @return boolean
     */
    static public function isChrome()
    {
        $bi = self::get_info();
        return (!empty($bi['chrome']));
    }

    /**
     * Is the user's browser da good ol' Firefox ?
     * @return boolean
     */
    static public function isFirefox()
    {
        return (strpos($_SERVER['HTTP_USER_AGENT'], "Firefox") !== false);
    }

    /**
     * Is the user's browser Safari ?
     * @return boolean
     */
    static public function isSafari()
    {
        $bi = self::get_info();
        return (!empty($bi['safari']) && !empty($bi['webkit']));
    }

    /**
     * Is the user's browser the almighty Opera ?
     * @return boolean
     */
    static public function isOpera()
    {
        return (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'opera') !== false);
    }

    /**
     * Is the user's platform iPhone ?
     * @return boolean
     */
    static public function isIphone()
    {
        return (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'iphone') !== false);
    }

    /**
     * Is the user's platform iPad ?
     * @return boolean
     */
    static public function isIpad()
    {
        return (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'ipad') !== false);
    }

    /**
     * Is the user's platform the awesome Android ?
     * @return boolean
     */
    static public function isAndroid()
    {
        return (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'android') !== false);
    }

}
