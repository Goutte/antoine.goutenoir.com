<?php

namespace Goutte\DoodleBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    public function testIndex()
    {

//        rm -rf app/cache/*
//        rm -rf app/logs/*
//
//        sudo chmod +a "www-data allow delete,write,append,file_inherit,directory_inherit" app/cache app/logs
//        sudo chmod +a "`whoami` allow delete,write,append,file_inherit,directory_inherit" app/cache app/logs

        $cleanup = array(
            "php console cache:clear -e dev",
            "php console cache:clear -e prod",
        );


        // Doodle on me page
        $client = static::createClient();
        $client->request('GET', '/');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }
}
