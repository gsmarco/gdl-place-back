const { Router } = require('express');
const router = Router();

const sellers = require('../controllers/sellers.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/sellers', sellers.createSeller);

router.get('/sellers', verifyToken, sellers.getSellers);

router.get('/sellers/:id', verifyToken, sellers.getSeller);

router.put('/sellers/:id', verifyToken, sellers.updateSeller);

router.delete('/sellers/:id', verifyToken, sellers.deleteSeller);

module.exports = router;
