import XLSX from 'xlsx';

import { generateData } from '../helpers/index.js';

export async function exec(req, res) {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

  const start = performance.now();
  this.logger.info('/download-xlsx-1 start')

  const header = ['Name', 'Age', 'Email']

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([header], { dense: true });

  const dataGenerator = generateData();
  const chunkSize = 100;

  let rowCount = 0;
  let row;

  const writeRows = async () => {
    while (!(row = dataGenerator.next()).done) {
      XLSX.utils.sheet_add_aoa(worksheet, [row.value], {
        // header, // this ensures the header order matches the column names
        origin: -1, // add to the end of the worksheet
        skipHeader: 1 // do not write header row
      });

      rowCount++;

      if (rowCount % chunkSize === 0) {
        await new Promise(resolve => setImmediate(resolve));
      }
    }
  };

  await writeRows();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

  const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  res.send(excelData);

  this.clearStat(this.stat)

  this.logger.info(`/download-xlsx-1 end with duration: ${performance.now() - start}ms`)
}
