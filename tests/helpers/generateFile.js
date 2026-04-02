import { PDFDocument, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import PptxGenJS from "pptxgenjs";
import sharp from "sharp";

async function sharpImage(format, options = {}) {
  return sharp({
    create: { width: 16, height: 16, channels: 3, background: { r: 100, g: 100, b: 100 }}
  })
  [format](options)
  .toBuffer();
}

export default async function generateFile(mimeType) {
  let buffer;
  let filename;

  switch (mimeType) {
    case "application/pdf": {
      const pdf = await PDFDocument.create();
      const page = pdf.addPage([400, 200]);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      page.drawText("Test PDF", { x: 50, y: 100, size: 24, font });
      buffer = Buffer.from(await pdf.save());
      filename = "test.pdf";
      break;
    }

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({ children: [new TextRun("Test DOCX document")] }),
          ],
        }],
      });
      buffer = await Packer.toBuffer(doc);
      filename = "test.docx";
      break;
    }

    case "application/msword": {
      // .doc is a binary OLE2 format — no pure-JS writer exists.
      // Use the DOCX buffer but name it .doc so your MIME check fires.
      // Replace with a real fixture if you validate OLE2 magic bytes.
      const doc = new Document({
        sections: [{
          children: [new Paragraph({ children: [new TextRun("Test DOC")] })],
        }],
      });
      buffer = await Packer.toBuffer(doc);
      filename = "test.doc";
      break;
    }

    case "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
      const pptx = new PptxGenJS();
      const slide = pptx.addSlide();
      slide.addText("Test Slide", { x: 1, y: 1, fontSize: 24 });
      buffer = Buffer.from(await pptx.write({ outputType: "arraybuffer" }));
      filename = "test.pptx";
      break;
    }

    case "application/vnd.ms-powerpoint": {
      // .ppt is OLE2 — same situation as .doc
      const pptx = new PptxGenJS();
      pptx.addSlide().addText("Test PPT", { x: 1, y: 1, fontSize: 24 });
      buffer = Buffer.from(await pptx.write({ outputType: "arraybuffer" }));
      filename = "test.ppt";
      break;
    }

    case "text/plain": {
      buffer = Buffer.from("This is a test file.");
      filename = "test.txt";
      break;
    }

    case "image/jpeg": {
      buffer = await sharpImage("jpeg", { quality: 80 });
      filename = "test.jpg";
      break;
    }

    case "image/png": {
      buffer = await sharpImage("png");
      filename = "test.png";
      break;
    }

    case "audio/mpeg": {
      // Minimal valid MP3: ID3v2 header + one silent frame
      buffer = Buffer.from(
        "494433030000000000" + // ID3v2.3 header, 0-byte tag
        "fffb9000" +           // MPEG1 Layer3, 128kbps, 44100Hz, stereo frame sync
        "0".repeat(416),       // silent frame data (208 bytes)
        "hex"
      );
      filename = "test.mp3";
      break;
    }

    case "video/mp4": {
      // Minimal ftyp box (ISOBMFF) — enough to pass magic-byte checks
      const ftyp = Buffer.from(
        "00000018" +   // box size = 24 bytes
        "66747970" +   // "ftyp"
        "69736f6d" +   // major brand "isom"
        "00000200" +   // minor version
        "69736f6d",    // compatible brand "isom"
        "hex"
      );
      buffer = ftyp;
      filename = "test.mp4";
      break;
    }

    default:
      throw new Error(`generateFile: unsupported MIME type "${mimeType}"`);
  }

  return { buffer, filename, mimeType };
}