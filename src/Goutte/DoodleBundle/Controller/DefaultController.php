<?php

namespace Goutte\DoodleBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class DefaultController extends Controller
{
    /**
     * Main page, shows the drawing area
     *
     * @Route("/")
     * @Template()
     * @return array
     */
    public function indexAction()
    {
        return array('name' => 'Antoine');
    }

    /**
     * Proposes the doodle as content-attachment
     *
     * @Route("/download/{$id}")
     * @return array
     */
    public function downloadAction()
    {

    }

}
