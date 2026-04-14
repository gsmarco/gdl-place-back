const pool = require('../config/db');

exports.MetodosPago = async (req, res) => {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM payment_methods where id=$1', [id]);

    res.json(result.rows);

};

//getuserAddressesByUser
exports.MetodosPagoByUser = async (req, res) => {

    const { id } = req.params;

    const result = await pool.query(
        'SELECT * FROM payment_methods WHERE id_user = $1 order by id',
        [id]
    );

    res.json(result.rows);

};

exports.createMetodoPago = async (req, res) => {
    try {
        const {
            id_user, type, last_four, expiry_date, holder_name, isdefault
        } = req.body;

        console.log("BODY:", req.body);
        console.log("id_user:", id_user)

        const result = await pool.query(
            `INSERT INTO payment_methods
            (id_user, "type", last_four, expiry_date, holder_name, isdefault)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [
                id_user, type, last_four, expiry_date, holder_name, isdefault]
        );

        const metodoPago = result.rows[0];

        console.log("Regreso:", metodoPago);

        res.json(metodoPago);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando método de Pago' });
    }
}

exports.updateMetodoPago = async (req, res) => {

    const { id } = req.params;

    const {
        id_user, type, last_four, expiry_date, holder_name, isdefault } = req.body;

    const result = await pool.query(
        `UPDATE payment_methods SET
        id_user=$1,
        type=$2,
        last_four=$3,
        expiry_date=$4,
        holder_name=$5,
        isdefault=$6
        WHERE id=$7
        RETURNING *`,
        [
            id_user, type, last_four, expiry_date, holder_name, isdefault, id
        ]
    );

    res.json(result.rows[0]);
};

exports.setDefaultMetodoPago = async (req, res) => {
    try {
        const { id_user, payMethod_id } = req.body;
        await pool.query("BEGIN");
        // 1. Quitar default a todas
        await pool.query(
            "UPDATE payment_methods SET isdefault = false WHERE id_user = $1",
            [id_user]
        );

        // 2. Poner default a la seleccionada
        await pool.query(
            "UPDATE payment_methods SET isdefault = true WHERE id = $1",
            [payMethod_id]
        );
        await pool.query("COMMIT");
        res.json({ message: "Dirección actualizada correctamente" });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ error: "ERROR: " + error.message });
    }
};

exports.deleteMetodoPago = async (req, res) => {

    const { id } = req.params;

    await pool.query(
        'DELETE FROM payment_methods WHERE id=$1',
        [id]
    );

    res.json({ message: "Método de pago eliminado" });
};
