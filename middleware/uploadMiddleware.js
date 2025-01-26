const multer = require("multer");
const path = require("path");

const generateShortFilename = (originalname) => {
  const ext = path.extname(originalname); // Dapatkan ekstensi file (misalnya .jpg, .png)
  const shortName = Math.random().toString(36).substring(2, 8); // 6 karakter acak
  return `${shortName}${ext}`;
};
// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, generateShortFilename(file.originalname));
  },
});

// Filter file gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
