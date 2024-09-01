const multer = require('multer');
const path = require('path');

// Fájl tárolási beállítások
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const uploadFile = (req, res) => {
  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
};

module.exports = {
  upload,
  uploadFile,
};
