import ExcelJS from 'exceljs'

import { generateData } from '../helpers/index.js';

export async function exec(req, res) {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

  const start = performance.now();
  this.logger.info('/download-exceljs-4 start')

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: true,
    useSharedStrings: true
  });

  const worksheet = workbook.addWorksheet('Sheet 1');

  worksheet.addRow(['Name', 'Age', 'Email']).commit();

  const dataGenerator = generateData();
  const chunkSize = 100;

  let rowCount = 0;
  let row;

  const writeRows = async () => {
    while (!(row = dataGenerator.next()).done) {
      worksheet.addRow(row.value).commit();
      rowCount++;

      if (rowCount % chunkSize === 0) {
        await new Promise(resolve => setImmediate(resolve));
      }
    }
  };

  await writeRows();

  await workbook.commit();

  this.clearStat(this.stat)

  this.logger.info(`/download-exceljs-4 end with duration: ${performance.now() - start}ms`)
}
