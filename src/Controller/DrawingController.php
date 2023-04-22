<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DrawingController extends AbstractController
{
    #[Route(path: '/', name: 'app_drawing_draw')]
    public function draw(): Response
    {
        return $this->render('drawing/draw.html.twig', [
            'controller_name' => 'DrawingController',
        ]);
    }

    #[Route(path: '/drawings', name: 'app_drawing_index')]
    public function index(): Response
    {
        return $this->render('drawing/index.html.twig', [
            'controller_name' => 'DrawingController',
        ]);
    }
}
