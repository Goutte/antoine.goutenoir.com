<?php

namespace Goutte\DoodleBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class DefaultController extends Controller
{
    /**
     * Main page, shows the doodling area
     *
     * @Route("/")
     * @Template("GoutteDoodleBundle:Default:doodle.html.twig")
     *
     * @return array
     */
    public function indexAction()
    {
        return array();
    }


    /**
     * View the doodle as <img>
     * Provide the name of the route for twig paths
     *
     * @Route("/doodle/view/{id}", requirements={"id" = "\d+"}, name="doodle_view")
     * @Template()
     *
     * @param $id
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     * @return array
     */
    public function viewAction($id)
    {
        $doodle = $this->findOneDoodleById($id);

        // Do we have a doodle ?
        if (!$doodle) {
            throw new NotFoundHttpException("No doodle for the id '{$id}'");
        }

        return array('doodle' => $doodle);
    }

    /**
     * Proposes the doodle as content-attachment
     *
     * @Route("/doodle/download/{id}", requirements={"id" = "\d+"})
     *
     * @param $id
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     * @return array
     */
    public function downloadAction($id)
    {
        $doodle = $this->findOneDoodleById($id);

        // Do we have a doodle ?
        if (!$doodle) {
            throw new NotFoundHttpException("No doodle for the id '{$id}'");
        }

        // Grab the MIME type and the data with a regex for convenience
        if (!preg_match('#data:([^;]*);base64,(.*)#', $doodle->getData(), $matches)) {
            throw new HttpException("Data in database is corrupted for doodle id '{$id}'");
        }

        // Decode the data
        $content = base64_decode($matches[2]);

        $response = new Response();
        $response->setContent($content);
        $response->setStatusCode(200);
        $response->headers->set('Content-Type', $matches[1]);
        $response->headers->set('Content-Disposition', 'attachment; filename="doodle'.$id.'.png"');

        return $response;
    }

    public function findOneDoodleById($id) {
        /** @var $em \Doctrine\ORM\EntityManager */
        $em = $this->get('doctrine')->getEntityManager();
        return $em->getRepository('Goutte\DoodleBundle\Entity\Doodle')->findOneBy(array('id' => $id));
    }


    /**
     * List the important doodles
     *
     * @Route("/doodles")
     * @Template()
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     * @internal param $id
     * @return array
     */
    public function listImportantAction()
    {

        /** @var $em \Doctrine\ORM\EntityManager */
        $em = $this->get('doctrine')->getEntityManager();

        $doodles = $em->getRepository('Goutte\DoodleBundle\Entity\Doodle')->findBy(array('important' => true), array('id'=>'desc'));

        // Do we have at least one doodle ?
        if (empty($doodles)) {
            throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException('No doodles at all');
        }

        return array('doodles' => $doodles);
    }


    /**
     * List all the doodles
     *
     * @Route("/doodles/all")
     * @Template()
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     * @internal param $id
     * @return array
     */
    public function listAllAction()
    {
        /** @var $em \Doctrine\ORM\EntityManager */
        $em = $this->get('doctrine')->getEntityManager();

        $doodles = $em->getRepository('Goutte\DoodleBundle\Entity\Doodle')->findBy(array(), array('id'=>'desc'));

        // Do we have at least one doodle ?
        if (empty($doodles)) {
            throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException('No doodles at all');
        }

        return array('doodles' => $doodles);
    }

}
