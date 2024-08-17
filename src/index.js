import express from "express";
import multer from "multer";

import * as Routes from "./routes/index.js";
import { logStat, logger } from "./system/index.js";
import { clearStat } from "./helpers/index.js";

const stat = { external: 0, heapTotal: 0, heapUsed: 0, rss: 0 };

const app = express();
const upload = multer({ dest: "uploads/" });

const data = { clearStat, logger, stat };

app.get("/download-exceljs-1", Routes.DownloadExcelJS1.exec.bind(data));
app.get("/download-exceljs-2", Routes.DownloadExcelJS2.exec.bind(data));
app.get("/download-exceljs-3", Routes.DownloadExcelJS3.exec.bind(data));
app.get("/download-exceljs-4", Routes.DownloadExcelJS4.exec.bind(data));
app.get("/download-xlsx-1", Routes.DownloadXLSX1.exec.bind(data));
app.get("/prepare-exceljs-1", Routes.PrepareExcelJSTemplate1.exec.bind(data));
app.get("/prepare-xlsx-template-1", Routes.PrepareXlsxTemplate1.exec.bind(data));
app.get("/read-file-exceljs-1", Routes.ReadFileExcelJS1.exec.bind(data));
app.post("/upload-exceljs-1", upload.single("file"), Routes.UploadExcelJS1.exec.bind(data));

const port = 3000;

app.listen(port, () => { logger.info(`Server is running on port ${port}`); });

logStat(logger, stat);
