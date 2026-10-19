# Testing on a phone and deploying

The app has two parts that must both be reachable from the phone: the React
frontend (`frontend/`) and the Laravel API (`backend/`). `127.0.0.1` on a phone
means *the phone itself*, so the API address must be configured (it is read from
`VITE_API_URL`, see `frontend/.env.example`).

> **What has been verified:** the frontend builds and works against the API, the
> CORS setting works, and the workflow file is valid YAML. **Not verified:** the
> GitHub Actions run itself and any specific API host, because they need your
> GitHub / hosting accounts. If a step fails, check the Actions log first.

## Option A: phone on the same Wi-Fi as your computer

1. Find your computer's local IP (e.g. `192.168.1.10`): `ipconfig` on Windows,
   `ifconfig` / `ip addr` on macOS/Linux.
2. Start the API so other devices can reach it:
   ```bash
   cd backend
   php artisan serve --host=0.0.0.0 --port=8000
   ```
3. Point the frontend at it, then start it with network access:
   ```bash
   cd frontend
   cp .env.example .env          # then set VITE_API_URL=http://192.168.1.10:8000/api
   npm install
   npm run dev -- --host
   ```
4. On the phone, open `http://192.168.1.10:5173`.

If it does not load, allow ports 5173 and 8000 through your computer's firewall.

## Option B: a public link (GitHub Pages + a hosted API)

GitHub Pages only serves static files, so the Laravel API needs a separate host.

### 1. Host the API (any PHP 8.3 host with MySQL or PostgreSQL)

Set these environment variables on the host:

| Variable | Value |
|---|---|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | output of `php artisan key:generate --show` |
| `APP_URL` | your API's public `https://` URL |
| `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | your database |
| `CORS_ALLOWED_ORIGINS` | `https://orcartery-maker.github.io` |

Then, on the host:
```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan db:seed --force      # once, to create the demo accounts and places
```
Serve the `backend/public` folder. Use a real database: a SQLite file on a host
with a temporary disk will be wiped on every restart.

The API must be `https://`, because browsers block a secure Pages site from
calling a plain `http://` API.

### 2. Publish the frontend to GitHub Pages

1. Repo **Settings > Pages > Build and deployment > Source: GitHub Actions**.
2. Repo **Settings > Secrets and variables > Actions > Variables**: add
   `VITE_API_URL` = `https://your-api-host/api`.
3. Merge to `main` (or run the workflow manually from the **Actions** tab).
4. The site appears at `https://orcartery-maker.github.io/orcullocapstonedc4/`.
   Put that URL in the repo's **About > Website** field.

Routes use the URL hash (`/#/places`), so refreshing any page works on Pages.
