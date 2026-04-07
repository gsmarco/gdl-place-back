const { Router } = require('express');
const router = Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/products.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/Products', upload, controller.createProduct);

router.get('/Products', controller.getProducts);

router.get('/Products/:id', verifyToken, controller.getProduct);

router.get('/ProductsBySeller/:id', controller.getProductBySeller);

// router.put('/Products/:id', verifyToken, controller.updateProduct);
router.put(
    "/Products/:id",
    verifyToken,
    // upload.array("images"),   // aquí indicas que esperas múltiples archivos bajo el campo "images"
    upload,   // aquí indicas que esperas múltiples archivos bajo el campo "images"
    controller.updateProduct
);

router.delete('/Products/:id', verifyToken, controller.deleteProduct);

module.exports = router;
