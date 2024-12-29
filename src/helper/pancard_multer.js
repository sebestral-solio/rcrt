const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload directory
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'Pancards');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files to the specified directory
    },
    filename: (req, file, cb) => {
        const email = req.body.email || 'unknown'; // Get email from the request body
        const sanitizedEmail = email.replace(/[@.]/g, '_'); // Replace problematic characters
        const fileName = `${sanitizedEmail}-Pancard${path.extname(file.originalname)}`; // Generate filename
        cb(null, fileName); // Save the file with the new name
    }
});

// Configure Multer file filtering
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/; // Allow only these file types
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (mimeType && extName) {
            cb(null, true); // Accept file
        } else {
            cb(new Error('Error: Only images are allowed (jpeg, jpg, png, gif)'));
        }
    }
});

module.exports = upload;
