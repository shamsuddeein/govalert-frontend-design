# GovAlert — All Build Prompts
**Paste each prompt directly into your AI coding tool (Claude Code, Cursor, Copilot).**
**Execute in order. Do not skip groups.**

---

## GROUP 1 — BUG FIXES
**Do these first. They are broken on the live site right now.**

---

### PROMPT 1 — Fix duplicated verification timeline

```
In the homepage component, the verification pipeline section (stages 1-4:
Portal monitored, Content extracted, Official source verified, Published)
is rendering twice. Find the duplicate and remove it so the section
appears exactly once. Do not change the content or styling, only remove
the duplicate render.
```

---

### PROMPT 2 — Fix agency profile links on job detail page

```
On the job detail page, the "View full agency profile →" link currently
points to /agencies (the general directory). Fix it so it links to the
specific agency profile page using the agency slug from the job data.
For example, an NNPC job should link to /agencies/NNPC, a Customs job
should link to /agencies/NCS, and so on. Apply this fix to all job
detail pages, not just one.
```

---

### PROMPT 3 — Remove Instrument Serif from hero headline

```
Find every instance of Instrument Serif, Georgia, or any serif font
being used in the hero headline on the homepage. Remove it entirely.
The word "intelligence" in the headline may currently be in italic serif
— change it to IBM Plex Sans 600 weight in the brand green color
(#0a5c38) instead. The entire headline should now be IBM Plex Sans
with no serif or italic anywhere. Update the font imports if needed.
```

---

### PROMPT 4 — Replace emoji search icon with SVG

```
The search bar currently uses a 🔍 emoji as the left icon. Replace it
with a proper SVG magnifying glass icon. The SVG should be 16x16px,
stroke-only (no fill), stroke color matching the input placeholder text
color, stroke-width 1.5. Place it absolutely positioned inside the
input on the left side with 12px from the left edge. The input text
should have enough left padding to not overlap the icon.
```

---

### PROMPT 5 — Fix mobile menu legal links

```
On mobile, the hamburger menu currently has Privacy Policy and Terms of
Service floating at the bottom disconnected from everything else. Fix the
mobile menu structure so it has three clear sections:

1. Navigation: Home, Jobs, Agencies, Verification, About
2. Account: Sign In, Dashboard
3. A full-width "Get Alerts" button (green, Telegram icon)
4. Legal (labeled group): Privacy Policy, Terms of Service

Each section should have a thin separator line between them. The legal
links should be smaller text (12px, secondary color) and sit inside a
group with a "Legal" label above them. Remove the empty space that
currently exists between the Get Alerts button and the legal links.
```

---

### PROMPT 6 — Add Clearbit logo fallback

```
The site uses Clearbit to fetch agency logos via:
https://logo.clearbit.com/{domain}?size=128

If a Clearbit image fails to load (404, network error, rate limit),
the broken image icon shows instead. Fix every place a Clearbit logo
is used so that if the image fails to load, it falls back to showing
the agency acronym chip — a small pill with dark green background
(#0a5c38), white text, IBM Plex Sans 12px 700, the acronym text
(e.g. "NNPC", "NCS", "EFCC"). Apply this fallback everywhere logos
appear: homepage portal health cards, job cards, agency cards, job
detail page, agency profile page.
```

---

## GROUP 2 — DJANGO BACKEND API
**Build this before touching the frontend connection.**
**Run these prompts inside your Django project.**

---

### PROMPT 7 — Inspect and document existing models

```
Look at all models in this Django project. List every model name,
its fields, and what data it currently stores. Then identify which
models contain:
- Agency information (name, acronym, URL, status)
- Job/recruitment listings (title, deadline, agency, status)
- Monitoring logs or check history
- Any user or alert subscription data

Do not change anything. Just give me a clear map of what exists
so I know what I am working with before building the API.
```

---

### PROMPT 8 — Build agencies API endpoint

```
Using Django REST Framework, build the following API endpoints for
agencies. Install DRF if it is not already installed.

GET /api/v1/agencies/
Returns a list of all agencies with these fields:
- id
- name (full name)
- acronym
- description (2 sentences max)
- portal_url
- status (online / offline / maintenance)
- last_checked (ISO datetime)
- response_time_ms (integer)
- jobs_available (integer count of active jobs)
- vetted_score (integer percentage 0-100)
- category (Security, Finance, Education, Health, etc.)

GET /api/v1/agencies/{slug}/
Returns a single agency with all the above plus:
- monitoring_interval_minutes
- uptime_percent (float)
- total_recruitments_detected (integer)
- last_update (ISO datetime)
- recruitment_history (list of objects: date, event_description)
- last_10_checks (list of booleans, true=success false=failure)
- last_offline_at (ISO datetime or null)
- last_offline_duration_minutes (integer or null)
- avg_confidence_score (float)
- false_positives (integer)
- scam_domains_blocked (integer)

Use the actual data from the database. If a field does not exist
in the models yet, add it to the model with a sensible default
and create a migration. Add CORS headers so the frontend can
call this API. Add pagination to the list endpoint (20 per page).
```

---

### PROMPT 9 — Build jobs API endpoint

```
Using Django REST Framework, build the following API endpoints for
job listings.

GET /api/v1/jobs/
Returns paginated list of all jobs (20 per page) with:
- ref (e.g. "8829-GA")
- title
- agency_name
- agency_acronym
- agency_slug
- deadline (ISO date or null if pending)
- status (verified / urgent / updating / closed / new_opening)
- positions (text description)
- published_at (ISO datetime)
- category
- location_state
- official_url

Support these query parameters for filtering:
?agency={acronym}
?status={status}
?category={category}
?location={state}
?search={text} (searches title and agency name)
?ordering=detected (default), deadline, published_at

GET /api/v1/jobs/{ref}/
Returns single job with all the above plus:
- confidence_score (integer 0-100)
- confidence_factors (list of objects: label, passed boolean)
- source_url (full portal URL)
- last_monitored (ISO datetime)
- detection_timeline (list of objects: time string, event string)
- description (full text)
- requirements (list of strings)
- portal_status (online / offline / maintenance)
- portal_last_checked (ISO datetime)
- portal_response_dots (integer 1-3, represents speed)
- portal_uptime_percent (float)
- related_jobs (list of 2-3 job objects from same category)

If any field does not exist in the models, add it with a default
value and create a migration.
```

---

### PROMPT 10 — Build system status endpoint

```
Build a system status API endpoint:

GET /api/v1/status/

Returns:
- agencies_online (integer)
- agencies_offline (integer)
- agencies_maintenance (integer)
- total_agencies (integer)
- total_checks_today (integer)
- successful_checks_today (integer)
- failed_checks_today (integer)
- success_rate_today (float, percentage)
- changes_detected_today (integer)
- active_campaigns (integer)
- monitoring_interval_minutes (integer)
- last_audit_at (ISO datetime)
- system_operational (boolean)

This endpoint should be fast. Cache the response for 60 seconds
using Django's cache framework so it does not hit the database
on every request. Use in-memory cache if Redis is not configured.

Also build:
GET /api/v1/status/live-feed/

Returns the 10 most recent monitoring events as a list:
- agency_name
- agency_acronym
- event_type (verified / no_changes / new_opening / urgent)
- event_time (ISO datetime)
- time_ago (human readable: "2m ago", "1h ago")
```

---

### PROMPT 11 — Add all 41 agencies to the database

```
Add all 41 agencies that this Telegram bot monitors to the database.
The bot already groups them into categories. Use these exact agencies
and categories:

Security & Law Enforcement:
- Army (Nigerian Army) — army.mil.ng
- CDCFIB (Civil Defence, Correctional, Fire and Immigration Board) — cdcfib.gov.ng
- DSS (Department of State Services) — dss.gov.ng
- FFS (Federal Fire Service) — fedfire.gov.ng
- NAF (Nigerian Air Force) — airforce.mil.ng
- NCoS (Nigerian Correctional Service) — corrections.gov.ng
- NDA (Nigerian Defence Academy) — nda.edu.ng
- NIS (Nigeria Immigration Service) — immigration.gov.ng
- NPF (Nigeria Police Force) — npf.gov.ng
- NSCDC (Nigeria Security and Civil Defence Corps) — nscdc.gov.ng
- Navy (Nigerian Navy) — navy.mil.ng

Anti-Corruption & Justice:
- EFCC (Economic and Financial Crimes Commission) — efcc.gov.ng
- ICPC (Independent Corrupt Practices Commission) — icpc.gov.ng

Finance & Revenue:
- CBN (Central Bank of Nigeria) — cbn.gov.ng
- FIRS (Federal Inland Revenue Service) — firs.gov.ng
- NCS (Nigeria Customs Service) — customs.gov.ng

Energy & Natural Resources:
- NNPC (Nigerian National Petroleum Corporation) — nnpcgroup.com
- NUPRC (Nigerian Upstream Petroleum Regulatory Commission) — nuprc.gov.ng
- NMDPRA (Nigerian Midstream and Downstream Petroleum Regulatory Authority) — nmdpra.gov.ng

Health:
- FMOH (Federal Ministry of Health) — health.gov.ng
- NAFDAC (National Agency for Food and Drug Administration) — nafdac.gov.ng
- NHIA (National Health Insurance Authority) — nhia.gov.ng

Education:
- FMOE (Federal Ministry of Education) — education.gov.ng
- NUC (National Universities Commission) — nuc.edu.ng
- NBTE (National Board for Technical Education) — nbte.gov.ng
- JAMB (Joint Admissions and Matriculation Board) — jamb.gov.ng

Identity & Civil Registration:
- NIMC (National Identity Management Commission) — nimc.gov.ng
- NPC (National Population Commission) — population.gov.ng

Justice & Legal:
- NJC (National Judicial Council) — njc.gov.ng
- SCN (Supreme Court of Nigeria) — supremecourt.gov.ng
- FMJ (Federal Ministry of Justice) — justice.gov.ng

Infrastructure & Transport:
- FMW (Federal Ministry of Works) — works.gov.ng
- NPA (Nigerian Ports Authority) — nigerianports.gov.ng
- NIMASA (Nigerian Maritime Administration) — nimasa.gov.ng
- NCAA (Nigerian Civil Aviation Authority) — ncaa.gov.ng
- NRC (Nigerian Railway Corporation) — nrc.gov.ng

Communications & Technology:
- NCC (Nigerian Communications Commission) — ncc.gov.ng
- NITDA (National Information Technology Development Agency) — nitda.gov.ng

Agriculture:
- FMARD (Federal Ministry of Agriculture) — fmard.gov.ng

For each agency create a database record with: name, acronym,
category, portal_domain, portal_url (recruitment subdomain if known,
otherwise main domain /careers or /recruitment), status defaulting
to "online", vetted_score defaulting to 85. Generate a migration
and run it. Then create a management command called
`python manage.py seed_agencies` that runs this seeding so it
can be re-run safely (use get_or_create to avoid duplicates).
```

---

### PROMPT 12 — Configure CORS and API settings

```
Configure this Django project so the API can be called from the
frontend (which runs on a different domain on Vercel).

1. Install django-cors-headers if not already installed
2. Add it to INSTALLED_APPS and MIDDLEWARE in settings.py
3. Set CORS_ALLOWED_ORIGINS to include:
   - http://localhost:3000
   - http://localhost:8081
   - https://govalert-henna.vercel.app
   - Any other Vercel preview URLs using CORS_ALLOWED_ORIGIN_REGEXES

4. Set the API base URL as an environment variable:
   FRONTEND_URL=https://govalert-henna.vercel.app

5. Add /api/v1/ to urlpatterns in the main urls.py, routing to
   a new api/urls.py file that includes all endpoint routers.

6. Add DEFAULT_AUTHENTICATION_CLASSES and DEFAULT_PERMISSION_CLASSES
   to DRF settings so public endpoints (jobs, agencies, status) do
   not require authentication. The dashboard/saved jobs endpoints
   will require authentication later.

7. Add response compression and set Cache-Control headers on
   list endpoints to cache for 5 minutes.
```

---

## GROUP 3 — CONNECT FRONTEND TO REAL API
**Do this after the API is live and tested.**

---

### PROMPT 13 — Create API client module

```
Create a centralized API client module in the frontend codebase.
This should be a single file that all components import from when
they need data. It should:

1. Read the API base URL from an environment variable:
   NEXT_PUBLIC_API_URL (or whatever the framework uses)
   Default to http://localhost:8000/api/v1 in development

2. Export these async functions:

   getAgencies(params?)       → GET /api/v1/agencies/
   getAgency(slug)            → GET /api/v1/agencies/{slug}/
   getJobs(params?)           → GET /api/v1/jobs/
   getJob(ref)                → GET /api/v1/jobs/{ref}/
   getSystemStatus()          → GET /api/v1/status/
   getLiveFeed()              → GET /api/v1/status/live-feed/

3. Each function should handle errors gracefully — if the API is
   unreachable, return null rather than crashing the page.

4. Add a 10-second timeout to every request.

5. For getLiveFeed() and getSystemStatus(), add a polling helper
   that calls the function every 60 seconds and returns a cleanup
   function to stop polling when the component unmounts.

Do not change any existing component yet. Just create this module.
```

---

### PROMPT 14 — Replace homepage mock data with real API

```
Update the homepage to use real data from the API client instead
of hardcoded mock data. Make these specific changes:

1. STATUS BAR — Replace hardcoded "8 Online, 3 Maintenance, 3 Down"
   with real data from getSystemStatus(). Show:
   "● {agencies_online} Online  ◐ {agencies_maintenance} Maintenance
   ○ {agencies_offline} Offline  ·  {changes_detected_today} changes today
   ·  Last audit {last_audit_at relative time}"

2. LIVE FEED — Replace the 4 hardcoded feed items with real data
   from getLiveFeed(). Poll every 60 seconds. Show loading state
   while first fetch is in progress (skeleton rows).

3. LATEST VERIFIED RECRUITMENTS — Replace mock job cards with real
   data from getJobs({ordering: 'detected', page: 1}). Show first
   6 results. Show a skeleton loader while loading.

4. PORTAL HEALTH SECTION — Replace the 8 hardcoded agency cards
   with real data from getAgencies(). Show all agencies, not just 8.
   Sort by status (online first, then maintenance, then offline).

5. Add error state for each section: if the API returns null, show
   a subtle inline message ("Could not load latest data") rather
   than crashing or showing empty space.

Do not change layout, styling, or component structure. Only replace
the data source.
```

---

### PROMPT 15 — Replace jobs page mock data with real API

```
Update the jobs page (/jobs) to fetch real data from the API.

1. On page load, call getJobs() with default params and display
   the results. Replace all hardcoded job arrays.

2. Wire up the filter dropdowns to the API:
   - Agency dropdown: populate options from getAgencies()
     (agency name + acronym)
   - Category dropdown: use the fixed category list from the
     41 agencies (Security, Finance, Health, Education, etc.)
   - Status dropdown: Verified, Urgent, Updating, Closed, New Opening
   - Location dropdown: Nigerian states

3. When any filter changes, call getJobs() with the new params
   and update the displayed results. Do not reload the page.

4. Wire up the search input: on submit or Enter key, call
   getJobs({search: inputValue}) and update results.

5. Wire up pagination: call getJobs({page: N}) when the user
   clicks a page number. Scroll to top of results on page change.

6. Show a skeleton loader (same card shape, gray animated blocks)
   while data is loading. Show "No verified listings found" with
   a brief message if results are empty.

7. Show the real result count: "Showing {count} verified listings"
   using the total count from the API response.
```

---

### PROMPT 16 — Replace agencies page mock data with real API

```
Update the agencies page (/agencies) to use real data.

1. Fetch all 41 agencies from getAgencies() and display them.
   Replace all hardcoded agency data.

2. Add category filter tabs above the agency grid using the
   real category names from the API. Clicking a tab filters
   agencies by that category without a page reload.

3. Each agency card should show: acronym chip, online/offline/
   maintenance status dot, full name, description (2 lines),
   active recruitments count, tracked campaigns count,
   last checked time (relative, e.g. "4m ago").

4. Sort agencies: online first, then maintenance, then offline.
   Within each group, sort alphabetically by name.

5. Show agency count in the page header badge:
   "VETTING {total} ACTIVE GOVERNMENT REGISTRIES"
   using the real total from the API.

6. Add a search input that filters the displayed agencies by name
   or acronym as the user types (client-side filtering is fine
   since all agencies are loaded at once).
```

---

### PROMPT 17 — Update job detail page to use real API

```
Update the job detail page (/jobs/{ref}) to fetch real data.

1. Use the ref from the URL to call getJob(ref) and populate
   all sections with real data:
   - Job title, agency, deadline, category, location, positions
   - Confidence score and confidence factors breakdown
   - Source URL and last monitored timestamp
   - Detection timeline entries
   - Recruitment details and requirements
   - Portal status section
   - Related jobs section

2. If getJob(ref) returns null (job not found or API error),
   show a "Recruitment not found" page with:
   - Message: "We could not find this recruitment. It may have
     been removed or the reference is incorrect."
   - Button: "Browse verified jobs →"

3. The breadcrumb should show: Home → Jobs → {job title truncated
   to 30 chars}

4. The page title tag should be:
   "{job title} | {agency name} | GovAlert"

5. Show a skeleton loader for each section while loading.
   The confidence and timeline sections take longer to load —
   show them with a subtle "Loading verification data..." state.

6. If confidence_score is below 70, show the uncertainty state:
   amber warning box, "Review Recommended" text, and a message
   explaining what checks did not pass.
```

---

### PROMPT 18 — Update agency profile page to use real API

```
Update the agency profile page (/agencies/{slug}) to fetch real data.

1. Use the slug from the URL to call getAgency(slug) and populate:
   - Agency name, acronym, description, portal URL
   - Status indicator and monitoring metrics
   - Active recruitments list (call getJobs({agency: slug}))
   - Recruitment history timeline
   - Portal health section (response time, uptime, last 10 checks)
   - Verification track record

2. The "last 10 checks" display should show 10 dots:
   ● for successful checks (green), ○ for failed checks (red).
   Use the last_10_checks boolean array from the API.

3. If the agency is currently offline, show a prominent notice:
   amber background box at the top of the page:
   "Portal Offline — We cannot verify new listings from this
   agency until the portal comes back online. Monitoring continues
   every 15 minutes."

4. If getAgency(slug) returns null (agency not found), show:
   "Agency not found" message + "Browse all agencies →" button.

5. The page title tag:
   "{agency name} Recruitment Portal | GovAlert"

6. The breadcrumb: Home → Agencies → {agency acronym}
```

---

## GROUP 4 — NEW PAGES
**Build these after the API connection is stable.**

---

### PROMPT 19 — Build the Sign In page

```
Build a sign in page at /login (or /sign-in — use whichever route
already exists in the nav).

Layout: centered single column, max-width 400px, vertically centered
on the page. Clean, no decoration.

Structure (top to bottom):
1. GovAlert logo (same component used in navbar)
2. Heading: "Sign in to GovAlert" — IBM Plex Sans 22px 600
3. Subtext: "Save jobs and receive personalised alerts."
   — 14px, secondary color
4. Email input: label "Email", 48px height, 8px border-radius,
   1px border, green outline on focus
5. Password input: label "Password", same styling, show/hide
   toggle button on the right side of the input
6. "Sign in" button: full width, filled green (#0a5c38), 48px
   height, white text, IBM Plex Sans 14px 600
7. "Forgot password?" — 13px green link, right-aligned
8. Thin divider with "or" text centered
9. "Continue with Google" — full width outline button, Google
   icon on the left (use simple SVG), same height as sign in button
10. "Don't have an account? Create one" — 13px centered link

No background images. No gradient. No decorative elements.
Page background matches the site's warm off-white (#f5f3ef).
The form sits on a white card with 1px border and 8px radius.
Card padding: 32px.
```

---

### PROMPT 20 — Build the System Status page

```
Build a system status page at /status.

This page shows the real operational status of the GovAlert
monitoring system. Fetch data from getSystemStatus() and
getLiveFeed(). Poll both every 60 seconds.

Page structure:

1. Header section:
   - Overline: "SYSTEM STATUS" (mono 11px)
   - Heading: "GovAlert Monitoring Status"
   - Status indicator: large colored dot + "All systems operational"
     (green) or "Degraded performance" (amber) or "System offline" (red)
   - "Last updated: {relative time}"

2. Today's metrics — 4 stat cards in a row:
   - Total checks today: {number}
   - Successful: {number} ({percentage}%)
   - Failed: {number}
   - Changes detected: {number}

3. Agency status grid — show all 41 agencies:
   Each row: agency acronym | agency name | status dot | last checked
   Group by status: Online first, then Maintenance, then Offline
   Add section labels for each group with counts

4. Live monitoring feed:
   Last 10 monitoring events from getLiveFeed()
   Each entry: mono timestamp | agency name | event badge
   Auto-updates every 60 seconds, new entries slide in from top

5. Monitoring configuration box:
   - Monitoring interval: every 15 minutes
   - Total agencies: 41
   - Coverage: Federal MDAs across all sectors

Use IBM Plex Mono for all numbers, timestamps, and technical data.
```

---

## GROUP 5 — DESIGN IMPLEMENTATION
**After data is real and pages are connected. Final polish.**

---

### PROMPT 21 — Implement IBM Plex Sans + IBM Plex Mono

```
Replace all fonts in the project with the IBM Plex family.

1. Install or import from Google Fonts:
   - IBM Plex Sans: weights 400, 500, 600, 700
   - IBM Plex Mono: weights 400, 500

2. Set IBM Plex Sans as the default font for all text:
   body, headings, nav, cards, buttons, inputs, everything.

3. Set IBM Plex Mono ONLY for these specific cases:
   - Elements with class "mono" or "font-mono"
   - REF numbers (REF: 8829-GA)
   - Timestamps and relative times
   - System metrics (success rate, checks count, response time)
   - Confidence score calculation breakdowns
   - Detection timeline timestamps
   - Monitoring interval labels
   - All technical codes and IDs

4. Remove any remaining references to Instrument Serif, Georgia,
   serif fonts, or any other font that is not IBM Plex Sans or
   IBM Plex Mono.

5. Update the tailwind.config.js (or equivalent CSS config) to
   set IBM Plex Sans as fontFamily.sans and IBM Plex Mono as
   fontFamily.mono.

6. Verify: the hero headline on the homepage should now be fully
   IBM Plex Sans — no italic, no serif, no mixed fonts.
```

---

### PROMPT 22 — Implement the full color token system

```
Replace all color values in the project with a custom design token
system. Update tailwind.config.js (or the CSS variables file) with:

CSS variables:
--green-primary:     #0a5c38
--green-hover:       #08472d
--green-accent:      #3fb68e
--green-tint:        #f0faf6
--green-nigeria:     #006b3c

--bg-page-light:     #f5f3ef
--bg-page-dark:      #0c1015
--bg-card-light:     #ffffff
--bg-card-dark:      #141a20
--bg-elevated-dark:  #1a2230

--text-primary-light:   #141414
--text-secondary-light: #5a6370
--text-primary-dark:    #e8edf2
--text-secondary-dark:  #8b9aad

--border-light:      #e2ddd6
--border-dark:       #242c38

--status-verified:   #0a5c38
--status-urgent:     #b45309
--status-new:        #0e6b8a
--status-updating:   #3b4bbf
--status-closed-bg:  #e5e7eb
--status-closed-text:#6b7280

--gold:              #c8960c
--error:             #b91c1c

After setting the tokens, do a find-and-replace sweep:
- Replace any #22c55e or emerald-500 green with --green-primary
- Replace any #1e40af navy with --green-primary where it is used
  as a primary action color
- Replace any pure white #ffffff page backgrounds with --bg-page-light
- Replace any pure black #000000 or #0f172a page backgrounds with
  --bg-page-dark
- Replace any hardcoded text colors with the token equivalents

Do not change component structure, only color values.
```

---

### PROMPT 23 — Add the 3px Nigerian green brand line

```
Add a 3px solid horizontal line in color #006b3c at the very top
of every page, above the navbar. This should be the first visible
element on every page including mobile.

Implementation:
- Add it to the root layout component so it appears on every route
- It should be position: fixed at the top, or part of the layout
  before the navbar
- Width: 100vw
- Height: 3px
- Background: #006b3c
- z-index: above everything else
- Should not scroll away — it stays fixed at the top

This is the brand mark. It must appear on every page, every
viewport size. Do not remove it in any responsive breakpoint.
```

---

### PROMPT 24 — Implement card hover animations

```
Add hover animations to all interactive cards on the site.
This includes: job cards, agency portal cards, agency directory
cards, related job cards on the detail page, and saved job cards
on the dashboard.

For each card:
- Add transition: transform 200ms ease, box-shadow 200ms ease
- On hover: transform translateY(-2px)
- On hover: box-shadow 0 6px 16px rgba(0, 0, 0, 0.10) in light mode
- On hover: box-shadow 0 6px 16px rgba(0, 0, 0, 0.30) in dark mode
- cursor: pointer if the card is clickable (links to detail page)

For the status live pulse dot (the green dot next to "LIVE" labels):
Add this CSS animation:
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(10, 92, 56, 0.5); }
  70%  { box-shadow: 0 0 0 6px rgba(10, 92, 56, 0); }
  100% { box-shadow: 0 0 0 0 rgba(10, 92, 56, 0); }
}
Apply animation: pulse 2s infinite to every status live dot.

For buttons:
- Hover: background darken by 10% (use filter: brightness(0.9))
- Active/click: transform scale(0.98)
- Transition: all 150ms ease

Do not add any other animations. No floating, no fading on load,
no scroll animations. Only these hover effects.
```

---

### PROMPT 25 — Final mobile audit and fixes

```
Do a complete mobile responsiveness audit across all pages.
Test at 375px width (iPhone SE size — the minimum).

Fix these specific things if they are broken:

1. Homepage:
   - Hero headline should be 36px on mobile (not larger)
   - Buttons should be full width on mobile
   - Search bar should be full width
   - Quick tags should horizontal-scroll, not wrap to multiple lines
   - Status bar text should wrap cleanly or scroll
   - Job cards: single column, full width

2. Jobs page:
   - Filter dropdowns: 2x2 grid layout on mobile (not 4 in a row)
   - Search bar: full width

3. Agencies page:
   - Category filter tabs: horizontal scroll on mobile
   - Agency cards: single column

4. Job detail page:
   - Metadata grid: 2 columns (not 3 or 4 inline)
   - Confidence factors list: full width
   - Detection timeline: left mono timestamp above or beside event

5. Agency profile page:
   - Metrics row: 2x3 grid instead of 6 inline
   - Recruitment history: full width list
   - Last 10 checks dots: should wrap if needed

6. Footer:
   - Single column on mobile
   - Logo and tagline at top
   - Link columns stacked vertically
   - Copyright and systems operational stacked

7. All pages: minimum tap target size for any button or link
   is 44px height. Increase any that are smaller.
```

---

## EXECUTION ORDER SUMMARY

```
Week 1:
  Day 1-2:  Prompts 1-6   (Bug fixes — live site)
  Day 3-4:  Prompts 7-12  (Django API)
  Day 5:    Prompts 13    (API client module)

Week 2:
  Day 1-2:  Prompts 14-16 (Homepage + Jobs + Agencies connected)
  Day 3-4:  Prompts 17-18 (Detail pages connected)
  Day 5:    Prompts 19-20 (Sign in + Status pages)

Week 3:
  Day 1-2:  Prompts 21-23 (Fonts + Colors + Brand line)
  Day 3:    Prompts 24    (Animations)
  Day 4-5:  Prompt 25     (Mobile audit)
```

---

*25 prompts total. Each is paste-ready for Claude Code, Cursor, or any AI coding tool.*
*Run Prompt 7 (model inspection) before any other backend prompt.*
*Do not run Group 3 prompts until Group 2 API is live and tested.*
