import express from 'express';
import eventTypeController from '../Controllers/EventTypeController.js';

const router = express.Router();

router.get('/', eventTypeController.getAllEventTypes);
router.get('/:id', eventTypeController.getEventType);
router.post('/', eventTypeController.createEventType);
router.put('/:id', eventTypeController.updateEventType);
router.delete('/:id', eventTypeController.deleteEventType);

export default router;