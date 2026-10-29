<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserController extends AbstractController
{
    #[IsGranted('ROLE_ADMIN', message: 'Please log in.')]
    #[Route(path: '/login', name: 'app_user_login', methods: ['get'])]
    public function login(): Response {
        return new Response("Welcome, handsome.");
    }
}
