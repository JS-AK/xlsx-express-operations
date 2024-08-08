import { PassThrough } from 'node:stream';

import ExcelJS from 'exceljs'

import { generateData } from '../helpers/index.js';

export async function exec(req, res) {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

  const start = performance.now();
  this.logger.info('/download-exceljs-3 with PassThrough({ highWaterMark: 16 * 1024 }) start')

  const passThrough = new PassThrough({ highWaterMark: 16 * 1024 });

  passThrough.pipe(res);

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: passThrough,
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

  this.logger.info(`/download-exceljs-3 end with duration: ${performance.now() - start}ms`)
}
