const pool = require('../config/db');

// Número de rondas de "salting" (entre 10 y 12 suele ser suficiente)
const saltRounds = 10;

async function encryptPassword(plainPassword) {
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

exports.getProducts = async (req, res) => {

  const result = await pool.query('SELECT * FROM products');

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
    'SELECT * FROM products WHERE seller_id = $1 order by name',
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
      sellerId,
      sellerName,
      shipping_time,
      shipping_unit
    } = req.body;

    // 📦 obtener imágenes desde multer
    const imageUrls = req.files
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];

    // 🧠 guardar producto
    const result = await pool.query(
      `INSERT INTO products
            ("name", description, price, category, stock, seller_id, seller_name, shipping_time, shipping_unit)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *`,
      [
        name,
        description,
        price,
        category,
        stock,
        sellerId,
        sellerName,
        shipping_time,
        shipping_unit
      ]
    );

    const productId = result.rows[0].id;

    const imageNames = req.files
  ? req.files.map(file => file.filename) 
  : []; 


    const savedImages = [];
    for (let filename of imageNames) {
      const imgResult = await pool.query(
        'INSERT INTO product_images(product_id, image_url) VALUES($1, $2) RETURNING image_url',
        [productId, filename]
      );
      savedImages.push(imgResult.rows[0].image_url);
    }

    // 4. ✅ Respuesta final (Esto quita el 'pending' del navegador)
    res.status(201).json({
      ...result.rows[0],
      images: savedImages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el producto' });
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
      image,
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
