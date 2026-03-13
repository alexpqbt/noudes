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

const router = express.Router();
const upload = multerConfig().array("uploaded_file");

router.post(
  "/",
  (req, res, next) => {
    req.downloadUrl = randomCharacters(5);
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

router.get("/:downloadUrl", (req, res, next) => {
  const directory = path.join("uploads", req.params.downloadUrl);

  let files = getFilenamesSync(directory);

  res.render("download", {
    title: "Download file",
    files,
    downloadUrl: req.params.downloadUrl,
  });
});

router.get("/:downloadUrl/:filename/download", validateDownloadUrl, async (req, res, next) => {
  const file = `uploads/${req.params.downloadUrl}/${req.params.filename}`;
  const type = await fileTypeFromFile(file);
  res.download(file, `${file}.${type.ext}`);
});

export default router;
