const pool = require('../config/db');

exports.actualiza = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    console.log("req.body: ", req.body);
    console.log("idUser: ", id);

    try {
        const result = await pool.query(
            `UPDATE users SET
            name = $1,
            email = $2,
            phone = $3
            where id=$4
        RETURNING name,email,phone`,
            [name, email, phone, id]
        );
        res.json(result.rows[0]);

        console.log("resultado", res.json());

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};
