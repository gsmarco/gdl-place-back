const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            {
                width: 1000,
                height: 1000,
                crop: 'limit'
            }
        ]
    }
});

const upload = multer({ storage });

module.exports = upload;

// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Tip: Este código crea la carpeta automáticamente si no existe
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         // Evitamos caracteres raros en el nombre del archivo
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// // Exportamos el middleware configurado para un máximo de 5 imágenes
// module.exports = multer({ storage: storage }).array('images', 5);
