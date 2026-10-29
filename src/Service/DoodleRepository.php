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
        foreach ($this->filesystem->listContents(".", false) as $content) {
            /** @var StorageAttributes $content */
            if ($content->isFile() && str_ends_with($content->path(), ".yaml")) {
                $count++;
            }
        }
        return $count;
    }

    /**
     * Careful, we're returning an iterative array of associative arrays, not of Doodle.
     * @return Doodle[]
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
        foreach ($this->filesystem->listContents(".", false)->sortByPath() as $content) {
            /** @var StorageAttributes $content */
            if ($content->isFile() && str_ends_with($content->path(), ".yaml")) {
                if ($cursor >= $end) {
                    break;
                }
                if ($cursor >= $start) {
                    $doodle_as_array = $this->readYamlFile($content->path()); // :(|)
                    $doodle = (new Doodle())->denormalize($doodle_as_array);
                    $doodle_as_array['path'] = $content->path();
//                    $doodles[] = $doodle_as_array;
                    $doodles[] = $doodle;
                }

                $cursor++;
            }
        }
        return $doodles;
    }

    protected function readYamlFile($path): array
    {
        $contents = $this->filesystem->read($path);
        return Yaml::parse($contents);
    }

    public function saveDoodle(Doodle $doodle): void
    {
        $filenameYaml = $doodle->getId() . ".yaml";
        $filenamePng = $doodle->getId() . ".png";
        $serialized = Yaml::dump($doodle->normalize());
        $this->filesystem->write($filenameYaml, $serialized);
        $this->filesystem->write($filenamePng, $doodle->getBlob());
    }

    public function deleteDoodle(string $id): void
    {
        $id = $this->sanitizeId($id);
        if (empty($id)) return;
        $filenameYaml = $id . ".yaml";
        $filenamePng = $id . ".png";

        // Note: This silently fails if the file does not exist.  (and we rely on this for now)
        // We *could* raise ourselves, and improve the controller, but I have other things to do.
        // Anyway this whole flat file repo should implement the appropriate Doctrine interfaces I guess?
        $this->filesystem->delete($filenameYaml);
        $this->filesystem->delete($filenamePng);
    }

    protected function sanitizeId(string $id): string {
        return Doodle::sanitizeId($id);
    }
}