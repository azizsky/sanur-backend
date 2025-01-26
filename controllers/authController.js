const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Ganti dengan secret key yang aman

// Data hardcoded untuk admin
const users = [
  {
    username: 'Aziz',
    password: 'z',
  },
  {
    username: 'admin',
    password: '123',
  },
  {
    username: 'admin2',
    password: 'mypassword',
  },
];

// Fungsi login
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Mencari user berdasarkan username dan password
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Username atau password salah' });
  }

  // Membuat token JWT
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

  res.json({ message: 'Login berhasil', token });
};
