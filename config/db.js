const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // necesario para conexiones SSL en Neon
    },
});


// const pool = require("../config/db");
// const { Pool } = require('pg');
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'GDL-PLACE',
//     password: 'oLGA0322',
//     port: 5433
// });


module.exports = pool;
