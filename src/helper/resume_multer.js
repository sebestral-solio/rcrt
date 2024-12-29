const multer = require('multer');
const fs = require('fs');
const path = require('path');

const resumeDir = path.join(__dirname, '../../public/uploads/Resumes');

// Ensure the directory exists
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    // Rename file to `<email>-Resume` with a `.pdf` extension
    const email = req.user?.email || 'anonymous'; // Ensure `email` is available from JWT middleware
    const uniqueName = `${email}-Resume.pdf`; // Default to `.pdf` extension for resumes
    cb(null, uniqueName);
  },
});

const multerConfig = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Allow only PDF files
    const fileType = /pdf/;
    const extName = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileType.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

module.exports = multerConfig;
