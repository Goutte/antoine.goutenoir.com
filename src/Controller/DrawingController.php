<?php

namespace App\Controller;

use App\Service\MailSender;
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
        $props = [
            ['name' => 'who', 'maxLength' => 8000],
            ['name' => 'what', 'maxLength' => 8000],
            ['name' => 'doodle', 'maxLength' => 80000],
        ];

        $data = [];
        foreach ($props as $p) {
            $name = $p['name'];
            $data[$name] = $request->get($name, '');
            $data[$name] = htmlentities($data[$name]);
            $data[$name] = mb_substr($data[$name], 0, min($p['maxLength'], mb_strlen($data[$name])));
        }

        $now = (new \DateTime())->format("Y-m-d_H:i:s");
        $filename =  "../var/".$now.".yaml";
        $serialized = Yaml::dump($data);
        file_put_contents($filename, $serialized);

        $emailBody = <<<EMAIL_BODY
<strong>WHO</strong>
<p>
{$data['who']}
</p>

<strong>WHAT</strong>
<p>
{$data['what']}
</p>

<hr />

<img src="cid:doodle" alt="A Doodle" width="600px" />
EMAIL_BODY;

        $wasMailSent = $mailer->perhapsSend("New Doodle !", $emailBody, $data['doodle']);

        return $this->render('drawing/created.html.twig', [
            'doodle' => $data,
            'wasMailSent' => $wasMailSent,
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
