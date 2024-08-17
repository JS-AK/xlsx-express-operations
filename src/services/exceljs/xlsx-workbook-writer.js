import { PassThrough } from "node:stream";

import ExcelJS from "exceljs";

import { generateData } from "../../helpers/index.js";

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
