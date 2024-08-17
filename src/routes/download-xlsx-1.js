import { fileURLToPath } from "node:url";

import { Xlsx } from "../services/index.js";
import { withLogging } from "../helpers/index.js";

async function _exec(req, res) {
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");

  res.send(Xlsx.xlsxWrite());
}

export const exec = withLogging(_exec, fileURLToPath(import.meta.url));
