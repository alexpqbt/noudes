import fs from "fs";

export function getFilenamesSync(directoryPath) {
  let files = [];
  if (fs.existsSync(directoryPath)) {
    files = fs.readdirSync(directoryPath);
  }
  return files;
}
