# club-shell

Entry point of the **Baseline Tennis Club** sandbox. It gives the three apps (`club-player`,
`club-admin`, `club-coach`) one shared origin so they share `localStorage`.

- **Local:** a Vite dev server on `http://localhost:5000` that proxies `/player`, `/admin` and `/coach`
  to the app dev servers (ports 5101, 5102, 5103), websockets included for HMR.
- **Production:** a Vercel project with a landing page and `rewrites` in `vercel.json` that proxy `/player`, `/admin` and `/coach` to the three app projects.

The landing page links to the apps and has a **Reset all data** button.

## Scripts

| Script             | What it does                                                        |
| ------------------ | ------------------------------------------------------------------- |
| `npm install`      | Installs dependencies                                               |
| `npm run dev`      | Proxy + landing page on :5000 (apps must already be running)        |
| `npm run dev:all`  | Starts club-store (watch), club-player, club-admin, club-coach and this shell |
| `npm run build`    | Builds the static landing page into `dist/` |

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

## Deploy (Vercel)

Every repo is its own Vercel project (framework preset *Vite*; each repo's `vercel.json` has the settings):

| Repo          | Suggested project name | Serves                    |
| ------------- | ---------------------- | ------------------------- |
| `club-player` | `club-player`          | `/player/*`               |
| `club-admin`  | `club-admin`           | `/admin/*`                |
| `club-coach`  | `club-coach`           | `/coach/*`                |
| `club-shell`  | any (this is the public URL) | landing page + proxy |

`vercel.json` here rewrites `/player/*`, `/admin/*` and `/coach/*` to `https://club-<app>.vercel.app/<app>/*`,
so the browser only ever sees the shell's origin and all apps share `localStorage`. If your project URLs differ
(Vercel adds a suffix when a name is taken), edit the destinations in `vercel.json`.

Gotchas:
- Turn off **Vercel Authentication / Deployment Protection** for the three app projects (or use their public
  production domains), otherwise the proxy receives a login page instead of the app.
- Open the app through the shell's domain, never through an app's own `*.vercel.app` URL, or the data will not be shared.

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
