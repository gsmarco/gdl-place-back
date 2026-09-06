const { Pool } = require('pg');
require('dotenv').config();

let pool = new Pool();
try {
    const ssl_mode = process.env.DATABASE_SSL === 'true'; // convierte a boolean
    console.log(ssl_mode);

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: ssl_mode ? { rejectUnauthorized: false } : false,
    });

} catch (error) {
    console.log("Error al conectarse al servidor de base de datos", error.message);
}

// Captura errores inesperados del pool
pool.on('error', (err) => {
    console.error('Error inesperado en el pool:', err.message);
});


// Verifica conexión inicial
(async () => {
    try {
        const row = await pool.query('SELECT version() as version');
        console.log('Conexión inicial a PostgreSQL exitosa');
        console.log('Versión: ' + row.rows[0].version);
        console.log("Conectado a DB:", process.env.DATABASE_URL);
    } catch (error) {
        console.error('No se pudo conectar al servidor de PostgreSQL:', error.message);
        // Opcional: detener la app si la DB es crítica
        // process.exit(1);
    }
})();

module.exports = pool;
