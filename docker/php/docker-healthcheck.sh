#!/bin/sh
set -e

#if env -i REQUEST_METHOD=GET SCRIPT_NAME=/ping SCRIPT_FILENAME=/ping cgi-fcgi -bind -connect /var/run/php/php-fpm.sock; then
if env -i REQUEST_METHOD=GET SCRIPT_NAME=/ping SCRIPT_FILENAME=/ping cgi-fcgi -bind -connect 0.0.0.0:9000; then
	exit 0
fi

exit 1
