const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Número de rondas de "salting" (entre 10 y 12 suele ser suficiente)
const saltRounds = 10;

async function encryptPassword(plainPassword) {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

exports.getSellers = async (req, res) => {

    const result = await pool.query('SELECT * FROM sellers');

    res.json(result.rows);

};

//getSellerByEmail
exports.getSellerByEmail = async (req, res) => {

    const { email } = req.params;

    const result = await pool.query(
        'SELECT * FROM sellers WHERE email = $1',
        [email]
    );

    res.json(result.rows[0]);

};

exports.getSeller = async (req, res) => {

    const { id } = req.params;

    const result = await pool.query(
        'SELECT * FROM sellers WHERE id = $1',
        [id]
    );

    res.json(result.rows[0]);

};


exports.createSeller = async (req, res) => {
    try {
        const {
            businessName,
            ownerName,
            email,
            address,
            phone,
            city,
            category,
            description,
            password
        } = req.body;

        await pool.query('BEGIN');

        const result = await pool.query(

            `INSERT INTO sellers
    (bussines_name, owner_name, email, address, phone, city, category, description)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
            [
                businessName,
                ownerName,
                email,
                address,
                phone,
                city,
                category,
                description
            ]
        );

        const seller = res.json(result.rows[0]);

        const pwd_encriptado = await encryptPassword(password);

        await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1,$2,$3,$4)`,
            [
                ownerName,
                email,
                pwd_encriptado,
                'seller'
            ]
        );

        await pool.query('COMMIT');

        res.json(seller);
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error creating seller' });
    } finally {
        pool.release();
    }
}

exports.updateSeller = async (req, res) => {

    const { id } = req.params;

    const {
        bussines_name,
        owner_name,
        email,
        address,
        phone,
        city,
        category,
        description
    } = req.body;

    const result = await pool.query(

        `UPDATE sellers SET
    bussines_name=$1,
    owner_name=$2,
    email=$3,
    address=$4,
    phone=$5,
    city=$6,
    category=$7,
    description=$8
    WHERE id=$9
    RETURNING *`,

        [
            bussines_name,
            owner_name,
            email,
            address,
            phone,
            city,
            category,
            description,
            id
        ]
    );

    res.json(result.rows[0]);

};


exports.deleteSeller = async (req, res) => {

    const { id } = req.params;

    await pool.query(
        'DELETE FROM sellers WHERE id=$1',
        [id]
    );

    res.json({ message: "Seller eliminado" });
};
