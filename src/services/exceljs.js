import { PassThrough } from "node:stream";
import fs from "node:fs";
import path from "node:path";

import ExcelJS from "exceljs";

import { generateData } from "../helpers/index.js";

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

export async function xlsxWrite(stream) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  worksheet.addRow(["Name", "Age", "Email"]);

  for (const row of generateData()) {
    worksheet.addRow(row);
  }

  await workbook.xlsx.write(stream);
}

export async function xlsxWorkbookWriter(stream, highWaterMark) {
  let streamResult = stream;

  if (highWaterMark) {
    const streamResult = new PassThrough({ highWaterMark });

    streamResult.pipe(stream);
  }

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: streamResult,
    useSharedStrings: true,
    useStyles: true,
  });

  const worksheet = workbook.addWorksheet("Sheet 1");

  worksheet.addRow(["Name", "Age", "Email"]).commit();

  const dataGenerator = generateData();
  const chunkSize = 100;

  let rowCount = 0;
  let row;

  const writeRows = async () => {
    while (!(row = dataGenerator.next()).done) {
      worksheet.addRow(row.value).commit();
      rowCount++;

      if (rowCount % chunkSize === 0) {
        await new Promise((resolve) => setImmediate(resolve));
      }
    }
  };

  await writeRows();

  await workbook.commit();
}

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
