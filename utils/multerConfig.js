const multer = require('multer');
const path = require('path');

// Setup folder upload
const upload = multer({
  dest: 'public/uploads/', // Folder tempat upload
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // Nama file yang sudah di-rename unik
  },
});

module.exports = upload;
