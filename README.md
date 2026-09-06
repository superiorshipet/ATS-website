# ATS Website

Smart recruitment platform with a React frontend and a Laravel API backend.

## Stack

Backend:
- Laravel / PHP 8.3
- PostgreSQL
- Repository pattern with DTOs, repository interfaces, services, and controllers
- Automatic database bootstrap, migrations, and admin seeding on Railway startup

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

Deployment:
- Railway for the Laravel API
- Vercel for the frontend

## Project Structure

```text
ATS-website/
|-- backend/                 # Laravel backend API
|   |-- app/
|   |   |-- DTO/
|   |   |-- Http/Controllers/Api/
|   |   |-- Models/
|   |   |-- Providers/
|   |   |-- Repositories/
|   |   `-- Services/
|   |-- bootstrap/
|   |-- config/
|   |-- database/
|   |   |-- migrations/
|   |   `-- seeders/
|   |-- routes/api.php
|   |-- artisan
|   `-- composer.json
|-- src/                     # React frontend
|-- public/                  # Public assets
|-- index.html               # Vite entry HTML
|-- package.json
|-- nixpacks.toml            # Railway build config
|-- railway.json             # Railway start command
`-- start.sh                 # Railway runtime startup
```

The old root-level PHP backend was removed. The API now lives only in `backend/`.

## Environment Variables

Railway backend:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://ats-website-ats.up.railway.app
DATABASE_URL=${{ats.DATABASE_URL}}
CORS_ALLOWED_ORIGINS=https://ats-website-flax.vercel.app,https://ats-website-ats.up.railway.app
ADMIN_NAME=ATS Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
ADMIN_PHONE=
```

Vercel frontend:

```env
VITE_API_URL=https://ats-website-ats.up.railway.app/api
```

## Railway Startup Flow

`start.sh` runs the production backend from `backend/`:

1. Generates a runtime `APP_KEY` if Railway does not provide one.
2. Runs `backend/bootstrap_database.php`.
3. Runs Laravel migrations.
4. Seeds an admin user if no admin exists.
5. Starts Laravel on Railway's provided `$PORT`.

## API

Base URL:

```text
https://ats-website-ats.up.railway.app/api
```

Main endpoints:

```text
POST   /auth/login
POST   /auth/register
GET    /jobs
POST   /jobs
GET    /jobs/{id}
PUT    /jobs/{id}
DELETE /jobs/{id}
GET    /profile
PUT    /profile
POST   /profile/avatar
GET    /cv
POST   /cv
POST   /cv/upload
POST   /applications
GET    /applications
PUT    /applications/{id}/status
GET    /applications/job/{id}
GET    /applications/employer
GET    /admin/stats
GET    /admin/users
GET    /admin/jobs
GET    /admin/companies
GET    /admin/graduates
POST   /admin/create
PUT    /admin/users/{id}/status
DELETE /admin/users/{id}
PUT    /admin/jobs/{id}
DELETE /admin/jobs/{id}
POST   /chatbot
GET    /chatbot/history
```

## Local Development

Install frontend dependencies:

```bash
pnpm install
```

Install backend dependencies:

```bash
cd backend
composer install
```

Run the backend locally:

```bash
cd backend
php artisan migrate
php artisan db:seed --class=AdminSeeder
php artisan serve --host=127.0.0.1 --port=8000
```

Run the frontend locally:

```bash
pnpm run dev
```

For local frontend development, Vite proxies `/api` to `http://localhost:8000`.
