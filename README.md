DOODLING FOR THE WIN
====================

Hacking away with symfony2, javascript, canvas, css3, html5, and haptic goodiness.
This is using a very early version of symfony2, predating the move to composer !

This is a really old experiment with canvas, made when everybody was still using
adobe flash. You should look at [Cyx](http://antoine.goutenoir.com/games/cyx) for
a cool (and a bit more modern) experiment with WebGL, Coffeescript and Leap Motion,
and also [ÆGO](http://ægo.com) (still WebGL, but with Dart this time), on one hand
because it's got a cool URL and on the other hand because it's the (ongoing) realization
of one of my childhood dreams.

I'm pretty confident this website can be hacked to execute arbitrary code on my
server, but I'm also pretty confident that if you do have the skills to do such
a thing, you also do have the ethics of the hacker, so... welcome !


TODO
====

No promises.

- Enable Leap Motion drawing
- Move to a file-based database
- Upgrade the attachment of a message to a doodle


INSTALL
=======

Configure `app/config.parameters.ini` (use .dist file as template)

```
sudo setfacl -R  -m u:www-data:rwx -m u:`whoami`:rwx app/cache app/logs web
sudo setfacl -dR -m u:www-data:rwx -m u:`whoami`:rwx app/cache app/logs web

sudo setfacl -R  -m u:www-data:rwx -m u:`whoami`:rwx src/Goutte/DoodleBundle/Resources/public
sudo setfacl -dR -m u:www-data:rwx -m u:`whoami`:rwx src/Goutte/DoodleBundle/Resources/public

php bin/vendors install
php bin/vendors update

php app/console doctrine:schema:create
php app/console assets:install --symlink web

php app/console cypress:compass:compile
php app/console cypress:compass:compile -e=prod
```

TESTS
=====

The test suite mostly covers the API, as testing drawing on a canvas requires
some very very VERY heavy browser/mouse slaving, which is pretty far out of the
scope of this simple project.

To be able to set breakpoints in tests, run :

    $ export XDEBUG_CONFIG="idekey=PHPSTORM"

(I keep this export for archive puposes, I don't need it anymore)


MIGRATE TO PROD
===============

Thanks to `rsync` and `ssh`, this is a breeze :

    $ bin/publish
