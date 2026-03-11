import { fileTypeFromFile } from "file-type";
import express from "express";
import path from "path";
import randomCharacters from "../utilities/randomCharacters.js";
import multerConfig from "../configs/multerConfig.js";
import { getFilenamesSync } from "../utilities/filesystem.js";
import { MulterError } from "multer";

const router = express.Router();
const upload = multerConfig().array("uploaded_file");

router.post(
  "/",
  function (req, res, next) {
    req.downloadUrl = randomCharacters(5);
    next();
  },
  function (req, res, next) {
    upload(req, res, function (err) {
      let errorMessage = null;

      if (err instanceof MulterError) {
        errorMessage = `Upload Error: ${err.message}`;
      } else if (err) {
        errorMessage = err.message;
      }

      if (errorMessage) {
        return res.render("index", { error: errorMessage });
      }

      res.redirect(`/file/${req.downloadUrl}`);
    });
  },
);

router.get("/:downloadUrl", function (req, res, next) {
  const directory = path.join("uploads", req.params.downloadUrl);

  let files = getFilenamesSync(directory);

  res.render("download", {
    title: "Download file",
    files,
    downloadUrl: req.params.downloadUrl,
  });
});

router.get("/:downloadUrl/:filename/download", async function (req, res, next) {
  const file = `uploads/${req.params.downloadUrl}/${req.params.filename}`;
  const type = await fileTypeFromFile(file);
  res.download(file, `${file}.${type.ext}`);
});

export default router;
