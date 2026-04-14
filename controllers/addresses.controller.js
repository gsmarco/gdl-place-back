const pool = require('../config/db');

// Número de rondas de "salting" (entre 10 y 12 suele ser suficiente)
const saltRounds = 10;

exports.Addresses = async (req, res) => {

    const result = await pool.query('SELECT * FROM user_address order by id');

    res.json(result.rows);

};

//getuserAddressesByUser
exports.addressByUser = async (req, res) => {

    const { id } = req.params;

    const result = await pool.query(
        'SELECT * FROM user_address WHERE id_user = $1 order by id',
        [id]
    );

    res.json(result.rows);

};

// id_user, tipo, name, street, neighborhood, city, state, zipcode, isdefault
exports.createUserAddress = async (req, res) => {
    try {
        const {
            id_user, tipo, street, neighborhood,
            city, state, zipcode, isdefault
        } = req.body;

        console.log("BODY:", req.body);
        console.log("id_user:", id_user)

        const result = await pool.query(
            `INSERT INTO user_address
            (id_user, tipo, street, neighborhood, city, state, zipcode, isdefault)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [
                id_user, tipo, street, neighborhood,
                city, state, zipcode, isdefault
            ]
        );

        const address = result.rows[0];

        console.log("Regreso:", address);

        res.json(address);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando dirección de envío' });
    }
}

exports.updateUserAddress = async (req, res) => {

    const { id } = req.params;

    const {
        id_user, tipo, street, neighborhood,
        city, state, zipcode, isdefault
    } = req.body;

    const result = await pool.query(
        `UPDATE user_address SET
        id_user=$1,
        tipo=$2,
        street=$3,
        neighborhood=$4,
        city=$5,
        state=$6,
        zipcode=$7,
        isdefault=$8
        WHERE id=$9
        RETURNING *`,
        [
            id_user, tipo, street, neighborhood,
            city, state, zipcode, isdefault, id
        ]
    );

    res.json(result.rows[0]);
};

exports.setDefaultAddress = async (req, res) => {
    try {
        const { id_user, address_id } = req.body;
        await pool.query("BEGIN");
        // 1. Quitar default a todas
        await pool.query(
            "UPDATE user_address SET isdefault = false WHERE id_user = $1",
            [id_user]
        );

        // 2. Poner default a la seleccionada
        await pool.query(
            "UPDATE user_address SET isdefault = true WHERE id = $1",
            [address_id]
        );
        await pool.query("COMMIT");
        res.json({ message: "Dirección actualizada correctamente" });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ error: "ERROR: " + error.message });
    }
};

exports.deleteUserAddress = async (req, res) => {

    const { id } = req.params;

    await pool.query(
        'DELETE FROM user_address WHERE id=$1',
        [id]
    );

    res.json({ message: "userAddress eliminado" });
};
