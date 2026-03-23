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
    'SELECT * FROM products WHERE seller_id = $1',
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

    // 💾 guardar imágenes en otra tabla
    for (let url of imageUrls) {
      await pool.query(
        'INSERT INTO product_images(product_id, image_url) VALUES($1,$2)',
        [productId, url]
      );
    }

    res.json({
      ...result.rows[0],
      images: imageUrls
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};
//============================================================================

// exports.createProduct = async (req, res) => {
//     try {
//         const {
//             name,
//             description,
//             price,
//             category,
//             stock,
//             image,
//             sellerId,
//             sellerName,
//             shipping_time,
//             shipping_unit
//         } = req.body;

//         const result = await pool.query(
//             `INSERT INTO products
//             ("name", description, price, category, stock, image, seller_id, seller_name, shipping_time, shipping_unit)
//             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
//             RETURNING *`,
//             [
//                 name,
//                 description,
//                 price,
//                 category,
//                 stock,
//                 image,
//                 sellerId,
//                 sellerName,
//                 shipping_time,
//                 shipping_unit
//             ]
//         );

//         const product = res.json(result.rows[0]);

//         res.json(product);
//     } catch (error) {
//         console.error(error);

//         if (error.code === '23505') {
//             // Error de llave única
//             return res.status(400).json({
//                 message: 'Ya existe un producto con ese nombre para este vendedor'
//             });
//         }

//         res.status(500).json({ message: 'Error al crear el producto' });
//     } finally {
//         pool.release();
//     }
// }

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
