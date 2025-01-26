const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Ganti dengan secret key yang aman

// Middleware untuk verifikasi token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Akses ditolak, token tidak ditemukan' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }

    req.user = decoded; // Simpan informasi user di req.user
    next(); // Lanjutkan ke route selanjutnya
  });
};
