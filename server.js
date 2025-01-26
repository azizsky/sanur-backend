const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');

const cors = require('cors'); // Import CORS
const authRoutes = require('./routes/authRoutes'); // Path ke routes yang telah dibuat

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());  // Untuk menerima JSON
app.use(express.urlencoded({ extended: true }));  // Untuk menerima form-data

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Routes
app.use('/api/products', productRoutes); // Route untuk produk


// Gunakan route auth dan dashboard
app.use('/api/', authRoutes);

// Jalankan server
app.listen(5000, () => {
  console.log('Server berjalan di http://localhost:5000');
});

