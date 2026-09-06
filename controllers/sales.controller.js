const pool = require('../config/db');

// Listado de ventas generales
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

exports.estadisticas = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await pool.query(`
        select COUNT(*) AS num_compras, coalesce(SUM(total), 0) AS total_comprado, coalesce(ROUND(AVG(total), 2), 0) AS compra_promedio
        FROM sales
        WHERE buyer_id = $1
    `, [id]);

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo estadísticas" });
    }
};

exports.getOrdenes = async (req, res) => {
    try {
        const { id } = req.params; // o req.user.id si usas auth

        const query = `
      SELECT 
        json_build_object(
          'id', s.id::text,
          'date', s.date_sale,
          'status', s.status,
          'total', s.total,
          'items', COALESCE((
            SELECT json_agg(
              json_build_object(
                'name', sp.product_name,
                'quantity', sp.quantity,
                'price', sp.price,
                'image', sp.image
              )
            )
            FROM sale_products sp
            WHERE sp.sale_id = s.id
          ), '[]'::json),
          'trackingNumber', COALESCE(s.trackingnumber, ''),
          'shippingCarrier', COALESCE(s.shippingcarrier, ''),
          'deliveryDate', COALESCE(s.deliverydate::text, '')
        ) AS "order"
      FROM sales s
      WHERE s.buyer_id = $1
      ORDER BY s.date_sale DESC;
    `;

        const result = await pool.query(query, [id]);

        // 🔹 Extraer solo los objetos JSON
        const orders = result.rows.map(row => row.order);

        res.json(orders);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener órdenes'
        });
    }
};

exports.getVentas = async (req, res) => {
    const { id } = req.params;

    const query = `
    SELECT 
      prod.seller_id, s.buyer_id, s.id, s.total, s.buyername, s.buyeremail, s.buyerphone,
      s.street, s.city, s.state, s.zipcode, s.country,
      s.date_sale, s.status, s.trackingnumber,
      sp.id AS product_id, sp.product_name, sp.price, sp.quantity, sp.image
    FROM sales s
    LEFT JOIN sale_products sp ON sp.sale_id = s.id
    left join products prod on sp.product_id = prod.id
    WHERE prod.seller_id=$1
    `;

    try {
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron ventas" });
        }

        // Usamos un objeto normal como mapa
        const salesMap = {};

        result.rows.forEach(r => {
            if (!salesMap[r.id]) {
                salesMap[r.id] = {
                    id: r.id,
                    productId: r.product_id,
                    productName: r.product_name,
                    quantity: r.quantity,
                    total: parseFloat(r.total),
                    buyerName: r.buyername,
                    buyerEmail: r.buyeremail,
                    buyerPhone: r.buyerphone,
                    shippingAddress: {
                        street: r.street,
                        city: r.city,
                        state: r.state,
                        zipCode: r.zipcode,
                        country: r.country,
                    },
                    date: r.date_sale,
                    status: r.status,
                    trackingNumber: r.trackingnumber,
                    products: []
                };
            }

            // Agregamos cada producto al array
            salesMap[r.id].products.push({
                id: r.product_id,
                name: r.product_name,
                price: parseFloat(r.price),
                quantity: r.quantity,
                image: r.image
            });
        });

        // Convertimos el objeto en array
        const sales = Object.values(salesMap);

        res.json(sales);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener las ventas");
    }
};

exports.getVentasTendencias = async (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT 
        TO_CHAR(date_sale, 'DD Mon') AS fecha,
        SUM(total) AS ventas,
        COUNT(*) AS ordenes
        FROM public.sales s
        LEFT JOIN sale_products sp ON sp.sale_id = s.id
        left join products prod on sp.product_id = prod.id
        where prod.seller_id = $1
        GROUP BY date_sale
        ORDER BY date_sale;
    `;

    try {
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron ventas" });
        }

        // Response
        const Data = result.rows.map(r => ({
            fecha: r.fecha,
            ventas: Number(r.ventas),
            ordenes: Number(r.ordenes)
        }));
        // res.json(result.rows);
        res.json(Data);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener las tendencias de ventas");
    }
};

exports.getProductosMasVendidos = async (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT 
        cat."name",
        SUM(total)::decimal(12,2) AS ventas,
        COUNT(*)::int AS ordenes,
        cat.graphic_color
        FROM public.sales s
        LEFT JOIN sale_products sp ON sp.sale_id = s.id
        left join products prod on sp.product_id = prod.id
        left join categories cat on prod.category = cat."name"
        where prod.seller_id = $1
        GROUP BY cat."name", graphic_color 
        ORDER BY cat."name";
    `;

    try {
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron ventas" });
        }

        // Response
        let totalOrdenes = 0;
        result.rows.forEach(r => {
            totalOrdenes += Number(r.ordenes);
        })

        const Data = result.rows.map(r => ({
            name: r.name,
            value: Number(((r.ordenes * 100) / totalOrdenes).toFixed(2)),
            color: r.graphic_color
        }));
        res.json(Data);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener las tendencias de ventas");
    }
};
