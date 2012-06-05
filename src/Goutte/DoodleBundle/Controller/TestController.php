<?php

namespace Goutte\DoodleBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class TestController extends Controller
{
    /**
     * Should run tests in browser
     *
     */
    public function runOLDAction()
    {
        die('Tested.');
        // todo
        //
    }

    public function runAction($filterClass = null)
        {
            // Make sure PHPUnit is autoloaded
            require_once('PHPUnit/Autoload.php');

            set_time_limit(0);
            $version = \PHPUnit_Runner_Version::id();

            $kernel_dir = $this->container->getParameter('kernel.root_dir');
            chdir($kernel_dir);

            // This will force the printer class to be autoloaded by Symfony, before PHPUnit tries to (and does not) find it
            $printerClass = 'Goutte\DoodleBundle\Tools\PHPUnit\HtmlResultPrinter';
            if (!class_exists($printerClass)) {
                $printerClass = false;
            }

            $argv = array();
            if ($filterClass) {
                $argv[] = '--filter';
                $argv[] = $filterClass;
            }

            if (version_compare($version, "3.6.0") >= 0) {

                if ($printerClass) {
                    $argv[] = '--printer';
                    $argv[] = $printerClass;
                }

                $_SERVER['argv'] = $argv;
                \PHPUnit_TextUI_Command::main(true);

            } else {

                ob_end_clean();
                echo '<pre>';

                $_SERVER['argv'] = $argv;
                \PHPUnit_TextUI_Command::main(false);

                echo '</pre>';
                exit;

            }
        }
}
