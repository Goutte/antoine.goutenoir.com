<?php

namespace Goutte\DoodleBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AjaxController extends Controller
{

    const MAX_DOODLES_PER_USER = 42;

    /**
     * Saves the image dataURL passed in POST variable $dataURL
     * Checks if the user has not saved already MAX_DOODLES_PER_USER images
     *
     * @Route("/doodle/save")
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     * @return array
     */
    public function saveAction()
    {
        $request = $this->get('request');

        if ($request->getMethod() != 'POST') { // fixme: move this to routing !
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
        if (count($doodles) >= self::MAX_DOODLES_PER_USER) {
            $json = array(
                'status' => 'error',
                'error' => "You already saved ".self::MAX_DOODLES_PER_USER." doodles, which is the limit !\n ".
                           "Your enthusiasm is inspiring ; please contact me if you want more !\n ".
                           "-- antoine@goutenoir.com"
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
            'id' => $doodle->getId(),
            'saves' => count($doodles),
        );

        return $this->createJsonResponse($json);
    }


    /**
     * Marks the doodle as important
     * The ip must be the same as the creator
     *
     * @Route("/doodle/send/{id}", requirements={"id" = "\d+"})
     *
     * @param $id
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     * @return array
     */
    public function sendAction($id)
    {
        $request = $this->get('request');

        /** @var $em \Doctrine\ORM\EntityManager */
        $em = $this->get('doctrine')->getEntityManager();

        $doodle = $em->getRepository('Goutte\DoodleBundle\Entity\Doodle')->findOneBy(array('id' => $id));

        // Do we have a doodle ?
        if (!$doodle) {
            throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException('No doodle for this id.');
        }

        // Do we have the same IP ?
        if ($doodle->getCreatedBy() != $request->getClientIp()) {
            $json = array(
                'status' => 'error',
                'error'  => 'Your IP may have changed since you saved the doodle.',
            );

            return $this->createJsonResponse($json);
        }

        // Edit the doodle
        $doodle->setImportant(true);
        $doodle->setTitle($request->get('title', ''));
        $doodle->setMessage($request->get('message', ''));

        $em->persist($doodle);
        $em->flush();

        $json = array(
            'status' => 'ok',
        );

        return $this->createJsonResponse($json);
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
