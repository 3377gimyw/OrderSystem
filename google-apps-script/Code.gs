var MENU_NAMES = [
  "감자튀김",
  "치킨너겟",
  "모듬소시지",
  "골뱅이무침",
  "라면",
  "볶음밥",
];

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

    var qtyByName = {};
    data.items.forEach(function (item) {
      qtyByName[item.name] = item.quantity;
    });

    var row = [timestamp, data.tableNumber];
    MENU_NAMES.forEach(function (name) {
      row.push(qtyByName[name] != null ? qtyByName[name] : "");
    });
    row.push(data.totalPrice, "신규");
    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ result: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
