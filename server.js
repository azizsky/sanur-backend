const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const fs = require('fs');

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


app.get("/api/products/latest", (req, res) => {
  // Tentukan path file produk
  const filePath = path.join(__dirname, "data/product.json");
  // Cek apakah file ada
  if (!fs.existsSync(filePath)) {
    console.error("File product.json tidak ditemukan");
    return res.status(404).json({ message: "Product data not found" });
  }
  // Membaca file JSON
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error membaca file:", err);
      return res.status(500).json({ message: "Error reading product data" });
    }

    try {
      const products = JSON.parse(data);
      // Ambil produk terbaru (misalnya 5 produk terakhir)
      const latestProducts = products.slice(-2).reverse();

      // Kirimkan produk terbaru sebagai response
      res.json(latestProducts);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ message: "Error parsing product data" });
    }
  });
});


// Jalankan server
app.listen(PORT, () => {
  console.log('Server berjalan di http://localhost:5000');
});

