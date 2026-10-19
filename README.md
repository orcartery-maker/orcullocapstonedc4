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

The frontend calls the API at `http://127.0.0.1:8000/api` (see `frontend/src/services/api.js`), so start the backend first.

## Notes

- Inactive places are visible to admins only; the public catalog shows active places.
- `/api/dashboard` and place/category/region management are admin-only.
- Any logged-in user can favorite places and submit/view their own exploration requests; only admins can change a request's status.
- Reviews are not implemented yet (the Reviews page is a placeholder).
