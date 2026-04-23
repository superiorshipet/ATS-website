#!/bin/bash
#!/bin/bash
set -e
cd /app
pnpm install --prod=false
pnpm build
chmod +x index.php
php -S 0.0.0.0:${PORT:-8000} index.php
