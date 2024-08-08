import fs from 'node:fs';

import ExcelJS from 'exceljs'

export async function exec(req, res) {
  const filePath = req.file.path;

  this.logger.info(filePath);

  const stream = fs.createReadStream(filePath);

  try {
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(stream);
    const rows = [];

    for await (const worksheetReader of workbookReader) {
      for await (const row of worksheetReader) {
        rows.push(row.values);
      }
    }

    res.json({ data: rows[0] });
  } catch (error) {
    this.logger.error('Error reading Excel file: ' + error.message);

    res.status(500).send('Error reading Excel file');
  } finally {
    stream.close();

    fs.unlink(filePath, (err) => {
      if (err) {
        this.logger.error('Error deleting file: ' + err.message);
      }
    });
  }
}
