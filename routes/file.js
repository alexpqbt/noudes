import { fileTypeFromFile } from "file-type";
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import randomCharacters from "../utilities/randomString.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    const downloadUrl = req.downloadUrl;
    const directory = `uploads/${downloadUrl}`;
    fs.mkdirSync(directory, { recursive: true });
    cb(null, directory);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  function (req, res, next) {
    req.downloadUrl = randomCharacters(5);
    next();
  },
  upload.array("uploaded_file", 10),
  function (req, res, next) {
    res.redirect(`/file/${req.downloadUrl}`);
  },
);

router.get("/:downloadUrl", function (req, res, next) {
  const directory = path.join("uploads", req.params.downloadUrl);

  let files = [];
  if (fs.existsSync(directory)) {
    files = fs.readdirSync(directory);
  }

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
