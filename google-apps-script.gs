const SPREADSHEET_ID = "1Nx6nQejMmLeRw2GiVHUuyIwpfqAzh26H28VD1irxy5A";
const SHEET_NAME = "Ответы гостей";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.guests || "",
      data.alcohol || "Не указано",
      data.attendance || ""
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Wedding RSVP endpoint is working");
}
