const { Pool } = require('pg');
require('dotenv').config();

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false, // necesario para conexiones SSL en Neon
//     },
// });

let pool = new Pool();
if (1 == 2) {
    pool = new Pool({
        user: 'neondb_owner',
        host: 'ep-patient-brook-ai2qdtp3-pooler.c-4.us-east-1.aws.neon.tech',
        database: 'neondb',
        password: 'npg_IUFih1jy6cQZ',
        port: 5432,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    try {
        pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'GDL-PLACE',
            password: 'oLGA0322',
            port: 5433,
        });

    } catch (error) {

    }
}

module.exports = pool;
