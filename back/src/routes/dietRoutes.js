const express = require('express');
const router = express.Router();
const dietController = require('../controller/dietController');

router.post('/create', dietController.createDiet);
router.get('/user-diets', dietController.getUserDiets);

module.exports = router;