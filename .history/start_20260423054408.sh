#!/bin/bash
pnpm install
pnpm build
php -S 0.0.0.0:${PORT:-8000} index.php
