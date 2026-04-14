const { Router } = require('express');
const router = Router();
const users = require('../controllers/users.controller');

router.put("/users/:id", users.actualiza);

module.exports = router;
