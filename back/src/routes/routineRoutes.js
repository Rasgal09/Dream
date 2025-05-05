const express = require('express');
const router = express.Router();
const routineController = require('../controller/routineController');

router.post('/create', routineController.createRoutine);
router.get('/user-routines', routineController.getUserRoutines);

module.exports = router;