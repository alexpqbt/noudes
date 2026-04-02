import { test, expect } from "vitest";
import generateFile from "./helpers/generateFile.js";
import request from "supertest";
import app from "../app.js";
import allowedMimeTypes from "../utilities/allowedMimeTypes.js";

test.each(allowedMimeTypes)("successfully upload %s", async (mimeType) => {
  const { buffer, filename } = await generateFile(mimeType)

  const response = await request(app)
    .post("/file")
    .attach("uploaded_file", buffer, { filename, contentType: mimeType });

  expect(response.status).toBe(302);
  expect(response.headers.location).toMatch(/^\/file\//);
})
