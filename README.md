Doodling for the WIN
====================

Hacking away with symfony2, javascript, canvas, css3, html5, and haptic goodiness.
This is using a very early version of symfony2, predating the move to composer !


INSTALL
=======

Configure app/config.parameters.ini (use .dist file as template)

```
sudo setfacl -R  -m u:www-data:rwx -m u:`whoami`:rwx app/cache app/logs
sudo setfacl -dR -m u:www-data:rwx -m u:`whoami`:rwx app/cache app/logs

sudo setfacl -R  -m u:www-data:rwx -m u:`whoami`:rwx src/Goutte/DoodleBundle/Resources/public
sudo setfacl -dR -m u:www-data:rwx -m u:`whoami`:rwx src/Goutte/DoodleBundle/Resources/public

sudo setfacl -R  -m u:www-data:rwx -m u:`whoami`:rwx web
sudo setfacl -dR -m u:www-data:rwx -m u:`whoami`:rwx web

php bin/vendors install
php bin/vendors update

php app/console doctrine:schema:create
php app/console assets:install --symlink web

php app/console cypress:compass:compile
php app/console cypress:compass:compile -e=prod
```

TESTS
=====

To be able to set breakpoints in tests, run :

    $ export XDEBUG_CONFIG="idekey=PHPSTORM"


MIGRATE TO PROD
===============

- remove the cache (and the logs)
  `rm -Rf app/cache/* && rm -Rf app/logs/*.log`
- make sure `app.php` is the front controller in the `.htaccess`
- upload
- clean server's cache
- examine server's logs
