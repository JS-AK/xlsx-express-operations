import fs from "node:fs";
import path from "node:path";

import ExcelJS from "exceljs";

export async function xlsxRead() {
  const tempFilePath = path.join(process.cwd(), "assets", "template01.xlsx");
  const stream = fs.createReadStream(tempFilePath);

  try {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.read(stream);
  } finally {
    stream.destroy();
  }
}
