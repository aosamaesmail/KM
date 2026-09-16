Telecomax KM Tracker — V27

Key changes in V27
1. Google Sheet structure: Solfa is now the LAST column.
   Canonical columns:
   Trip ID | Status | Engineer Name | Driver Name | Day | Date | Start | Finish | Trip | Forth&Back | Static | Area | Task | Total KM | Amount Spent | Rent | Paid By | Start Photo | Finish Photo | Started At | Finished At | Solfa
2. Existing Benzine Sheet data is migrated automatically by the backend on the first request after deployment, using the header names to reorder the columns. Unknown/missing required columns are not overwritten.
3. Admin is split into three internal tabs: Balances, Photo Audit, Solfa.
4. Admin > Solfa lets an admin select Engineer, defaults Date to today, enter Amount, and press Upload.
5. Solfa uploads are stored as dedicated rows with Status = Solfa, Engineer Name, Date and Solfa amount. This keeps Solfa transactions separate from trip records so trip counts and photo audit are not affected.
6. Balances and engineer history continue to include Solfa in received/balance calculations while only Completed/In Progress rows are treated as trips.

Deployment
- Replace/update Code.gs in the Google Apps Script project.
- Deploy a new Web App version using the same deployment URL where possible.
- The first request will normalize the Benzine Sheet column order to the V27 structure.
- Update the Vercel/frontend deployment with index.html, manifest.json, service-worker.js and icons from this package.
- Service worker cache is telecomax-km-v26.

Admin Solfa workflow
Admin > Solfa > select Engineer > Date defaults to today > enter Amount > Upload.
The backend validates the engineer against Config and requires the Admin PIN.

V27 fixes:
- Processed Rent trips are removed from the Admin Rent dropdown after a positive Rent amount is submitted.
- Rent Deduction is written directly to Google Sheets and retained after upload.
- Rent amount must be greater than zero.
- Rent trip selection resets after upload so another pending Rent trip can be selected immediately.
