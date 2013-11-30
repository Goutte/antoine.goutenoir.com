<?php

namespace Goutte\DoodleBundle\Controller;

use Goutte\DoodleBundle\Entity\Doodle;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AjaxController extends BaseController
{

    const MAX_DOODLES_PER_USER = 42;

    /**
     * Saves the image dataURL passed in POST variable $dataURL
     * Checks if the user has not saved already MAX_DOODLES_PER_USER images, using the IP.
     *
     * @Route("/doodle/save")
     * @Method({"POST"})
     *
     * @throws NotFoundHttpException
     * @return Response
     */
    public function saveAction()
    {
        $request = $this->get('request');
        $dataURL = $request->get('dataURL');

        if (strpos($dataURL, 'data:image/png;base64') !== 0) {
            throw new NotFoundHttpException("Data does not validate.");
        }

        $ip = $request->getClientIp();

        $em = $this->getEm();

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
        $doodle = new Doodle();
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
     * @Method({"POST"})
     *
     * @param $id
     * @throws NotFoundHttpException
     * @return Response
     */
    public function sendAction($id)
    {
        $request = $this->get('request');

        /** @var $em \Doctrine\ORM\EntityManager */
        $em = $this->get('doctrine')->getEntityManager();

        $doodle = $em->getRepository('Goutte\DoodleBundle\Entity\Doodle')->findOneBy(array('id' => $id));

        // Do we have a doodle ?
        if (!$doodle) {
            throw new NotFoundHttpException('No doodle for this id.');
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


}
