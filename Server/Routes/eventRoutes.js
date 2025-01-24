import express from 'express';
import eventController from '../Controllers/EventController.js';

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Rotas adicionais para gerir inscrições em eventos
router.post('/:id/subscribe', eventController.subscribeToEvent);
router.delete('/:id/unsubscribe', eventController.unsubscribeFromEvent);

router.get('/:id/members', eventController.getEventMembers);

export default router;