import { fileTypeFromFile } from "file-type";
import express from "express";
import path from "path";
import randomCharacters from "../utilities/randomCharacters.js";
import multerConfig from "../configs/multerConfig.js";
import {
  getFilenamesSync,
  cleanupFiles,
  validateUploadedFiles,
} from "../utilities/filesystem.js";
import { MulterError } from "multer";
import { param, validationResult } from "express-validator";

const DIR_NAME_LENGTH = 5;

const router = express.Router();
const upload = multerConfig().array("uploaded_file");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("error", { message: "Invalid URL." });
  }
  next();
};

router.post(
  "/",
  (req, res, next) => {
    req.downloadUrl = randomCharacters(DIR_NAME_LENGTH);
    next();
  },
  (req, res, next) => {
    upload(req, res, async (err) => {
      const errorMessage =
        err instanceof MulterError ? `Upload Error: ${err.message}`
          : err                    ? err.message
          : !req.files?.length     ? "Upload at least one file."
          : await validateUploadedFiles(req.files);

      if (errorMessage) {
        const directory = path.join("uploads", req.downloadUrl);
        cleanupFiles(directory);
        return res.render("index", { error: errorMessage });
      }

      res.redirect(`/file/${req.downloadUrl}`);
    });
  },
);

router.use(
  "/:downloadUrl",
  param("downloadUrl")
    .isAlphanumeric()
    .isLength({ min: DIR_NAME_LENGTH, max: DIR_NAME_LENGTH }),
  handleValidationErrors,
);

router.get("/:downloadUrl", (req, res, next) => {
  const directory = path.join("uploads", req.params.downloadUrl);

  let files = getFilenamesSync(directory);

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
