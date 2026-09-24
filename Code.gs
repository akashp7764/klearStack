/**
 * Hexanovate Round 2 — Google Apps Script web app
 * Handles: lead -> Sheet row + notification email; slots -> free calendar slots; book -> calendar event.
 * Bind this script to the Google Sheet (Extensions > Apps Script) so getActiveSpreadsheet() works.
 * Script Properties required: SHARED_SECRET (same value as APPS_SCRIPT_SECRET in Vercel).
 */
const SHEET_NAME = 'Leads';
const NOTIFY_EMAIL = 'ai-labs@hexanovate.com'; // change to your own email ONLY while testing locally, then change back + redeploy
const TZ = 'Asia/Kolkata';
const SLOT_MINUTES = 30;
const DAY_START_HOUR = 10;  // 10:00 IST
const DAY_END_HOUR = 18;    // last slot starts 17:30
const WORKING_DAYS_AHEAD = 5;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (!secret || body.secret !== secret) return json_({ ok: false, error: 'unauthorized' });
    switch (body.action) {
      case 'lead':  return json_(handleLead_(body.data || {}));
      case 'slots': return json_(handleSlots_());
      case 'book':  return json_(handleBook_(body.data || {}));
      default:      return json_({ ok: false, error: 'unknown_action' });
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Prevent spreadsheet formula injection: values starting with = + - @ are stored as text.
function safeCell_(v) {
  if (v === null || v === undefined) return '';
  const s = String(v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function esc_(v) {
  return String(v === undefined || v === null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function handleLead_(d) {
  const fields = d.fields || {};
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    const fixed = ['Timestamp (IST)', 'Lead ID', 'CRM Status'];
    if (sh.getLastRow() === 0) sh.appendRow(fixed.concat(Object.keys(fields)));
    const header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    Object.keys(fields).forEach(function (k) {
      if (header.indexOf(k) === -1) { header.push(k); sh.getRange(1, header.length).setValue(k); }
    });
    const ts = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');
    const row = header.map(function (h) {
      if (h === 'Timestamp (IST)') return ts;
      if (h === 'Lead ID') return safeCell_(d.leadId);
      if (h === 'CRM Status') return safeCell_(d.crmStatus || 'unknown');
      return safeCell_(fields[h]);
    });
    sh.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  let emailStatus = 'ok';
  try {
    const crmFailed = d.crmStatus && d.crmStatus !== 'ok';
    const rows = Object.keys(fields).map(function (k) {
      return '<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">' + esc_(k) +
             '</td><td style="padding:6px 12px;border:1px solid #ddd">' + esc_(fields[k]) + '</td></tr>';
    }).join('');
    const html =
      (crmFailed ? '<p style="color:#b00020;font-weight:700">⚠ CRM SYNC FAILED — please add this lead to HubSpot manually.</p>' : '') +
      '<p>New enquiry received from the Hexanovate landing page.</p>' +
      '<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' + rows +
      '<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">Lead ID</td><td style="padding:6px 12px;border:1px solid #ddd">' + esc_(d.leadId) + '</td></tr>' +
      '</table>';
    const subject = (crmFailed ? '[CRM FAILED] ' : '') + 'New enquiry: ' +
      String(fields.firstName || fields.name || '') + ' ' + String(fields.lastName || '') +
      (fields.company ? ' — ' + fields.company : '');
    MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: subject.replace(/[\r\n]/g, ' ').slice(0, 200), htmlBody: html, replyTo: fields.email || undefined });
  } catch (err) {
    console.error('email_failed', err);
    emailStatus = 'failed';
  }
  return { ok: true, email: emailStatus };
}

function slotStart_(dateStr, hour, minute) {
  return Utilities.parseDate(dateStr + ' ' + ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2), TZ, 'yyyy-MM-dd HH:mm');
}

function handleSlots_() {
  const cal = CalendarApp.getDefaultCalendar();
  const now = new Date();
  const earliest = new Date(now.getTime() + 60 * 60 * 1000); // at least 1h notice
  const days = [];
  let cursor = new Date(now.getTime());
  let guard = 0;
  while (days.length < WORKING_DAYS_AHEAD && guard < 14) {
    guard++;
    const dateStr = Utilities.formatDate(cursor, TZ, 'yyyy-MM-dd');
    const dow = Number(Utilities.formatDate(cursor, TZ, 'u')); // 1=Mon..7=Sun
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
    if (dow > 5) continue;
    const dayStart = slotStart_(dateStr, DAY_START_HOUR, 0);
    const dayEnd = slotStart_(dateStr, DAY_END_HOUR, 0);
    const events = cal.getEvents(dayStart, dayEnd);
    const slots = [];
    for (let t = dayStart.getTime(); t + SLOT_MINUTES * 60000 <= dayEnd.getTime(); t += SLOT_MINUTES * 60000) {
      const s = new Date(t), e = new Date(t + SLOT_MINUTES * 60000);
      if (s < earliest) continue;
      const busy = events.some(function (ev) { return ev.getStartTime() < e && ev.getEndTime() > s; });
      if (!busy) slots.push(s.toISOString());
    }
    days.push({ date: dateStr, label: Utilities.formatDate(dayStart, TZ, 'EEE, d MMM'), slots: slots });
  }
  return { ok: true, timezone: TZ, days: days };
}

function isValidSlot_(start) {
  const mins = Number(Utilities.formatDate(start, TZ, 'm'));
  const hour = Number(Utilities.formatDate(start, TZ, 'H'));
  const dow = Number(Utilities.formatDate(start, TZ, 'u'));
  return dow <= 5 && mins % SLOT_MINUTES === 0 && start.getSeconds() === 0 &&
         hour >= DAY_START_HOUR && (hour * 60 + mins + SLOT_MINUTES) <= DAY_END_HOUR * 60;
}

function handleBook_(d) {
  const start = new Date(d.start);
  if (isNaN(start.getTime())) return { ok: false, error: 'invalid_slot' };
  if (start.getTime() < Date.now() + 30 * 60000) return { ok: false, error: 'slot_in_past' };
  if (!isValidSlot_(start)) return { ok: false, error: 'invalid_slot' };
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return { ok: false, error: 'invalid_email' };
  const end = new Date(start.getTime() + SLOT_MINUTES * 60000);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const cal = CalendarApp.getDefaultCalendar();
    if (cal.getEvents(start, end).length > 0) return { ok: false, error: 'slot_taken' };
    const name = String(d.name || 'Lead').replace(/[\r\n]/g, ' ').slice(0, 100);
    const ev = cal.createEvent('Hexanovate discovery call — ' + name, start, end, {
      description: 'Booked via Hexanovate landing page. Lead ID: ' + String(d.leadId || ''),
      guests: d.email,
      sendInvites: true
    });
    return { ok: true, eventId: ev.getId(), start: start.toISOString(), end: end.toISOString() };
  } finally {
    lock.releaseLock();
  }
}

/** Run this ONCE from the editor to grant Sheets + Mail + Calendar permissions. */
function setup() {
  SpreadsheetApp.getActiveSpreadsheet().getName();
  CalendarApp.getDefaultCalendar().getName();
  MailApp.getRemainingDailyQuota();
  Logger.log('Authorised. Now set Script Property SHARED_SECRET and deploy as web app.');
}
