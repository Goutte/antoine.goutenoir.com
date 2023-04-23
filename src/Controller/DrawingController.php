<?php

namespace App\Controller;

use App\Service\MailSender;
use Doodle;
use League\Flysystem\Filesystem;
use League\Flysystem\Local\LocalFilesystemAdapter;
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
    public function create(Request $request, MailSender $mailer): Response
    {
        // TODO: come on, just use the Form and Validator components
        $doodle = Doodle::fromRequest($request);

        // TODO: refactor as flat-file DoodleRepository service, using the amazing Flysystem
        $adapter = new LocalFilesystemAdapter("../var/doodle");
        $filesystem = new Filesystem($adapter);
        $now = (new \DateTime())->format("Y-m-d_H:i:s");
        $filenameYaml = $now . ".yaml";
        $filenamePng = $now . ".png";
        $serialized = Yaml::dump($doodle->serialize());
        $filesystem->write($filenameYaml, $serialized);
        $filesystem->write($filenamePng, $doodle->getBlob());

        $wasMailSent = $mailer->perhapsSendDoodle($doodle);

        return $this->render('drawing/created.html.twig', [
            'doodle' => $doodle,
            'wasMailSent' => $wasMailSent,
        ]);
    }

    #[Route(path: '/drawings', name: 'app_drawing_index', methods: ['get'])]
    public function index(): Response
    {
        // TODO: index doodles
        return $this->render('drawing/index.html.twig', [
            'controller_name' => 'DrawingController',
        ]);
    }
}
