# GeoSystem

A place-exploration app for the Philippines: a Laravel 12 REST API (`backend/`) and a React + Vite frontend (`frontend/`).

## Run the backend

```bash
cd backend
composer install
cp .env.example .env        # then set your DB_* values (MySQL by default; SQLite also works)
php artisan key:generate
php artisan migrate --seed
php artisan serve           # http://127.0.0.1:8000
```

Seeded accounts (password `password`):

| Role  | Email                  |
|-------|------------------------|
| Admin | admin@geosystem.test   |
| User  | user@geosystem.test    |

Run the tests with `php artisan test`.

## Run the frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

The frontend reads the API address from `VITE_API_URL` (copy `frontend/.env.example` to `frontend/.env`; the default is `http://127.0.0.1:8000/api`), so start the backend first.

To open the app from a phone, or to publish it online, see [DEPLOY.md](DEPLOY.md).

## Features

**Everyone who is logged in**
- Browse, search and filter places by category and region; open a place for details and a map link.
- Save favorites.
- Read approved reviews and the average rating; write a review (one per place; it is published after an admin approves it).
- Send an exploration request for a place and track its status under My Requests.

**Administrators**
- Dashboard with site-wide counts.
- Add places and activate or deactivate them; manage categories and regions.
- See every exploration request and change its status.
- Approve, reject or delete reviews.

## Project layout

| Path | What it is |
|---|---|
| `backend/` | Laravel API (controllers, models, migrations, seeders, tests) |
| `frontend/` | React app (Vite), hash-based routing so it works on static hosting |
| `render.yaml`, `backend/Dockerfile` | Hosting the API on Render |
| `.github/workflows/deploy-pages.yml` | Publishes the frontend to GitHub Pages |

## Access rules

- Inactive places are visible to admins only; the public catalog shows active places.
- `/api/dashboard`, place/category/region management, review moderation and the full request list are admin-only.
- Only admins can change a request's status.
