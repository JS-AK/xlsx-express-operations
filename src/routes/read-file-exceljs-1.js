import { fileURLToPath } from "node:url";

import { ExcelJS } from "../services/index.js";

import { withLogging } from "../helpers/index.js";

async function _exec(req, res) {
  await ExcelJS.xlsxRead();

  res.send({ success: true });
}

export const exec = withLogging(_exec, fileURLToPath(import.meta.url));
