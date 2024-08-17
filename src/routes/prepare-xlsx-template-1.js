import { fileURLToPath } from "node:url";

import { XlsxTemplate } from "../services/index.js";

import { withLogging } from "../helpers/index.js";

async function _exec(req, res) {
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");

  res.send(await XlsxTemplate.generate(req.query.templateName));
}

export const exec = withLogging(_exec, fileURLToPath(import.meta.url));
