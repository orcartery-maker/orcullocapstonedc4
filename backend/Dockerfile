# Container image for the GeoSystem Laravel API (used by render.yaml).
FROM php:8.3-cli

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libpq-dev libzip-dev libsqlite3-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql pdo_sqlite zip bcmath \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install dependencies first so Docker can cache this layer.
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

COPY . .
RUN composer dump-autoload --optimize --no-dev \
    && php artisan package:discover --ansi \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

ENV PHP_CLI_SERVER_WORKERS=4
EXPOSE 8000

CMD ["sh", "docker/start.sh"]
