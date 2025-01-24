const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/EventController');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Rotas adicionais para gerir inscrições em eventos
router.post('/:id/subscribe', eventController.subscribeToEvent);
router.delete('/:id/unsubscribe', eventController.unsubscribeFromEvent);

router.get('/:id/members', eventController.getEventMembers);

module.exports = router;