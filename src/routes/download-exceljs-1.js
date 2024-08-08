import ExcelJS from 'exceljs'

import { generateData } from '../helpers/index.js';

export async function exec(req, res) {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

  const start = performance.now();
  this.logger.info('/download-exceljs-1 start')

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  worksheet.addRow(['Name', 'Age', 'Email']);

  for (const row of generateData()) {
    worksheet.addRow(row);
  }

  await workbook.xlsx.write(res);

  res.end();

  this.clearStat(this.stat)

  this.logger.info(`/download-exceljs-1 end with duration: ${performance.now() - start}ms`)
}
