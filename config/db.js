const { Pool } = require('pg');

const pool = new Pool({
    user: 'neondb_owner',
    host: 'ep-patient-brook-ai2qdtp3-pooler.c-4.us-east-1.aws.neon.tech',
    database: 'neondb',
    password: 'npg_IUFih1jy6cQZ',
    port: 5432
});

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'GDL-PLACE',
//     password: 'oLGA0322',
//     port: 5433
// });


module.exports = pool;
