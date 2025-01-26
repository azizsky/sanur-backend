const express = require('express');
const { login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Route untuk login
router.post('/auth/login', login);

// Route untuk dashboard yang dilindungi
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Selamat datang di dashboard, ${req.user.username}` });
});

module.exports = router;
