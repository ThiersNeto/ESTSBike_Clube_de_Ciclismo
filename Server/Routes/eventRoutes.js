const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/EventController');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;