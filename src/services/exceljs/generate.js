import fs from "node:fs";
import path from "node:path";

import ExcelJS from "exceljs";

export async function generate(writeStream, templateName = "template01.xlsx") {
  const tempFilePath = path.join(process.cwd(), "assets", templateName);
  const stream = fs.createReadStream(tempFilePath);

  try {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.read(stream);

    const workbookResult = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: writeStream,
      useSharedStrings: false,
      useStyles: true,
    });

    workbook.eachSheet((worksheet) => {
      const worksheetResult = workbookResult.addWorksheet(worksheet.name, {
        headerFooter: worksheet.headerFooter,
        pageSetup: worksheet.pageSetup,
        properties: worksheet.properties,
        state: worksheet.state,
        views: worksheet.views,
      });

      worksheet.columns.forEach((column, index) => {
        const col = worksheetResult.getColumn(index + 1);

        col.width = column.width;
      });

      if (worksheet.autoFilter) { worksheetResult.autoFilter = worksheet.autoFilter; }

      Object.keys(worksheet._merges).forEach((mergeKey) => {
        const mergeRange = worksheet._merges[mergeKey];

        worksheetResult.mergeCells(mergeRange);
      });

      worksheet.eachRow((row, rowNumber) => {
        const newRow = worksheetResult.getRow(rowNumber);

        Object.assign(newRow, row);

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => { Object.assign(newRow.getCell(colNumber), cell); });

        newRow.commit();
      });

      worksheetResult.commit();
    });

    await workbookResult.commit();
  } finally {
    stream.destroy();
  }
}
