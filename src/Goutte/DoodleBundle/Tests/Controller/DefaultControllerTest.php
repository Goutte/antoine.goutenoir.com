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
        $crawler = $client->request('GET', '/');
        $this->assertTrue($client->getResponse()->isSuccessful());

        $this->assertGreaterThanOrEqual(1, count($crawler->filter('canvas')), "No canvas element in the index page");
    }


    // Other default controller tests are in AjaxControllerTest for convenience

}
