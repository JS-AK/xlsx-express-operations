import { fileURLToPath } from "node:url";
import fs from "node:fs";

import { ExcelJS } from "../services/index.js";

import { withLogging } from "../helpers/index.js";

export async function _exec(req, res) {
  const filePath = req.file.path;

  try {
    const data = await ExcelJS.xlsxWorkbookReader(filePath);

    res.json({ data: data[0] });
  } catch (error) {
    res.status(500).send("Error reading Excel file");
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) {
        this.logger.error("Error deleting file: " + err.message);
      }
    });
  }
}

export const exec = withLogging(_exec, fileURLToPath(import.meta.url));
