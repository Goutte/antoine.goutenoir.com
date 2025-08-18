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

        // Quick and dirty sanitization, but better than nothing
        if (strpos($dataURL, 'data:image/png;base64') !== 0) {
            throw new NotFoundHttpException("Data does not validate.");
        }

        // Grab some information about the client
        $ip = $request->getClientIp();

        // Check if ip has not already saved too much images
        $doodles = $this->doodles()->findBy(array('created_by' => $ip));
        if (count($doodles) >= self::MAX_DOODLES_PER_USER) {
            $data = array(
                'status' => 'error',
                'error' => "You already saved ".self::MAX_DOODLES_PER_USER." doodles, which is the limit !\n ".
                           "Your enthusiasm is inspiring ; please contact me if you want more !\n ".
                           "-- antoine@goutenoir.com"
            );
            return $this->createJsonResponse($data);
        }

        // Save the doodle
        $doodle = new Doodle();
        $doodle->setCreatedBy($ip);
        $doodle->setCreatedAt();
        $doodle->setData($dataURL);

        $em = $this->getEM();
        $em->persist($doodle);
        $em->flush();

        // Send me an email
        $this->sendDoodleImageByEmail($doodle);

        // Build the JSON Response
        $data = array(
            'status' => 'ok',
            'id' => $doodle->getId(),
            'saves' => count($doodles),
        );

        return $this->createJsonResponse($data);
    }


    /**
     * Marks the doodle as important.
     * The sender ip must be the same as the doodle creator ip.
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

        $doodle = $this->doodles()->findOneBy(array('id' => $id));

        // Do we have a doodle ?
        if (!$doodle) {
            throw new NotFoundHttpException('No doodle for this id.');
        }

        // Do we have the same IP ?
        if ($doodle->getCreatedBy() != $request->getClientIp()) {
            $data = array(
                'status' => 'error',
                'error'  => 'Your IP may have changed since you saved the doodle.',
            );

            return $this->createJsonResponse($data);
        }

        // Edit the doodle
        $doodle->setImportant(true);
        $doodle->setTitle($request->get('title', ''));
        $doodle->setMessage($request->get('message', ''));

        $em = $this->getEM();
        $em->persist($doodle);
        $em->flush();

        // Send me an email
        $this->sendDoodleMessageByEmail($doodle);

        // Build the JSON Response
        $data = array(
            'status' => 'ok',
        );

        return $this->createJsonResponse($data);
    }


    /**
     * Deletes the doodle
     *
     * @Route("/doodle/erase/{id}", requirements={"id" = "\d+"}, name="doodle_erase")
     * @Method({"POST"})
     *
     * DELETE method is not working in prod, don't know why ?!
     *
     * @param $id
     * @throws NotFoundHttpException
     * @return Response
     */
    public function eraseAction($id)
    {
        // Get the doodle
        $doodle = $this->doodles()->findOneBy(array('id' => $id));
        if (!$doodle) {
            throw new NotFoundHttpException('No doodle for this id.');
        }

        // Delete the doodle
        $em = $this->getEm();
        $em->remove($doodle);
        $em->flush();

        // Build the JSON Response
        $data = array(
            'status' => 'ok',
        );

        return $this->createJsonResponse($data);
    }


}
