const fs = require("fs");
const path = require("path");
const { getProducts, saveProducts } = require("../models/productModel.js");

const productsFilePath = path.join(__dirname, "../data/product.json");


// Fungsi untuk membuat produk baru
const createProduct = (req, res) => {
  try {
    console.log("Body Data:", req.body); // Cek data input
    console.log("Files:", req.files);   // Cek file yang diunggah

    // Menggabungkan kategori jika lebih dari satu
    const category = Array.isArray(req.body.category) ? req.body.category.join(",") : req.body.category;
    const { name, description, color, price, shopeeLink } = req.body;

    // Validasi data
    if (!name || !description || !color || !price || !category) {
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    // Menangani file cover image dan gambar lainnya
    const coverImage = req.files["coverImage"]?.[0]?.filename || null;
    const images = req.files["images"]?.map((file) => file.filename) || [];

    console.log("Cover Image:", coverImage); // Debug cover image
    console.log("Images:", images);         // Debug images array

    // Fungsi untuk generate ID unik
    const generateShortId = () => {
      return Math.random().toString(36).substring(2, 6); // Hasilkan string acak 5 karakter
    };

    // Menyiapkan data produk baru
    const newProduct = {
      id: generateShortId(),
      name,
      description,
      color,
      price: parseFloat(price),
      category,
      shopeeLink,
      coverImage,
      images,
      createdAt: new Date().toISOString(), // Tambahkan timestamp di sini

    };

    // Ambil produk yang sudah ada dan simpan produk baru
    const products = getProducts();
    products.push(newProduct);
    saveProducts(products);

    res.status(201).json({ message: "Produk berhasil ditambahkan!", product: newProduct });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan server!", error: error.message });
  }
};

// Fungsi untuk mengambil semua produk
const getAllProducts = (req, res) => {
  try {
    const products = getProducts(); // Fungsi untuk membaca data dari `product.json`
    res.status(200).json(products);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan server!", error: error.message });
  }
};

// Fungsi untuk menghapus produk
const deleteProduct = (req, res) => {
  const { id } = req.params;

  // Ambil data produk
  fs.readFile(productsFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading products file:", err.message);
      return res.status(500).json({ message: "Failed to read products file" });
    }

    const products = JSON.parse(data);
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      console.error(`Product with ID ${id} not found`);
      return res.status(404).json({ message: "Product not found" });
    }

    const product = products[productIndex];

    // Hapus cover image
    const coverImagePath = path.join(__dirname, "../public/uploads", product.coverImage);
    fs.unlink(coverImagePath, (err) => {
      if (err) {
        console.error("Failed to delete cover image:", err.message);
      } else {
        console.log(`Deleted cover image: ${coverImagePath}`);
      }
    });

    // Hapus gambar lainnya
    product.images.forEach((image) => {
      const imagePath = path.join(__dirname, "../public/uploads", image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err.message);
        } else {
          console.log(`Deleted image: ${imagePath}`);
        }
      });
    });

    // Hapus produk dari array
    products.splice(productIndex, 1);

    // Simpan perubahan ke file
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), "utf-8", (err) => {
      if (err) {
        console.error("Error writing to products file:", err.message);
        return res.status(500).json({ message: "Failed to delete product" });
      }

      console.log(`Product with ID ${id} deleted successfully`);
      res.status(200).json({ message: "Product deleted successfully" });
    });
  });
};

// Update product

const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, color, price, category, shopeeLink } = req.body;

  const products = getProducts();
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const product = products[productIndex];
  const coverImage = req.files["coverImage"]?.[0]?.filename || product.coverImage; // Pakai file lama jika tidak ada baru
  const images = req.files["images"]
    ? req.files["images"].map((file) => file.filename)
    : product.images; // Pakai file lama jika tidak ada baru

  products[productIndex] = {
    ...product,
    name,
    description,
    color,
    price: parseFloat(price),
    category,
    shopeeLink,
    coverImage,
    images,
  };

  saveProducts(products);
  res.status(200).json({ message: "Product updated successfully", product: products[productIndex] });
};


const getProductById = (req, res) => {
  const productId = req.params.id;
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading products file:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  });
};


module.exports = { createProduct, getAllProducts, deleteProduct, updateProduct, getProductById };
