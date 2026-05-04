var MENU_NAMES = [
  "감자튀김",
  "치킨너겟",
  "모듬소시지",
  "골뱅이무침",
  "라면",
  "볶음밥",
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: "서버 혼잡, 잠시 후 다시 시도" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

    // OrderID column is the last column: timestamp, table, ...menu, total, status, orderId
    var ID_COL = MENU_NAMES.length + 5;
    var lastRow = sheet.getLastRow();
    if (data.orderId && lastRow > 1) {
      var startRow = Math.max(2, lastRow - 99);
      var ids = sheet
        .getRange(startRow, ID_COL, lastRow - startRow + 1, 1)
        .getValues();
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] === data.orderId) {
          return ContentService.createTextOutput(
            JSON.stringify({ result: "success", duplicate: true })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    var qtyByName = {};
    data.items.forEach(function (item) {
      qtyByName[item.name] = item.quantity;
    });

    var row = [timestamp, data.tableNumber];
    MENU_NAMES.forEach(function (name) {
      row.push(qtyByName[name] != null ? qtyByName[name] : "");
    });
    row.push(data.totalPrice, "신규", data.orderId || "");
    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ result: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
