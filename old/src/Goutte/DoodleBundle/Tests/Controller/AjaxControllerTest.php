<?php

namespace Goutte\DoodleBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AjaxControllerTest extends WebTestCase
{

    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private $em;

    public function setUp()
    {
        $kernel = static::createKernel();
        $kernel->boot();
        $this->em = $kernel->getContainer()->get('doctrine.orm.entity_manager');
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * @return int The id of the saved doodle
     */
    public function testSave()
    {
        // test the save of a new doodle, providing the encoded data

        $client = static::createClient();
        $client->request('POST', '/doodle/save', array('dataURL'=>$this->getTestDoodleData()));
        $response = $client->getResponse();

        $this->assertTrue($response->isSuccessful(), sprintf("On save, server returns %d",$response->getStatusCode()));
        $content = json_decode($response->getContent());
        $validated = ('ok' == $content->status);
        $this->assertTrue($validated, sprintf("Saving a new doodle via dataURL, wrong status = %s",$content->status));
        $doodleId = $content->id;
        $this->assertInternalType('int', $doodleId);

        return $doodleId;
    }



    /**
     * test the send of a new doodle, providing doodle id
     *
     * @depends testSave
     * @param $doodleId
     */
    public function testSend($doodleId)
    {
        $client = static::createClient();
        $client->request('POST', sprintf('/doodle/send/%d', $doodleId), array());
        $response = $client->getResponse();

        $this->assertTrue($response->isSuccessful(), sprintf("On send, server returns %d",$response->getStatusCode()));
        $content = json_decode($response->getContent());
        $validated = ('ok' == $content->status);
        $this->assertTrue($validated, sprintf("Sending a doodle, wrong status = %s",$content->status));
    }



    /**
     * test the send of a new doodle, along with a message, providing doodle id
     *
     * @depends testSave
     * @param $doodleId
     */
    public function testSendWithMessage($doodleId)
    {
        $message = 'Lone Star';

        $client = static::createClient();
        $client->request('POST', sprintf('/doodle/send/%d', $doodleId), array('message'=>$message));
        $response = $client->getResponse();

        $this->assertTrue($response->isSuccessful(), sprintf("On send with message, server returns %d",$response->getStatusCode()));
        $content = json_decode($response->getContent());
        $validated = ('ok' == $content->status);
        $this->assertTrue($validated, sprintf("Sending a doodle with a message, wrong status = %s",$content->status));

        // check the message has been saved
        $doodle = $this->em->getRepository('Goutte\DoodleBundle\Entity\Doodle')->findOneById($doodleId);
        $this->assertNotEmpty($doodle, "Could not find freshly saved doodle.");
        $this->assertEquals($message, $doodle->getMessage(), "Message was not saved");
    }



    /**
     * test the view of a new doodle, providing the doodle id
     *
     * @depends testSave
     * @param $doodleId
     */
    public function testView($doodleId)
    {
        $client = static::createClient();
        $client->request('GET', sprintf('/doodle/view/%d', $doodleId), array());
        $response = $client->getResponse();

        $this->assertTrue($response->isSuccessful(), sprintf("On view, server returns %d",$response->getStatusCode()));
        //var_dump($response->getContent());
    }



    /**
     * test the download of a new doodle, providing the doodle id
     *
     * @depends testSave
     * @param $doodleId
     */
    public function testDownload($doodleId)
    {
        $client = static::createClient();
        $client->request('GET', sprintf('/doodle/download/%d', $doodleId), array());
        $response = $client->getResponse();

        $this->assertTrue($response->isSuccessful(), sprintf("On download, server returns %d",$response->getStatusCode()));
    }



    /**
     * test the listing of important doodles
     *
     * @depends testSave
     * @param $doodleId
     */
    public function testList($doodleId)
    {
        $client = static::createClient();
        $client->request('GET', '/doodles', array());
        $response = $client->getResponse();

        $this->assertTrue($response->isSuccessful(), sprintf("On list, server returns %d",$response->getStatusCode()));
    }


    /**
     * test the listing of all doodles
     *
     * @depends testSave
     * @param $doodleId
     */
    public function testListAll($doodleId)
    {
        $client = static::createClient();
        $client->request('GET', '/doodles/all', array());
        $response = $client->getResponse();

        $this->assertTrue($response->isSuccessful(), sprintf("On list all, server returns %d",$response->getStatusCode()));
    }



    /**
     * FINALLY, test the deletion of the saved doodle
     * @depends testSave
     * @param $doodleId
     */
    public function testDelete($doodleId)
    {
        $doodle = $this->em->getRepository('Goutte\DoodleBundle\Entity\Doodle')->findOneById($doodleId);

        $this->assertNotEmpty($doodle, "Could not find freshly saved doodle.");
        $this->em->remove($doodle);
        $this->em->flush();
        $nothing = $this->em->getRepository('Goutte\DoodleBundle\Entity\Doodle')->findOneById($doodleId);
        $this->assertEmpty($nothing, "[WARNING] Could not delete freshly created doodle.");
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected function getTestDoodleData()
    {
        return "data:image/png;base64,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";
    }


    //// RANDOM STUFF //////////////////////////////////////////////////////////////////////////////////////////////////


    public function testReflectionClassCannotGetType ()
    {
        $a = new Adam();
        $r = new \ReflectionClass($a);

        $m = $r->getMethod('__constructMe');
        $p = $m->getParameters();

        $my = $r->getMethod('__constructYou');
        $py = $my->getParameters();

        $this->assertEquals($p, $py, "WAOW ! WHEN THIS FAILS I WANT TO HEAR ABOUT IT !"); // passes
    }
}

class Adam {
    public function __constructMe (Adam $sexy) {
        return $sexy;
    }
    public function __constructYou (Eve $sexy) {
        return $sexy;
    }
}
class Eve {}