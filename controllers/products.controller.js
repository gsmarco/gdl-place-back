const pool = require('../config/db');

exports.getProducts = async (req, res) => {

  const result = await pool.query(
    "SELECT * FROM products order by name",
  );

  res.json(result.rows);

};


exports.getProduct = async (req, res) => {

  const { id } = req.params;

  const result = await pool.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );

  res.json(result.rows[0]);

};


exports.getProductBySeller = async (req, res) => {

  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM products WHERE seller_id = $1 order by name",
    [id]
  );

  res.json(result.rows);

};


//============================================================================
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
      sellerId,
      sellerName,
      shipping_time,
      shipping_unit
    } = req.body;

    // 📦 obtener imágenes desde multer
    const imageUrls = req.files
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];

    const imageNames = req.files
      ? req.files.map(file => file.filename)
      : [];

    // 🧠 guardar producto
    const result = await pool.query(
      `INSERT INTO products
            ("name", description, price, category, stock, image, seller_id, seller_name, shipping_time, shipping_unit)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10)
            RETURNING *`,
      [
        name,
        description,
        price,
        category,
        stock,
        imageNames,
        sellerId,
        sellerName,
        shipping_time,
        shipping_unit
      ]
    );

    const productId = result.rows[0].id;

    // 4. ✅ Respuesta final (Esto quita el 'pending' del navegador)
    res.status(201).json({
      ...result.rows[0],
      // images: savedImages
      images: imageNames
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el producto: ' + error });
  }
};


exports.updateProduct = async (req, res) => {

  const { id } = req.params;

  const {
    name,
    description,
    price,
    category,
    stock,
    image,
    shipping_time,
    shipping_unit
  } = req.body;

  // 📦 obtener imágenes desde multer
  const imageUrls = req.files
    ? req.files.map(file => `/uploads/${file.filename}`)
    : [];

  const imageNames = req.files
    ? req.files.map(file => file.filename)
    : [];

  console.log("imageUrls: ", imageUrls);

  console.log("imageNames: ", imageNames);

  const result = await pool.query(
    `UPDATE products SET
        name=$1,
        description=$2,
        price=$3,
        category=$4,
        stock=$5,
        image=$6,
        shipping_time=$7,
        shipping_unit=$8
        WHERE id=$9
        RETURNING *`,
    [
      name,
      description,
      price,
      category,
      stock,
      imageNames,
      shipping_time,
      shipping_unit,
      id
    ]
  );

  res.json(result.rows[0]);

};


exports.deleteProduct = async (req, res) => {

  const { id } = req.params;

  await pool.query(
    'DELETE FROM products WHERE id=$1',
    [id]
  );

  res.json({ message: "Producto eliminado" });
};
