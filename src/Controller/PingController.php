<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PingController extends AbstractController
{
    // Purpose: respond to docker's healthcheck
    #[Route(path: '/ping', name: 'app_ping')]
    public function ping(): Response
    {
        return new Response("pong");
    }
}
