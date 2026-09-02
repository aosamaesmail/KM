/**
 * Benzine KM Tracker — Google Apps Script backend
 * ------------------------------------------------
 * Deploy this as a Web App (Extensions > Apps Script in your Google Sheet).
 * See SETUP.md for full step-by-step instructions.
 */

// 1) Set this to any secret string. Put the SAME value in the app's Settings > "Sync token".
//    This stops random people from posting fake rows to your sheet if they guess the URL.
const SHARED_TOKEN = 'CHANGE-ME-TO-A-SECRET';

// 2) Sheet tab that rows get appended to. Matches the "Benzine Sheet" tab in your template.
const SHEET_NAME = 'Benzine Sheet';

// 3) Name of the Drive folder (auto-created) where dashboard photos are stored.
const PHOTO_FOLDER_NAME = 'Benzine KM Photos';

const HEADERS = [
  'Engineer Name', 'Driver Name', 'Day', 'Date', 'Start', 'Finish', 'Trip',
  'Forth&Back', 'Static', 'Area', 'Task', 'Total KM', 'Amount Spent',
  'Rent', 'Paid By', 'Solfa', 'Start Photo', 'Finish Photo', 'Submitted At'
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.token !== SHARED_TOKEN) {
      return jsonOut({ ok: false, error: 'invalid-token' });
    }

    const sheet = getOrCreateSheet();
    const folder = getOrCreatePhotoFolder();

    const dateObj = body.date ? new Date(body.date + 'T00:00:00') : new Date();
    const startPhotoUrl = body.startPhoto ? savePhoto(folder, body.startPhoto, body.engineer, body.date, 'start') : '';
    const finishPhotoUrl = body.finishPhoto ? savePhoto(folder, body.finishPhoto, body.engineer, body.date, 'finish') : '';

    sheet.appendRow([
      body.engineer || '',
      body.driver || '',
      body.day || '',
      dateObj,
      body.startKm || '',
      body.finishKm || '',
      body.trip || 0,
      body.forthBack || 0,
      body.staticKm || 0,
      body.area || '',
      body.task || '',
      body.totalKm || 0,
      body.amountSpent || 0,
      '',           // Rent — left for Finance to fill in
      body.engineer || '', // Paid By — defaults to engineer, editable by Finance
      '',           // Solfa — left for Finance to fill in
      startPhotoUrl,
      finishPhotoUrl,
      body.submittedAt || new Date().toISOString(),
    ]);

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput('Benzine KM Tracker backend is running.');
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getOrCreatePhotoFolder() {
  const it = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(PHOTO_FOLDER_NAME);
}

// dataUrl looks like: "data:image/jpeg;base64,/9j/4AAQ..."
function savePhoto(folder, dataUrl, engineer, date, label) {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return '';
  const mime = match[1];
  const bytes = Utilities.base64Decode(match[2]);
  const ext = mime.split('/')[1] || 'jpg';
  const safeEngineer = (engineer || 'unknown').replace(/[^a-z0-9]+/gi, '_');
  const fileName = `${safeEngineer}_${date || ''}_${label}_${new Date().getTime()}.${ext}`;
  const blob = Utilities.newBlob(bytes, mime, fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
