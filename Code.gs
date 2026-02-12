
/**
 * Backend for "مسابقات على سيرة كتاب" - مكتب الغربية
 * Target Tabs: 
 * - land_hypocrisy, nile_chitchat, madoline, november_days
 * - results_tracking
 * - admin_access
 */

function doGet(e) {
  if (e.parameter.action) {
    const action = e.parameter.action;
    let result = null;
    try {
      if (action === 'getQuestions') {
        result = getExamData(e.parameter.tab);
      } else if (action === 'getParticipants') {
        result = getParticipants();
      } else if (action === 'adminLogin') {
        result = { success: adminAuth(e.parameter.user, e.parameter.pass) };
      }
      return ContentService.createTextOutput(JSON.stringify(result || { error: 'Unknown Action' }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('مسابقات على سيرة كتاب - الغربية')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    if (payload.action === 'submitResult' || payload.fullName) {
      const success = submitResults(payload);
      return ContentService.createTextOutput(JSON.stringify({ success: success }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getExamData(tabName) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const tab = sheet.getSheetByName(tabName);
    if (!tab) return [];
    const data = tab.getDataRange().getValues();
    if (data.length <= 1) return [];
    const questions = data.slice(1).map(function(row) {
      return {
        text: row[0],
        options: [row[1], row[2], row[3], row[4]],
        correctAnswer: String(row[5]),
        points: Number(row[6]) || 2.5
      };
    });
    return questions.slice(0, 40); // Mandate 40 questions
  } catch (e) {
    return [];
  }
}

function submitResults(payload) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const tab = sheet.getSheetByName('results_tracking');
    if (!tab) return false;
    const d = payload;
    tab.appendRow([
      new Date(),
      d.fullName,
      "'" + String(d.nationalId),
      "'" + String(d.phone),
      d.center,
      d.scores?.[0]?.mcqScore || 0,
      d.scores?.[1]?.mcqScore || 0,
      d.totalScore,
      d.essay || "",
      d.registrationDate || ""
    ]);
    return true;
  } catch (e) {
    return false;
  }
}

function adminAuth(user, pass) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const tab = sheet.getSheetByName('admin_access');
    if (!tab) return false;
    const data = tab.getDataRange().getValues();
    return data.some(function(row) {
      return String(row[0]).trim() === String(user).trim() && String(row[1]).trim() === String(pass).trim();
    });
  } catch (e) {
    return false;
  }
}

function getParticipants() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const tab = sheet.getSheetByName('results_tracking');
    if (!tab) return [];
    const data = tab.getDataRange().getValues();
    if (data.length <= 1) return [];
    return data.slice(1).map(function(row, idx) {
      return {
        id: "p_" + idx,
        fullName: row[1],
        nationalId: row[2],
        phone: row[3],
        center: row[4],
        totalScore: Number(row[7]) || 0,
        scores: {},
        selectedBooks: [], 
        registrationDate: row[0],
        status: 'completed'
      };
    });
  } catch (e) {
    return [];
  }
}
