const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define directory for storing uploaded videos
const videoDir = path.join(__dirname, '../../public/uploads/Videos');

// Ensure the directory exists
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

// Set up Multer storage configuration for video files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoDir); // Save videos in 'uploads/Videos'
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname).toLowerCase(); // Get file extension
    const uniqueName = `${timestamp}-video${fileExtension}`; // Name file with timestamp to ensure uniqueness
    cb(null, uniqueName); // Save video with the unique name
  },
});

// Multer configuration for file type validation (allow only certain video formats)
const multerConfig = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /webm|mp4|ogg|avi|mov/; // Define valid video formats
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only video files (.webm, .mp4, .ogg, .avi, .mov) are allowed!'), false);
    }
  },
});

module.exports = multerConfig;
