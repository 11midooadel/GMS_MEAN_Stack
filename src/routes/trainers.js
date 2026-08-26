const express = require('express');
const router = express.Router();
const trainersController = require('../controllers/trainers');

router.post('/', trainersController.createTrainer);
router.get('/', trainersController.getAllTrainers);
router.get('/:id', trainersController.getTrainerById);
router.put('/:id', trainersController.updateTrainer);
router.delete('/:id', trainersController.deleteTrainer);

// MUST BE HERE
module.exports = router;