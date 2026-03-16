const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { register, login } = require("../controllers/auth.controller");

const router = Router();
// RUTAS PUBLICAS
router.post("/register", register);
router.post("/login", login);

module.exports = router;
