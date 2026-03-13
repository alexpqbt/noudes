import fs from "fs";
import { fileTypeFromFile } from "file-type";
import allowedMimeTypes from "../utilities/allowedMimeTypes.js";

export function getFilenamesSync(directoryPath) {
  let files = [];
  if (fs.existsSync(directoryPath)) {
    files = fs.readdirSync(directoryPath);
  }
  return files;
}

export function cleanupFiles(directory) {
  fs.rmSync(directory, { recursive: true, force: true });
}

export async function validateUploadedFiles(files) {
  for (const file of files) {
    const type = await fileTypeFromFile(file.path);
    if (!type || !allowedMimeTypes.includes(type.mime)) {
      return `Rejected file: ${file.originalname} (detected: ${type?.mime ?? "unknown"})`;
    }
  }
  return null;
}
