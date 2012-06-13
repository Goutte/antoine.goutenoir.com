antoine.goutenoir.com
=====================

Hacking away with symfony2, javascript, canvas, css4, html6, and tactile 3d goodiness

INSTALL
=======

Configure app/config.parameters.ini (use .dist file as template)

chmod -R 777 app/cache
chmod -R 777 app/logs
(use setfacl too !)

php bin/vendors install
php bin/vendors update

php app/console doctrine:schema:create
php app/console assets:install --symlink web

php app/console cypress:compass:compile
php app/console cypress:compass:compile -e=prod


TESTS
=====

To be able to set breakpoints in tests, run :

    $ export XDEBUG_CONFIG="idekey=PHPSTORM"


MIGRATE TO PROD
===============

# remove the cache (and the logs)
rm -Rf app/cache/* && rm -Rf app/logs/*.log
# (temp) toggle htaccess comment
# upload
# clean server's cache
# examine server's logs
