require('dotenv').config();
const path = require('path');
const express = require('express');
const app = require('./app');

const PORT = 3000;
// Servir la carpeta "uploads" como estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
