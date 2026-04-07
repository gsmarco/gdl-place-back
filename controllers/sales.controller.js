const pool = require('../config/db');

// Número de rondas de "salting" (entre 10 y 12 suele ser suficiente)
const saltRounds = 10;

exports.getSales = async (req, res) => {

    const result = await pool.query('SELECT * FROM Sales');

    res.json(result.rows);

};

exports.getSale = async (req, res) => {

    const { id } = req.params;

    const result = await pool.query(
        'SELECT * FROM Sales WHERE id = $1',
        [id]
    );

    res.json(result.rows[0]);

};


exports.createSale = async (req, res) => {
    try {
        const {
            total,
            buyer_id,
            buyerName,
            buyerEmail,
            buyerPhone,
            street,
            city,
            state,
            zipCode,
            country,
            shipping,
            date_sale,
            status,
            cardNumber,
            cardName,
            expiryDate,
            cvv
        } = req.body;

        console.log("datos a enviar\n", req.body);

        await pool.query('BEGIN');

        const result = await pool.query(
            `INSERT INTO Sales
             (total, buyer_id, buyername, buyeremail, buyerphone, street, city, state, zipcode, country, shipping, date_sale, status, cardNumber, cardName, expiryDate, cvv)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
             RETURNING *`,
            [
                total + shipping,
                buyer_id,
                buyerName,
                buyerEmail,
                buyerPhone,
                street,
                city,
                state,
                zipCode,
                country,
                shipping,
                date_sale,
                status,
                cardNumber,
                cardName,
                expiryDate,
                cvv
            ]
        );

        const sale = result.rows[0];

        const saleId = result.rows[0].id;

        const products = req.body.products;

        // 2. Insertar productos
        for (const product of products) {
            await pool.query(
                `INSERT INTO sale_products
                (sale_id, product_id, product_name, price, quantity, image)
                VALUES ($1,$2,$3,$4,$5,$6)`,
                [
                    saleId,
                    product.id,
                    product.name,
                    product.price,
                    product.quantity,
                    product.image,
                ]
            );
        }

        await pool.query("COMMIT");
        res.json(sale);
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error al crear la venta: ' + error });
    }
};

exports.updateSale = async (req, res) => {

    const { id } = req.params;

    const {
        total,
        buyer_id,
        bussines_name,
        buyer_phone,
        street,
        city,
        state,
        zip_code,
        country,
        date_sale,
        status,
        tracking_number
    } = req.body;

    const result = await pool.query(

        `UPDATE Sales SET
        total=$1,
        buyer_id=$2,
        bussines_name=$3,
        buyer_phone=$4,
        street=$5,
        city=$6,
        state=$7,
        zip_code=$8,
        country=$9,
        date_sale=$10,
        status=$11,
        tracking_number=$12
        where id=$13
        RETURNING *`,
        [
            total,
            buyer_id,
            bussines_name,
            buyer_phone,
            street,
            city,
            state,
            zip_code,
            country,
            date_sale,
            status,
            tracking_number,
            id
        ]
    );

    res.json(result.rows[0]);

};


exports.deleteSale = async (req, res) => {

    const { id } = req.params;

    await pool.query(
        'DELETE FROM Sales WHERE id=$1',
        [id]
    );

    res.json({ message: "Venta eliminada" });
};
