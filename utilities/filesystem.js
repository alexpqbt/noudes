import fs from "fs";
import fsPromise from "fs/promises";
import { fileTypeFromFile } from "file-type";
import allowedMimeTypes from "../utilities/allowedMimeTypes.js";
import path from "path"

const UPLOADS_DIR = "uploads";
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getFilenamesSync(directoryPath) {
  let files = [];
  if (fs.existsSync(directoryPath)) {
    files = fs.readdirSync(directoryPath).filter(file => file !== "meta.json");
  }
  return files;
}

export async function cleanupFiles(directory) {
  await fsPromise.rm(directory, { recursive: true, force: true });
}

export async function validateUploadedFiles(files) {
  for (const file of files) {
    const type = await fileTypeFromFile(file.path);
    const mime = type?.mime ?? file.mimetype;

    if (!allowedMimeTypes.includes(mime)) {
      return `Rejected file: ${file.originalname} (detected: ${mime ?? "unknown"})`;
    }
  }
  return null;
}

export async function deleteExpiredUploads() {
  const folders = await fsPromise.readdir(UPLOADS_DIR);

  for (const folder of folders) {
    const folderPath = path.join(UPLOADS_DIR, folder);
    const metaPath = path.join(folderPath, "meta.json");

    try {
      const meta = JSON.parse(await fsPromise.readFile(metaPath, "utf-8"));
      const ageMs = Date.now() - meta.createdAt;

      if (ageMs > MAX_AGE_MS) {
        cleanupFiles(folderPath);
        console.log(`Deleted expired folder: ${folder}`);
      }
    } catch {}
  }
}