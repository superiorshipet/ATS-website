#!/bin/bash
set -e
cd /app
chmod +x index.php
php -S 0.0.0.0:${PORT:-8000} index.php
