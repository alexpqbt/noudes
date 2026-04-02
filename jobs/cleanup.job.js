import cron from "node-cron";
import { deleteExpiredUploads } from "../utilities/filesystem.js";

export function startCleanupJob() {
  cron.schedule("* * * * *", deleteExpiredUploads);
}