import ExcelJS from "exceljs";

import { generateData } from "../../helpers/index.js";

export async function xlsxWrite(stream) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  worksheet.addRow(["Name", "Age", "Email"]);

  for (const row of generateData()) {
    worksheet.addRow(row);
  }

  await workbook.xlsx.write(stream);
}
