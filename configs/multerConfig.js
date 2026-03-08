import multer from "multer";
import fs from "fs";
import allowedMimeTypes from "../utilities/allowedMimeTypes.js";

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    const downloadUrl = req.downloadUrl;
    const directory = `uploads/${downloadUrl}`;
    fs.mkdirSync(directory, { recursive: true });
    cb(null, directory);
  },
});

export const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, videos, and documents are allowed.",
      ),
      false,
    );
  }
};

export const limits = {
  fileSize: 25 * 1000 * 1000,
  files: 10,
};

function multerConfig() {
  return multer({ storage, fileFilter, limits });
}

export default multerConfig;
