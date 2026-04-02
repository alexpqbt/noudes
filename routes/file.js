import { fileTypeFromFile } from "file-type";
import express from "express";
import path from "path";
import randomCharacters from "../utilities/randomCharacters.js";
import multerConfig from "../configs/multerConfig.js";
import {
  getFilenames,
  cleanupFiles,
  validateUploadedFiles,
} from "../utilities/filesystem.js";
import { MulterError } from "multer";
import { param, validationResult } from "express-validator";
import fs from "fs/promises";
import { promisify } from "util";

const DIR_NAME_LENGTH = 5;

const router = express.Router();
const uploadAsync = promisify(multerConfig().array("uploaded_file"));

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("error", { message: "Invalid URL." });
  }
  next();
};

router.post("/", async (req, res) => {
  req.downloadUrl = randomCharacters(DIR_NAME_LENGTH);
  const directory = path.join("uploads", req.downloadUrl);

  try {
    await uploadAsync(req, res);

    if (!req.files?.length) {
      throw new Error("Upload at least one file.");
    }

    const validationError = await validateUploadedFiles(req.files);
    if (validationError) {
      throw new Error(validationError);
    }

    await fs.writeFile(
      path.join(directory, "meta.json"),
      JSON.stringify({ createdAt: Date.now() })
    );

    res.redirect(`/file/${req.downloadUrl}`);

  } catch (err) {
    await cleanupFiles(directory);
    const message = err instanceof MulterError
      ? `Upload Error: ${err.message}`
      : err.message;
    res.status(400).render("index", { error: message });
  }
});

router.use(
  "/:downloadUrl",
  param("downloadUrl")
    .isAlphanumeric()
    .isLength({ min: DIR_NAME_LENGTH, max: DIR_NAME_LENGTH }),
  handleValidationErrors,
);

router.get("/:downloadUrl", async (req, res, next) => {
  const directory = path.join("uploads", req.params.downloadUrl);

  let files = await getFilenames(directory);

  res.render("download", {
    title: "Download file",
    files,
    downloadUrl: req.params.downloadUrl,
  });
});

router.get("/:downloadUrl/:filename/download", async (req, res, next) => {
  try {
    const file = `uploads/${req.params.downloadUrl}/${req.params.filename}`;
    const type = await fileTypeFromFile(file);
    res.download(file, `${req.params.filename}.${type.ext}`);
  } catch (err) {
    next(err);
  }
});

export default router;
