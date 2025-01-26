const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/product.json");

const getProducts = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const saveProducts = (products) => {
  console.log("Products to Save:", products); // Debug data sebelum disimpan
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
};


module.exports = { getProducts, saveProducts };
