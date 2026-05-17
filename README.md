# Noudes – Temporary File Upload Server

A Node.js + Express backend service for uploading, storing, and sharing files with automatic expiration.

## Features
- Upload files to server storage
- Download files via generated shareable links
- Automatic time-based expiration and cleanup
- File type validation via magic byte inspection (not solely HTTP headers), directory traversal prevention, and rate limiting

## Tech Stack
- Node.js
- Express.js

## How to run
1. Install dependencies:
   `npm install`

2. Start the server:
   `npm run start`
   or
   `nodemon` (if installed)

3. Server runs on default port `3000`

## Notes
This project focuses on backend file handling, lifecycle management, and basic security validation.
