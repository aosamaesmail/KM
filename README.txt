Telecomax KM Tracker — V35

V35 changes
1. Finance now has a separate PIN defined in Code.gs:
   const FINANCE_PIN = '2468';
   Change this value in Code.gs before deployment if needed.
2. Finance authentication is separate from Admin authentication. Finance can only use the Finance section and Finance trip/photo-audit endpoint; it cannot open Admin. Admin and Finance sessions are mutually exclusive in the same browser session.
3. Engineer Settings > Save Settings now stores Sync Token, Engineer Name, Engineer PIN, Project Name and Default Driver together. These values remain stored across refreshes until the Engineer presses Log out.
4. Engineer Log out clears the saved Token, Engineer Name, PIN, Project Name and Default Driver.
5. The Engineer Login/Log out button is now below the Driver Name field in Settings.
6. Finance has its own Login/Log out controls and session restore after refresh.

Existing V34 functionality retained
- Project selector: NSNDT, ETEGYDT, VFEGY, Huawei.
- Project-specific rates are defined in Code.gs in PROJECT_RATES; all four initially use 2.225 EGP/KM.
- Start/Finish rows store Project Name and GPS latitude/longitude for each dashboard photo.
- Admin includes Balances, Photo Audit, Solfa and Rent.
- Finance provides a separate Photo Audit view with Engineer and Month filters, photos and GPS information.
- Admin PIN remains defined in Code.gs as ADMIN_PIN = '3535'.
- Sync token is blank on fresh install and persists until Engineer Log out or the user changes it.

Google Sheet canonical columns
Trip ID | Status | Engineer Name | Driver Name | Project Name | Day | Date | Start | Finish | Trip | Forth&Back | Over Night Stay | Static | Area | Task | Total KM | Amount Spent | Rent | Paid By | Rent Deduction | Rent Deduction Driver | Total Rent + Benzine | Start Photo | Start Latitude | Start Longitude | Finish Photo | Finish Latitude | Finish Longitude | Started At | Finished At | Solfa

Deployment
- Replace/update Code.gs in the Google Apps Script project.
- Deploy a new Web App version using the same deployment URL where possible.
- Update the Vercel/frontend deployment with index.html, manifest.json, service-worker.js and icons from this package.
- Service worker cache is telecomax-km-v35.

V37 changes
- Admin and Finance authentication no longer requires the Engineer Sync Token. They authenticate directly with their PINs.
- Engineer authentication and Engineer Start/Finish/History/Open Trips still require the Sync Token + Engineer PIN.
- Added English / Arabic language selection in Settings. Arabic switches the interface to RTL.
- Language preference is stored locally and can be changed at any time.


V39 UI update: Admin and Finance logout buttons in the sidebar now use a rounded Telecomax-theme magenta treatment with bordered/pill styling, icon badges, hover state, and press feedback.


V43 FINANCE DESKTOP PORTAL
- finance.html is a dedicated desktop Finance Photo Audit portal.
- Uses the same Finance PIN and Google Apps Script financeTrips endpoint.
- No Sync Token is required for Finance login.
- Includes searchable Engineer and Driver filters, Month filter, audit KPIs, photo hide/show, GPS, and large photo preview.
- Deploy finance.html with the frontend and open /finance.html (or configure Vercel rewrite /finance -> /finance.html).


V45 FINANCE DESKTOP PHOTO AUDIT
- Replaced the extra-wide audit table with one centered audit card per trip.
- Start Photo and Finish Photo are always shown next to each other on desktop.
- Both photos use large 440px-high contain frames by default so the full image remains visible.
- Finish photo falls back to the full photo URL when no thumbnail URL is available.
- GPS remains centered below each corresponding photo.
- Hide/Show Photos and click-to-enlarge are retained.
- Mobile app layout is unchanged.
- Frontend-only change; V42/V43 backend remains compatible.


V46: Finance Desktop Portal visual theme changed to a soft light audit theme for reduced eye strain. Functionality remains based on V45.

V47: Added standalone Admin desktop portal at /admin.html with Balances, Photo Audit, Solfa and Rent.


V48 Allowance Audit
- New allowances.html responsive PM portal.
- Code.gs: set ALLOWANCE_PM_PIN to the PM PIN you want.
- Config new columns: E Engineer Base City, F Driver Base City, G Area List.
- Start Trip Area is now restricted to Area List values.
- Allowance Audit sheet is created automatically on first audit.
- Engineer: out-of-base = 80/day; if monthly distinct working days exceed 22, special weekend upgrades = working days - 22, earliest dates first, priority first Friday then Saturdays, then remaining Fridays if required.
- Driver: out-of-base Sun-Thu 50, Saturday 75, Friday 100.

V49: compact pending-only allowance audit workflow, bulk selection/approval, Final Payable removed.
