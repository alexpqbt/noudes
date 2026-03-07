import { fileTypeFromFile } from "file-type";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
});

const upload = multer({ storage });

router.post("/", upload.single("uploaded_file"), function (req, res, next) {
  res.redirect(`/file/${req.file.filename}`);
});

router.get("/:filename", function (req, res, next) {
  res.render("download", { title: "Download file" });
});

router.get("/:filename/download", async function (req, res, next) {
  const file = `uploads/${req.params.filename}`;
  const type = await fileTypeFromFile(file);
  res.download(file, `${file}.${type.ext}`);
});

export default router;
