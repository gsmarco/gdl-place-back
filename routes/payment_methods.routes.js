const { Router } = require('express');
const router = Router();

const metodosPago = require('../controllers/payment_methods.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/metodosPago/:id', verifyToken, metodosPago.MetodosPago);

router.get('/metodosPagoByUser/:id', verifyToken, metodosPago.MetodosPagoByUser);

router.post('/metodosPago', verifyToken, metodosPago.createMetodoPago);

router.put('/metodosPago/:id', verifyToken, metodosPago.updateMetodoPago);

router.post('/metodosPago/setDefault', verifyToken, metodosPago.setDefaultMetodoPago);

router.delete('/metodosPago/:id', verifyToken, metodosPago.deleteMetodoPago);

module.exports = router;
