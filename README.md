antoine.goutenoir.com
=====================

Hacking away with symfony2, javascript, canvas, css4, html6, and tactile 3d goodiness

INSTALL
=======

Configure app/config.parameters.ini (use .dist file as template)

php bin/vendors install

php app/console doctrine:schema:create
php app/console assets:install --symlink web

