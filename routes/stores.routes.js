const { Router } = require("express");
const upload = require('../middleware/upload');
const multer = require("multer");
const path = require("path");

const router = Router();

const stores = require("../controllers/stores.controller.js");
const verifyToken = require("../middleware/auth.middleware.js");

// Middleware para aceptar archivos y texto
const uploadFields = upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 10 },
]);

// Rutas
router.post("/store", verifyToken, uploadFields, stores.createStore);

router.get("/store/:id", stores.getStore);

router.put("/store/:id", verifyToken, uploadFields, stores.updateStore);

router.delete("/store/:id", verifyToken, stores.deleteStore);

module.exports = router;
