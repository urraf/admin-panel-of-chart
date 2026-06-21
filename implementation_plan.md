# Satta Kings Pro - Full Stack Website

Build a complete website called **Satta Kings Pro** modeled after the reference site, with PostgreSQL (Neon) database integration and an admin panel for managing all dynamic content.

## Technology Stack

- **Framework**: Next.js 14 (App Router) — SSR, API routes, and admin panel in one app
- **Database**: PostgreSQL via Neon (connection string provided)
- **ORM**: Prisma — type-safe database access
- **Styling**: Bootstrap 3.4.1 (to match reference) + custom CSS (matching the reference site's `bootstrap-theme.css` exactly)
- **Font**: Poppins (Google Fonts) — same as reference
- **Auth**: NextAuth.js with credentials provider for admin login
- **Deployment**: Runs locally via `npm run dev`

---

## Database Schema (PostgreSQL / Neon)

### Tables

| Table | Purpose |
|-------|---------|
| `games` | All game/lottery entries (name, time, display_order) |
| `results` | Daily results per game (game_id, date, result_value) |
| `advertisements` | Khaiwal/ad cards shown on homepage |
| `admin_users` | Admin login credentials (hashed passwords) |
| `site_settings` | Configurable site settings (marquee text, disclaimer, etc.) |
| `chart_groups` | Groups of games displayed together in chart tables |
| `chart_group_games` | Junction table linking chart_groups to games |

---

## Proposed Changes

### Backend / Database Layer

#### [NEW] `prisma/schema.prisma`
- Define all database models: Game, Result, Advertisement, AdminUser, SiteSetting, ChartGroup, ChartGroupGame
- Configure Neon PostgreSQL datasource

#### [NEW] `prisma/seed.js`
- Seed script to populate all 20 games from the reference site with their names and times
- Seed June 2026 chart data (all results from date 01-06 through 21-06) for all games
- Seed 3 ad/khaiwal cards from the reference
- Seed chart groups (Table 1: Faridabad/Gaziyabad/Gali/Disawar, Table 2: PK Bazar/Neelkanth/Nagpur/Jaipur City, etc.)
- Create default admin user (admin/admin123)
- Seed marquee text and disclaimer

---

### API Routes

#### [NEW] `src/app/api/` — RESTful API endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/games` | GET | List all games |
| `/api/results` | GET | Get results with filters (date, game) |
| `/api/results` | POST | Admin: Add/update a result |
| `/api/results/today` | GET | Today's results for homepage table |
| `/api/chart` | GET | Get monthly chart data (game, year, month) |
| `/api/advertisements` | GET/POST/PUT/DELETE | CRUD for ads |
| `/api/settings` | GET/PUT | Site settings |
| `/api/auth/[...nextauth]` | * | NextAuth authentication |
| `/api/admin/games` | POST/PUT/DELETE | Admin game CRUD |

---

### Frontend Pages

#### [NEW] `src/app/page.js` — Homepage
- Navigation bar (HOME, CHART, CONTACT, LOGIN)
- Blinking logo "SATTA KINGS PRO" with red-gold gradient
- Live clock display
- Hindi text banner
- Marquee ticker (yellow text on dark background)
- Featured game result (DISAWAR style with arrow)
- Advertisement cards (khaiwal ads with dashed red border, gold gradient)
- **Results table**: 3-column table (Game Name | Yesterday | Today) with all 20 games
- Monthly chart tables (5 groups of 4 games each, color-coded)
- Game/year selector dropdown
- Footer with copyright and disclaimer

#### [NEW] `src/app/chart/page.js` — Chart Page
- Same nav bar and logo
- Chart links table: Each game with year links (2022-2026)
- Footer sections

#### [NEW] `src/app/contact/page.js` — Contact Page
- Same nav bar and logo
- Chart links table (same as chart page)
- Footer

#### [NEW] `src/app/login/page.js` — Login Page
- Same nav bar and logo
- Login form (username + password)
- Redirects to admin panel on success

#### [NEW] `src/app/admin/` — Admin Panel (Protected)
- **Dashboard**: Overview of games count, today's results entered, pending results
- **Games Manager**: Add/edit/delete games, set times and display order
- **Results Manager**: Enter/update daily results for each game with date picker
- **Ads Manager**: Add/edit/delete advertisement cards (khaiwal info)
- **Settings**: Edit marquee text, disclaimer, site name
- **Chart Groups**: Manage which games appear in which chart group

---

### Styling

#### [NEW] `src/app/globals.css`
- Replicate the reference site's complete styling including:
  - `.topboxnew`, `.newnav`, `.sattalogo` sections
  - `.tablebox1`, `.newtable`, `.octoberresultchart` table styles
  - `.callbox`, `.column-ad`, `.card-body` ad card styles
  - `.somelinks`, `.somelinks2` footer styles
  - `.circlebox`, `.liveresult`, `.datetime` live result styles
  - `.loginhead`, `.sattname`, `.form-wrapper` login styles
  - All color schemes matching reference (red-gold gradients, dark backgrounds, yellow/green/pink data colors)
  - Responsive breakpoints matching the reference

---

## Data to Seed

### Games (20 total, with times)
| Game | Time |
|------|------|
| P.K BAZAR | 08:30 AM |
| Neelkanth | 09:30 AM |
| NAGPUR | 10:30 AM |
| JAIPUR CITY | 11:30 AM |
| B2 SATTA | 12:30 PM |
| DL | 01:30 PM |
| CHANDIGARH CITY | 02:20 PM |
| DELHI BAZAR | 03:10 PM |
| DELHI KING | 03:30 PM |
| GAZIYABAD SAVERA | 04:00 PM |
| SHREE GANESH | 04:20 PM |
| RAMGARH | 05:20 PM |
| Faridabad | 06:10 PM |
| TAJ BAZAR | 07:10 PM |
| BALAZI | 07:30 PM |
| GAZIYABAD | 09:30 PM |
| DISAWAR KING | 10:15 PM |
| GALI B | 10:30 PM |
| GALI | 11:30 PM |
| DISAWAR | 05:10 AM |

### Chart Data
- All June 2026 daily results for the 4 main games (Faridabad, Gaziyabad, Gali, Disawar) — 21 days × 4 games
- All June 2026 daily results for secondary group (PK Bazar, Neelkanth, Nagpur, Jaipur City) — 21 days × 4 games
- All June 2026 daily results for third group (B2 Satta, DL, Chandigarh City, Delhi Bazar) — 21 days × 4 games
- Additional groups for remaining games

---

## Open Questions

> [!IMPORTANT]
> **Admin Credentials**: The default admin login will be set to `admin` / `admin123`. Would you like different credentials?

> [!NOTE]
> **Website Branding**: All references to "B2 SATTA" will be replaced with "SATTA KINGS PRO" throughout the site. The domain references will be updated accordingly.

---

## Verification Plan

### Automated Tests
- `npx prisma db push` — verify database schema deploys correctly to Neon
- `npx prisma db seed` — verify seed data populates
- `npm run build` — verify Next.js builds without errors

### Manual Verification
- Run `npm run dev` and verify:
  - Homepage loads with all game results, charts, and ads
  - Chart page shows game links with year filters
  - Login page authenticates and redirects to admin panel
  - Admin panel allows CRUD on games, results, ads, settings
  - All chart data matches the reference site's June 2026 data
  - Styling matches the reference (colors, fonts, layouts, gradients)
  - Mobile responsive layout works correctly
