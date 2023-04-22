<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Yaml\Yaml;

class DrawingController extends AbstractController
{
    #[Route(path: '/', name: 'app_drawing_draw')]
    public function draw(): Response
    {
        return $this->render('drawing/draw.html.twig', [
            'controller_name' => 'DrawingController',
        ]);
    }

    #[Route(path: '/drawings', name: 'app_drawing_create', methods: ['post'])]
    public function create(Request $request): Response
    {
        $props = [
            ['name' => 'who'],
            ['name' => 'what'],
            ['name' => 'doodle'],
        ];

        $data = [];
        foreach ($props as $p) {
            $data[$p['name']] = $request->get($p['name'], '');
        }

        $now = (new \DateTime())->format("Y-m-d_H:i:s");

        $filename =  "../var/".$now.".yaml";
        $serialized = Yaml::dump($data);
        file_put_contents($filename, $serialized);

        return $this->render('drawing/created.html.twig', [
            'controller_name' => 'DrawingController',
        ]);
    }

    #[Route(path: '/drawings', name: 'app_drawing_index', methods: ['get'])]
    public function index(): Response
    {
        return $this->render('drawing/index.html.twig', [
            'controller_name' => 'DrawingController',
        ]);
    }
}
