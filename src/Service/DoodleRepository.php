<?php


namespace App\Service;


use App\Domain\Doodle;
use League\Flysystem\Filesystem;
use League\Flysystem\Local\LocalFilesystemAdapter;
use League\Flysystem\StorageAttributes;
use Symfony\Component\Yaml\Yaml;

class DoodleRepository
{
    protected Filesystem $filesystem;

    public function __construct()
    {
        $adapter = new LocalFilesystemAdapter("../var/doodle");
        $this->filesystem = new Filesystem($adapter);
    }

    public function countDoodles(): int
    {
        $count = 0;
        foreach ($this->filesystem->listContents(".") as $content) {
            /** @var StorageAttributes $content */
            if ($content->isFile() && str_ends_with($content->path(), ".yaml")) {
                $count++;
            }
        }
        return $count;
    }

    /**
     * Careful, we're returning an array of associative arrays, not of Doodle.
     * TODO: deserialize properly into Doodle
     */
    public function index($page = 0, $per_page = 4): array
    {
        if ($page < 0) {
            $page = 0;
        }
        if ($per_page <= 0) {
            $per_page = 0;
        }
        $doodles = [];
        $start = $page * $per_page;  // inclusive
        $end = ($page + 1) * $per_page; // exclusive
        $cursor = 0;
        foreach ($this->filesystem->listContents(".", false) as $content) {
            /** @var StorageAttributes $content */
            if ($content->isFile() && str_ends_with($content->path(), ".yaml")) {
                if ($cursor >= $end) {
                    break;
                }
                if ($cursor >= $start) {
                    $doodles[] = $this->readYamlFile($content->path()); // :(|)
                }

                $cursor++;
            }
        }
        return $doodles;
    }

    public function saveDoodle(doodle $doodle)
    {
        $now = (new \DateTime())->format("Y-m-d_H:i:s");
        $filenameYaml = $now . ".yaml";
        $filenamePng = $now . ".png";
        $serialized = Yaml::dump($doodle->serialize());
        $this->filesystem->write($filenameYaml, $serialized);
        $this->filesystem->write($filenamePng, $doodle->getBlob());
    }

    protected function readYamlFile($path) : array {
        $contents = $this->filesystem->read($path);
        return Yaml::parse($contents);
    }
}