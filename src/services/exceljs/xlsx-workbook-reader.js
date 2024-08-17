import fs from "node:fs";

import ExcelJS from "exceljs";

export async function xlsxWorkbookReader(tempFilePath) {
  const stream = fs.createReadStream(tempFilePath);

  try {
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(stream);
    const rows = [];

    for await (const worksheetReader of workbookReader) {
      for await (const row of worksheetReader) {
        rows.push(row.values);
      }
    }

    return rows;
  } finally {
    stream.destroy();
  }
}
