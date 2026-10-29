<?php

// http://php-and-symfony.matthiasnoback.nl/2011/11/phpunit-create-a-resultprinter-for-output-in-the-browser/

namespace Goutte\DoodleBundle\Tools\PHPUnit;

use PHPUnit_TextUI_ResultPrinter;
use PHPUnit_Framework_TestResult;

class HtmlResultPrinter extends PHPUnit_TextUI_ResultPrinter
{
    public function __construct($out = NULL, $verbose = FALSE, $colors = FALSE, $debug = FALSE)
    {
        ob_start(); // start output buffering, so we can send the output to the browser in chunks

        $this->autoFlush = true;

        parent::__construct($out, $verbose, false, $debug);
    }

    public function write($buffer)
    {
        $buffer = nl2br($buffer);

        $buffer = str_pad($buffer, 1024)."\n"; // pad the string, otherwise the browser will do nothing with the flushed output

        if ($this->out) {
            fwrite($this->out, $buffer);

            if ($this->autoFlush) {
                $this->incrementalFlush();
            }
        }
        else {
            print $buffer;

            if ($this->autoFlush) {
                $this->incrementalFlush();
            }
        }
    }

    protected function printFooter(PHPUnit_Framework_TestResult $result)
    {
        parent::printFooter($result);
        if ($result->wasSuccessful() &&
            $result->allCompletlyImplemented() &&
            $result->noneSkipped()) {
            $this->writeNewLine();
            $this->write("<strong style=\"color:#016000;\">YOU, SIR, WIN AN INTERNET!</strong>");
        }
    }

    public function incrementalFlush()
    {
        if ($this->out) {
            fflush($this->out);
        } else {
            ob_flush(); // flush the buffered output
            flush();
        }
    }
}