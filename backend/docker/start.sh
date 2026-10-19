#!/bin/sh
# Start script for the container: prepares the app, then serves the API.
set -e

# Hosting dashboards often generate a plain random value; Laravel expects "base64:<key>".
if [ -z "$APP_KEY" ]; then
    APP_KEY="$(php artisan key:generate --show)"
    echo "APP_KEY was not set; generated a temporary one. Set APP_KEY to keep it stable."
fi
case "$APP_KEY" in
    base64:*) ;;
    *) APP_KEY="base64:$APP_KEY" ;;
esac
export APP_KEY

php artisan migrate --force

# Optional demo data (admin@geosystem.test / user@geosystem.test, password "password").
# Seeding stops harmlessly if the data already exists from an earlier deploy.
if [ "$SEED_DEMO_DATA" = "true" ]; then
    php artisan db:seed --force || echo "Seeding skipped (data probably exists already)."
fi

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
