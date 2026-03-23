// const pool = require("../config/db");
const { Pool } = require('pg');
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/hash");
require('dotenv').config();

const ssl_mode = process.env.DATABASE_SSL === 'true'; // convierte a boolean
console.log(ssl_mode);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: ssl_mode ? { rejectUnauthorized: false } : false,
});

module.exports = pool;

const register = async (req, res) => {

    const { name, email, password, role } = req.body;

    try {

        const hashed = await hashPassword(password);

        const result = await pool.query(
            `INSERT INTO users (name,email,password,role)
       VALUES ($1,$2,$3,$4)
       RETURNING id,name,email,role`,
            [name, email, hashed, role || "BUYER"]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });

    }

};

const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Usuario no encontrado"
            });

        }

        const user = result.rows[0];

        const valid = await comparePassword(password, user.password);

        if (!valid) {

            return res.status(401).json({
                message: "Password incorrecto"
            });

        }

        const access_token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            "secretkey",
            { expiresIn: "12h" }
        );

        // res.json({
        //     message: "Login correcto",
        //     token
        // });

        // quitar password
        delete user.password;

        res.json({
            message: "Login correcto",
            access_token,
            user
        });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};

module.exports = { register, login };
