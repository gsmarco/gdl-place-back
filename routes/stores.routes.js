const { Router } = require('express');
const router = Router();

const stores = require('../controllers/stores.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/store', stores.createStore);

router.get('/store/:id', stores.getStore);

router.put('/store/:id', verifyToken, stores.updateStore);

router.delete('/store/:id', verifyToken, stores.deleteStore);

module.exports = router;
