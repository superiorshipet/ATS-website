#!/bin/bash
set -e
cd /app/backend
if [ -z "${APP_KEY:-}" ]; then
  export APP_KEY="base64:$(php -r 'echo base64_encode(random_bytes(32));')"
fi
php bootstrap_database.php
php artisan storage:link || true
php artisan migrate --force
php artisan db:seed --class=AdminSeeder --force
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
