const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function randomCharacters(length = 5) {
  return Array.from(
    { length },
    () => CHARS[Math.floor(Math.random() * CHARS.length)],
  ).join("");
}
