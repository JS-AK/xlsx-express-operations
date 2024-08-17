import fs from "node:fs/promises";
import path from "node:path";

import XlsxTemplate from "xlsx-template";

const excels = new Map();

async function getActualWorkbook(templateName) {
  const exists = excels.get(templateName);

  if (exists) return exists;

  const buffer = await fs.readFile(path.join(process.cwd(), "assets", templateName), "binary");

  excels.set(templateName, buffer);

  return buffer;
}

export async function generate(templateName = "template01.xlsx") {
  const buffer = await getActualWorkbook(templateName);

  const template = new XlsxTemplate(buffer);
  const sheetNumber = 1;
  const values = {
    0: "test 0",
    1: "test 1",
    2: "test 2",
    3: "test 3",
    4: "test 4",
    5: "test 5",
    6: "test 6",
    7: "test 7",
    8: "test 8",
    9: "test 9",
  };

  template.substitute(sheetNumber, values);

  return template.generate({ type: "nodebuffer" });
}
