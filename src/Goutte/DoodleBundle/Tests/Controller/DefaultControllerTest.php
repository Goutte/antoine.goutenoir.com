<?php

namespace Goutte\DoodleBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    public function testIndex()
    {

//        rm -rf app/cache/*
//        rm -rf app/logs/*

        $cleanup = array(
            "php console cache:clear -e dev",
            "php console cache:clear -e test",
            "php console cache:clear -e prod",
        );


        // "Doodle on me" page
        $client = static::createClient();
        $client->request('GET', '/');
        $this->assertTrue($client->getResponse()->isSuccessful());
    }
}
