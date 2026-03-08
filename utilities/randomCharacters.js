import { randomUUID } from "crypto";

export default function randomCharacters(length = 0) {
  return randomUUID().replaceAll("-", "").slice(0, length);
}
