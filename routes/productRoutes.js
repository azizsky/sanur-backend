const express = require("express");
const { createProduct, getAllProducts, deleteProduct, updateProduct, getProductById } = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

// Route untuk membuat produk
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 15 },
  ]),
  createProduct
);

router.get("/", getAllProducts);

router.delete("/:id", deleteProduct );

// Tambahkan route PUT untuk mengupdate produk
router.put("/:id", upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 15 },
]), updateProduct);

// routes/productRoutes.js
router.get('/:id', getProductById);


module.exports = router;
