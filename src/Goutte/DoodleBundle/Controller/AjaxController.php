<?php

namespace Goutte\DoodleBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AjaxController extends Controller
{
    /**
     * Saves the image dataURL passed in POST variable $dataURL
     * Checks if the user has not saved already 42 images
     *
     * @Route("/save")
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     * @return array
     */
    public function saveAction()
    {
        $request = $this->get('request');

        if ($request->getMethod() != 'POST') {
            throw new NotFoundHttpException("Save is POST only.");
        }

        $dataURL = $request->get('dataURL');

        if (strpos($dataURL, 'data:image/png;base64') !== 0) {
            throw new NotFoundHttpException("Data does not validate.");
        }

        $ip = $request->getClientIp();

        /** @var $em \Doctrine\ORM\EntityManager */
        $em = $this->get('doctrine')->getEntityManager();

        // Check if ip has not already saved too much images
        $doodles = $em->getRepository('Goutte\DoodleBundle\Entity\Doodle')->findBy(array('created_by' => $ip));
        if (count($doodles) > 41) {
            $json = array(
                'status' => 'error',
                'error'  => "You already saved 42 doodles, which is the limit ! Your enthusiasm is inspiring ; please contact me if you want more !"
            );
            return $this->createJsonResponse($json);
        }

        // Save the doodle
        $doodle = new \Goutte\DoodleBundle\Entity\Doodle();
        $doodle->setCreatedBy($ip);
        $doodle->setCreatedAt();
        $doodle->setData($dataURL);

        $em->persist($doodle);
        $em->flush();

        $json = array(
            'status' => 'ok',
            'id'     => $doodle->getId(),
            'count'  => count($doodles),
        );

        return $this->createJsonResponse($json);
    }

    public function createJsonResponse ($json) {
        $response = new Response();
        $response->setContent(json_encode($json));
        $response->setStatusCode(200);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
