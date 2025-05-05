const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/registro', userController.registro);
router.post('/login', userController.login);
router.get('/usuario', userController.getUsuario);

module.exports = router;