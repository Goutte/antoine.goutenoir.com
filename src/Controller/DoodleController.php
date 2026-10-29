<?php

namespace App\Controller;

use App\Domain\Doodle;
use App\Service\DoodleRepository;
use App\Service\MailSender;
use App\Service\RandomStringGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

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
        RandomStringGenerator $rsg,
    ): Response {

        $expectedCaptcha = "blanc"; // so far so good
        $providedCaptcha = $request->get("captcha", "");
        if (mb_strtolower($providedCaptcha) != $expectedCaptcha) {
            throw $this->createAccessDeniedException("Sorry…  You failed.");
        }

        $doodle = Doodle::fromRequest($request, $rsg);

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
    ): Response {

        $page = (int) ($request->get("page", 0));
        $count = $doodleRepository->countDoodles();

        return $this->render('drawing/index.html.twig', [
            'doodles' => $doodleRepository->index($page, 16),
            'doodlesCount' => $count,
            'page' => $page,
        ]);
    }

    #[IsGranted('ROLE_ADMIN', message: 'You are not allowed to access the admin dashboard.')]
    #[Route(path: '/doodles/{id}', name: 'app_doodles_delete', methods: ['delete'])]
    // We are also providing an alternative to the DELETE method because HTML forms can't use it.
    #[Route(path: '/doodles/{id}/delete', name: 'app_doodles_delete_post', methods: ['post'])]
    public function delete(
        string $id,
        DoodleRepository $doodleRepository,
    ): Response {
        $id = Doodle::sanitizeId($id);
        if (empty($id)) {
            return new Response("Invalid doodle id.");
        }
        $doodleRepository->deleteDoodle($id);
        return new Response("Deleted $id.");
    }
}
