<?php


namespace Goutte\DoodleBundle\Tools\PHPUnit;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase as SymfonyFrameworkWebTestCase;

class WebTestCase extends SymfonyFrameworkWebTestCase
{
    /**
     * Dumbed-down version, of parent()
     *
     * @static
     * @return null|string
     * @throws \RuntimeException
     */
    static protected function getPhpUnitXmlDir()
    {
        $dir = null;
        if ($dir === null &&
            (file_exists(getcwd().DIRECTORY_SEPARATOR.'phpunit.xml') ||
            file_exists(getcwd().DIRECTORY_SEPARATOR.'phpunit.xml.dist'))) {
            $dir = getcwd();
        }

        // Can't continue
        if ($dir === null) {
            throw new \RuntimeException('Unable to guess the Kernel directory.');
        }

        if (!is_dir($dir)) {
            $dir = dirname($dir);
        }

        return $dir;
    }

}
