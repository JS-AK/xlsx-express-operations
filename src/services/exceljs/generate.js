import fs from "node:fs";
import path from "node:path";

import ExcelJS from "exceljs";

const excels = new Map();

async function getActualWorkbook(templateName) {
  const exists = excels.get(templateName);

  if (exists) return exists;

  const workbook = new ExcelJS.Workbook();

  const tempFilePath = path.join(process.cwd(), "assets", templateName);
  const stream = fs.createReadStream(tempFilePath);

  try {
    await workbook.xlsx.read(stream);

    excels.set(templateName, workbook);

    return workbook;
  } finally {
    stream.destroy();
  }
}

export async function generate(writeStream, templateName = "template01.xlsx") {
  const workbook = await getActualWorkbook(templateName);

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
      Object.assign(worksheetResult.getColumn(index + 1), column);
    });

    Object.keys(worksheet._merges).forEach((mergeKey) => {
      const mergeRange = worksheet._merges[mergeKey];

      worksheetResult.mergeCells(mergeRange);
    });

    if (worksheet.autoFilter) { worksheetResult.autoFilter = worksheet.autoFilter; }

    worksheet.eachRow(
      { includeEmpty: true },
      (row, rowNumber) => {
        const newRow = worksheetResult.getRow(rowNumber);

        Object.assign(newRow, row);

        row.eachCell(
          { includeEmpty: true },
          (cell, colNumber) => { Object.assign(newRow.getCell(colNumber), cell); },
        );

        newRow.commit();
      },
    );

    worksheetResult.commit();
  });

  await workbookResult.commit();
}
