# Testing on a phone and deploying

The app has two parts that must both be reachable from the phone: the React
frontend (`frontend/`) and the Laravel API (`backend/`). `127.0.0.1` on a phone
means *the phone itself*, so the API address is configurable through
`VITE_API_URL` (see `frontend/.env.example`).

> **Checked in development:** the backend test suite passes, the container start
> script (`backend/docker/start.sh`) runs correctly against a fresh database
> (migrates, seeds, serves, health check, login), CORS allows only the configured
> origin, and `render.yaml` and the workflow are valid YAML.
>
> **Not checked yet** (they need your accounts or tools that were unavailable
> when this was written): a frontend build (`npm run build`), the Docker image
> build, the GitHub Actions run and the Render deploy. If a step fails, read that
> service's log first and send me the error.

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

## Option B: a public link that works from any phone

GitHub Pages serves the React site; Render serves the Laravel API and its
database. Both have free plans (the free web service sleeps when idle, so the
first request after a pause can take about a minute, and free databases have
limits; check Render's current terms).

### Step 1: put the API on Render

1. Merge the pull request into `main` first (Render and the Pages workflow both
   read `main`).
2. Sign in at https://render.com with your GitHub account.
3. **New > Blueprint**, choose this repository. Render reads `render.yaml`,
   creates the `geosystem-api` web service and the `geosystem-db` database, and
   sets the environment variables for you.
4. Wait for the first deploy to finish. Open the service and copy its address, for
   example `https://geosystem-api.onrender.com`.
5. Check it: open `https://<your-service>.onrender.com/api/places` on your phone.
   You should see JSON with the demo places.

The first deploy also loads demo data. Log in with `admin@geosystem.test` or
`user@geosystem.test`, password `password`. **Change or delete these accounts
before sharing the link widely.** To stop loading demo data, set
`SEED_DEMO_DATA` to `false` in the service's Environment tab.

If your GitHub Pages address is not `https://orcartery-maker.github.io`, update
`CORS_ALLOWED_ORIGINS` in the service's Environment tab to match.

### Step 2: publish the frontend on GitHub Pages

1. Repo **Settings > Pages > Build and deployment > Source: GitHub Actions**.
2. Repo **Settings > Secrets and variables > Actions > Variables tab > New
   repository variable**: name `VITE_API_URL`, value
   `https://<your-service>.onrender.com/api` (note the `/api` at the end).
3. Open the **Actions** tab, choose **Deploy frontend to GitHub Pages** and
   press **Run workflow** (it also runs on every push to `main`).
4. When it turns green, the site is at
   `https://orcartery-maker.github.io/orcullocapstonedc4/`. Put that address in
   the repo's **About > Website** field (this replaces the dead link).

Routes use the URL hash (`/#/places`), so refreshing any page works on Pages.

### If something goes wrong

| Symptom | Likely cause |
|---|---|
| Pages shows a blank page | The workflow failed; open the Actions run and read the red step. |
| "Registration failed" / places do not load | `VITE_API_URL` is missing or wrong (rebuild after changing it), or the API is still waking up. |
| Browser console says "blocked by CORS" | `CORS_ALLOWED_ORIGINS` on Render does not match your Pages address. |
| API shows a 500 error | Open the Render service **Logs** tab and read the last error. |
