const documentTypes = [
  "application/pdf", // .pdf
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.oasis.opendocument.text", // .odt
  "application/vnd.oasis.opendocument.presentation", // .odp
  "application/vnd.oasis.opendocument.spreadsheet", // .ods
  "application/epub+zip", // .epub (eBook)
];

const dataTypes = [
  "application/json", // .json
  "text/csv", // .csv
  "text/markdown", // .md
  "text/plain", // .txt
];

const archiveTypes = [
  "application/zip", // .zip
  "application/x-zip-compressed", // .zip (Windows)
  "application/x-7z-compressed", // .7z
  "application/vnd.rar", // .rar
];

const imageTypes = [
  "image/jpeg", // .jpg .jpeg
  "image/png", // .png
  "image/gif", // .gif
  "image/webp", // .webp
  "image/avif", // .avif
  "image/apng", // .apng
  "image/svg+xml", // .svg
];

const audioTypes = [
  "audio/mpeg", // .mp3
  "audio/aac", // .aac
  "audio/ogg", // .ogg
  "audio/wav", // .wav
  "audio/webm", // .webm
];

const videoTypes = [
  "video/mp4", // .mp4
  "video/mpeg", // .mpeg
  "video/ogg", // .ogv
  "video/webm", // .webm
  "video/x-msvideo", // .avi
];

const allowedMimeTypes = [
  ...documentTypes,
  ...dataTypes,
  ...archiveTypes,
  ...imageTypes,
  ...audioTypes,
  ...videoTypes,
];

export default allowedMimeTypes;
