const { Router } = require('express');
const router = Router();

const addresses = require('../controllers/addresses.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/address/', verifyToken, addresses.Addresses);

router.get('/addressByUser/:id', verifyToken, addresses.addressByUser);

router.post('/address', verifyToken, addresses.createUserAddress);

router.put('/address/:id', verifyToken, addresses.updateUserAddress);

router.post('/address/setDefault', verifyToken, addresses.setDefaultAddress);

router.delete('/address/:id', verifyToken, addresses.deleteUserAddress);

module.exports = router;
