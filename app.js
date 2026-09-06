const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const sellersRoutes = require('./routes/sellers.routes');
const salesRoutes = require('./routes/sales.routes');
const storesRoutes = require('./routes/stores.routes');
const productsRoutes = require('./routes/products.routes');
const usrRoutes = require('./routes/users.routes');
const addressRoutes = require('./routes/addresses.routes');
const metodosPagoRoutes = require('./routes/payment_methods.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api', authRoutes);
app.use('/api', sellersRoutes);
app.use('/api', storesRoutes);
app.use('/api', productsRoutes);
app.use('/api', salesRoutes);
app.use('/api', usrRoutes);
app.use('/api', addressRoutes)
app.use('/api', metodosPagoRoutes)


module.exports = app;
