<?php

namespace Goutte\DoodleBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Goutte\DoodleBundle\Entity\Doodle
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="Goutte\DoodleBundle\Entity\DoodleRepository")
 */
class Doodle
{
    /**
     * @var integer $id
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string $title
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title = '';

    /**
     * @var text $message
     *
     * @ORM\Column(name="message", type="text")
     */
    private $message = '';

    /**
     * @var text $data
     *
     * @ORM\Column(name="data", type="text")
     */
    private $data;

    /**
     * @var datetime $created_at
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $created_at;

    /**
     * @var string $created_by
     *
     * @ORM\Column(name="created_by", type="string", length=255)
     */
    private $created_by;

    /**
     * @var boolean $important
     *
     * @ORM\Column(name="important", type="boolean")
     */
    private $important = false;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set message
     *
     * @param text $message
     */
    public function setMessage($message)
    {
        $this->message = $message;
    }

    /**
     * Get message
     *
     * @return text 
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * Set data
     *
     * @param text $data
     */
    public function setData($data)
    {
        $this->data = $data;
    }

    /**
     * Get data
     *
     * @return text 
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * Get binary image data
     *
     * @return string
     */
    public function getBlob()
    {
        $blob = substr($this->getData(),strlen('data:image/png;base64,'));
        return base64_decode($blob);
    }

    /**
     * Set created_at
     *
     * @param datetime $createdAt
     */
    public function setCreatedAt($createdAt=null)
    {
        if (empty($createdAt)) {
            $createdAt = new \DateTime();
            $createdAt->format('Y-m-d H:i:s');
        }

        $this->created_at = $createdAt;
    }

    /**
     * Get created_at
     *
     * @return datetime 
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * Set created_by
     *
     * @param string $createdBy
     */
    public function setCreatedBy($createdBy)
    {
        $this->created_by = $createdBy;
    }

    /**
     * Get created_by
     *
     * @return string 
     */
    public function getCreatedBy()
    {
        return $this->created_by;
    }

    /**
     * Set important
     *
     * @param boolean $important
     */
    public function setImportant($important)
    {
        $this->important = $important;
    }

    /**
     * Get important
     *
     * @return boolean 
     */
    public function getImportant()
    {
        return $this->important;
    }

    /**
     * Is important
     *
     * @return boolean
     */
    public function isImportant()
    {
        return $this->important;
    }
}