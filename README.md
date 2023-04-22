
# Doodling for the win

A doodle is worth many words.


## Stack

- Symfony 6
- PaperJs
- Flat files for doodles (in `var/doodle/`)
- Messenger for async email sending


## Install

> Best use `phpenv`.

1. Create `.env.local` with `APP_SECRET` and other config.
2. `composer install`
3. Setup database and run migrations.

## Run (dev)

    symfony serve


## Run (prod)

    docker compose up

## Messenger

Emails are sent asynchronously.
This project requires a database to hold the message queue.

https://symfony.com/doc/current/messenger.html#consuming-messages-running-the-worker

    bin/console messenger:consume async -vv
