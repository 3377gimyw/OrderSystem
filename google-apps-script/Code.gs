function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var timestamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    var tableNumber = data.tableNumber;
    var totalPrice = data.totalPrice;

    data.items.forEach(function (item) {
      sheet.appendRow([
        timestamp,
        tableNumber,
        item.name,
        item.quantity,
        item.price,
        item.price * item.quantity,
        "신규",
      ]);
    });

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
