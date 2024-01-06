<?php

namespace App\Controller;

use App\Domain\Doodle;
use App\Service\DoodleRepository;
use App\Service\MailSender;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DoodleController extends AbstractController
{
    #[Route(path: '/', name: 'app_doodles_draw')]
    public function draw(): Response
    {
        return $this->render('drawing/draw.html.twig', [
            'controller_name' => 'DrawingController',
        ]);
    }

    #[Route(path: '/doodles', name: 'app_doodles_create', methods: ['post'])]
    public function create(
        Request $request,
        MailSender $mailer,
        DoodleRepository $doodleRepository,
    ): Response {
        // TODO: come on, just use the Form and Validator components
        $doodle = Doodle::fromRequest($request);

        $doodleRepository->saveDoodle($doodle);
        $wasMailSent = $mailer->perhapsSendDoodle($doodle);

        return $this->render('drawing/created.html.twig', [
            'doodle' => $doodle,
            'wasMailSent' => $wasMailSent,
        ]);
    }

    #[Route(path: '/doodles', name: 'app_doodles_index', methods: ['get'])]
    public function index(
        DoodleRepository $doodleRepository,
        Request $request,
    ): Response
    {
        $page = (int) ($request->get("page", 0));
        $count = $doodleRepository->countDoodles();

        return $this->render('drawing/index.html.twig', [
            'doodles' => $doodleRepository->index($page, 4),
            'doodlesCount' => $count,
            'page' => $page,
        ]);
    }
}
