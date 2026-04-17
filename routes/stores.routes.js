// const { Router } = require("express");

// const router = Router();

// const stores = require("../controllers/stores.controller.js");
// const verifyToken = require("../middleware/auth.middleware.js");

// router.post("/store", stores.createStore);

// router.get("/store/:id", stores.getStore);

// router.put("/store/:id", verifyToken, stores.updateStore);

// router.delete("/store/:id", verifyToken, stores.deleteStore);

// module.exports = router;

const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const router = Router();

const stores = require("../controllers/stores.controller.js");
const verifyToken = require("../middleware/auth.middleware.js");

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads")); // carpeta donde se guardan
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage });

// Middleware para aceptar archivos y texto
const uploadFields = upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 10 },
]);

// Rutas
router.post("/store", uploadFields, stores.createStore);

router.get("/store/:id", stores.getStore);

router.put("/store/:id", verifyToken, uploadFields, stores.updateStore);

router.delete("/store/:id", verifyToken, stores.deleteStore);

module.exports = router;
