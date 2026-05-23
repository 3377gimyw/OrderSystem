var MENU_NAMES = [
  "감자튀김",
  "치킨너겟",
  "모듬소시지",
  "골뱅이무침",
  "라면",
  "볶음밥",
];

var STAFF_SECRET = "CHANGE_ME";
var ADMIN_SECRET = "garden2026@";
var SOLD_OUT_KEY = "soldOut.items";

function resetKey(table) {
  return "reset." + table;
}

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
    var data = JSON.parse(e.postData.contents);

    if (data.action === "reset") {
      return handleReset(data);
    }

    if (data.action === "adminReset") {
      return handleAdminReset(data);
    }

    if (data.action === "setSoldOut") {
      return handleSetSoldOut(data);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var timestamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

    // OrderID column is the last column: timestamp, table, ...menu, total, status, orderId
    var ID_COL = MENU_NAMES.length + 6;
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

    var row = [timestamp, data.tableNumber, data.depositorName || ""];
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

function handleReset(data) {
  if (data.secret !== STAFF_SECRET) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: "인증 실패" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var table = parseInt(data.table, 10);
  if (isNaN(table) || table < 1 || table > 48) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: "invalid table" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  PropertiesService.getScriptProperties().setProperty(
    resetKey(table),
    String(lastRow)
  );

  return ContentService.createTextOutput(
    JSON.stringify({ result: "success", resetAtRow: lastRow })
  ).setMimeType(ContentService.MimeType.JSON);
}

function handleAdminReset(data) {
  if (data.secret !== ADMIN_SECRET) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: "인증 실패" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var table = parseInt(data.table, 10);
  if (isNaN(table) || table < 1 || table > 48) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: "invalid table" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  PropertiesService.getScriptProperties().setProperty(
    resetKey(table),
    String(lastRow)
  );

  return ContentService.createTextOutput(
    JSON.stringify({ result: "success", resetAtRow: lastRow })
  ).setMimeType(ContentService.MimeType.JSON);
}

function handleSetSoldOut(data) {
  if (data.secret !== ADMIN_SECRET) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: "인증 실패" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var ids = Array.isArray(data.soldOutIds) ? data.soldOutIds : [];
  PropertiesService.getScriptProperties().setProperty(
    SOLD_OUT_KEY,
    JSON.stringify(ids)
  );

  return ContentService.createTextOutput(
    JSON.stringify({ result: "success" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};

  if (params.action === "soldOut") {
    var raw = PropertiesService.getScriptProperties().getProperty(SOLD_OUT_KEY);
    var ids = raw ? JSON.parse(raw) : [];
    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", soldOutIds: ids })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var tableParam = params.table || null;
  if (!tableParam) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var table = parseInt(tableParam, 10);
  if (isNaN(table) || table < 1 || table > 48) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: "invalid table" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return ContentService.createTextOutput(
        JSON.stringify({ result: "success", orders: [] })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var resetRowRaw = PropertiesService.getScriptProperties().getProperty(
      resetKey(table)
    );
    var resetRow = resetRowRaw ? parseInt(resetRowRaw, 10) : 0;

    // Read all data rows: timestamp, table, ...menu, total, status, orderId
    var totalCols = MENU_NAMES.length + 6;
    var values = sheet.getRange(2, 1, lastRow - 1, totalCols).getValues();
    var orders = [];

    for (var i = values.length - 1; i >= 0 && orders.length < 30; i--) {
      var sheetRowIndex = i + 2; // values[0] is sheet row 2
      if (sheetRowIndex <= resetRow) continue;
      var row = values[i];
      if (Number(row[1]) !== table) continue;

      var items = [];
      for (var j = 0; j < MENU_NAMES.length; j++) {
        var qty = row[3 + j];
        if (qty !== "" && qty != null && Number(qty) > 0) {
          items.push({ name: MENU_NAMES[j], quantity: Number(qty) });
        }
      }

      orders.push({
        orderId: String(row[3 + MENU_NAMES.length + 2] || ""),
        timestamp: String(row[0] || ""),
        items: items,
        totalPrice: Number(row[3 + MENU_NAMES.length] || 0),
        status: String(row[3 + MENU_NAMES.length + 1] || ""),
      });
    }

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", orders: orders })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
