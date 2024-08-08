import express from 'express'
import multer from 'multer';

import logger from './logger.js';
import { logStat } from './log-stat.js';
import * as Routes from './routes/index.js';
import { clearStat } from './helpers/index.js';

const stat = { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, }

const app = express();
const upload = multer({ dest: 'uploads/' });

const data = { clearStat, logger, stat }

app.get('/download-exceljs-1', Routes.DownloadExcelJS1.exec.bind(data));
app.get('/download-exceljs-2', Routes.DownloadExcelJS2.exec.bind(data));
app.get('/download-exceljs-3', Routes.DownloadExcelJS3.exec.bind(data));
app.get('/download-exceljs-4', Routes.DownloadExcelJS4.exec.bind(data));
app.get('/download-xlsx-1', Routes.DownloadXLSX1.exec.bind(data));
app.post('/upload-exceljs-1', upload.single('file'), Routes.UploadExcelJS1.exec.bind(data));

const port = 3000;
app.listen(port, () => { logger.info(`Server is running on port ${port}`); });

logStat(logger, stat)
