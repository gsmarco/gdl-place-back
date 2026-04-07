const { Router } = require('express');
const router = Router();
const sales = require('../controllers/sales.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/sales', verifyToken, sales.createSale);

router.get('/sales', verifyToken, sales.getSales);

router.get('/sales/:id', verifyToken, sales.getSale);

router.put('/sales/:id', verifyToken, sales.updateSale);

router.delete('/sales/:id', verifyToken, sales.deleteSale);

module.exports = router;
