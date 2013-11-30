<?php

namespace Goutte\DoodleBundle\Controller;

use Goutte\DoodleBundle\Entity\Doodle;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

abstract class BaseController extends Controller
{
    /**
     * Returns the Entity Manager
     * @return \Doctrine\ORM\EntityManager
     */
    protected function getEm()
    {
        return $this->get('doctrine')->getEntityManager();
    }

    /**
     * Util for easy json Response creation (old sf2 version)
     * @param $json
     * @return Response
     */
    public function createJsonResponse($json)
    {
        $response = new Response();
        $response->setContent(json_encode($json));
        $response->setStatusCode(200);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}