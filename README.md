# Custody Expenses — Vercel + Google Apps Script

## Backend
1. Put `Code.gs` in the Google Apps Script project connected to the target Sheet.
2. Set `SHEET_ID`, `CFG.ADMIN_PIN`, and `CFG.API_SECRET`.
3. Run `setup()` once.
4. Deploy as Web app: Execute as **Me**, Who has access: **Anyone**.
5. Every time `Code.gs` changes, create a **new deployment version** and use its `/exec` URL.

## Vercel
Set environment variables:
- `GAS_WEB_APP_URL` = latest Apps Script `/exec` URL
- `GAS_API_SECRET` = exactly the same value as `CFG.API_SECRET`

Redeploy after changing environment variables.

## Sheet structure
### Config
A Engineer Name | B PIN | C Custody Limit | D Active | E PIN Generated At

### Expenses
A ID | B Submitted | C Engineer | D Date | E Amount | F Category | G Project | H Description | I Receipt | J PM status | K Finance status | L Flag | M Transfer Status | N Transfer Date | O Transfer Reference

An expense becomes available for transfer only when **PM status = Approved** and **Finance status = Approved**. Admin can download a grouped transfer CSV, then mark selected expenses as Transferred.

## Important
Keep `Code.gs` private. Do not publish `ADMIN_PIN` or `API_SECRET` in a public GitHub repository.
