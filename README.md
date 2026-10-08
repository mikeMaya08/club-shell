# club-shell

Entry point of the **Baseline Tennis Club** sandbox. It gives the three apps (`club-player`,
`club-admin`, `club-coach`) one shared origin so they share `localStorage`.

- **Local:** a Vite dev server on `http://localhost:5000` that proxies `/player`, `/admin` and `/coach`
  to the app dev servers (ports 5101, 5102, 5103), websockets included for HMR.
- **Production:** a Netlify site with a landing page and a `_redirects` file that proxies to the three app sites.

The landing page links to the apps and has a **Reset all data** button.

## Scripts

| Script             | What it does                                                        |
| ------------------ | ------------------------------------------------------------------- |
| `npm install`      | Installs dependencies                                               |
| `npm run dev`      | Proxy + landing page on :5000 (apps must already be running)        |
| `npm run dev:all`  | Starts club-store (watch), club-player, club-admin, club-coach and this shell |
| `npm run build`    | Builds the static landing page into `dist/` (includes `_redirects`) |

### `dev:all`

`dev:all` runs `npm --prefix ../club-<name> run dev` for every repo, so it **assumes the 5 repos are
cloned side by side**:

```
parent/
  club-store/   club-player/   club-admin/   club-coach/   club-shell/
```

Run `npm install` in each repo once first (and `npm run build` in `club-store`, which `npm install` already does through `prepare`).
Then open **<http://127.0.0.1:5000>**.

> **macOS note:** AirPlay Receiver listens on port 5000 and answers `403` on `http://localhost:5000`.
> The shell binds `127.0.0.1:5000`, so use that address (and use it consistently: `localStorage` is per origin).
> Alternatively disable *System Settings → General → AirDrop & Handoff → AirPlay Receiver*.

## Deploy (Netlify)

Create a site from this repo (build `npm run build`, publish `dist`). Edit `public/_redirects` if your
app sites have different names. Each app is a separate Netlify site built from its own repo.

## Cross-app testing quick reference

Open everything through the shell origin (<http://127.0.0.1:5000>) so all apps share one `localStorage`.

| Goal                                | URL                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| Fresh demo data, logged in as admin | `/admin/?reset=1&seed=demo&as=admin-1&now=2026-10-10T10:00`                     |
| Player tab                          | `/player/?as=player-1&now=2026-10-10T10:00`                                     |
| Coach tab                           | `/coach/?as=coach-1&now=2026-10-10T10:00`                                       |
| Conflict testing (≈90% booked)      | `/player/?reset=1&seed=full&as=player-1`                                        |
| Loading states / flaky network      | add `&latency=1500` / `&flaky=0.2`                                              |
| Inject bugs                         | add `&bug=double-booking,stale-ui,wrong-price,cancel-anytime,slow-render`       |

Hook parameters are applied once, saved in `sessionStorage` (per tab) and removed from the address bar.
Press **Ctrl+Shift+D** in any app for the debug panel (user, clock, bugs, JSON state, reset/seed buttons).
`window.__club` exposes `{ state, reset(seed), setBugs([]), setNow(iso) }` in every app.
Use the same `now=` in every tab, otherwise each tab runs on a different clock.
