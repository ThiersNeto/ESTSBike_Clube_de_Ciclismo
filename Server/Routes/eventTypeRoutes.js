const express = require('express');
const router = express.Router();
const eventTypeController = require('../Controllers/EventTypeController');

router.get('/', eventTypeController.getAllEventTypes);
router.get('/:id', eventTypeController.getEventType);
router.post('/', eventTypeController.createEventType);
router.put('/:id', eventTypeController.updateEventType);
router.delete('/:id', eventTypeController.deleteEventType);

module.exports = router;