import express from 'express';
import bodyParser  from 'body-parser';
import eventTypeController from './Server/Controllers/EventTypeController.js';
import eventController  from './Server/Controllers/EventController.js';
import memberController  from './Server/Controllers/MemberController.js';

const app = express();

app.use(bodyParser.json());

// Rota de teste
app.get('/test', (req, res) => {
    res.send('Servidor está funcionando corretamente!');
  });

// Tratamento para rotas não encontradas
app.use((req, res, next) => {
    res.status(404).send('Rota não encontrada');
  });
  
  // Tratamento de erros global
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
  });

// Rotas para gerir eventos
router.get('/event', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Rotas adicionais para gerir inscrições em eventos
router.post('/:id/subscribe', eventController.subscribeToEvent);
router.delete('/:id/unsubscribe', eventController.unsubscribeFromEvent);

router.get('/:id/members', eventController.getEventMembers);

// Rotas para gerir tipos de eventos
router.get('/', eventTypeController.getAllEventTypes);
router.get('/:id', eventTypeController.getEventType);
router.post('/', eventTypeController.createEventType);
router.put('/:id', eventTypeController.updateEventType);
router.delete('/:id', eventTypeController.deleteEventType);

// Rotas para gerir membros
router.get('/', memberController.getAllMembers);
router.get('/:id', memberController.getMember);
router.post('/', memberController.createMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

// Rotas adicionais para gerir preferências de tipos de eventos dos membros
router.get('/:id/preferences', memberController.getMemberPreferences);
router.post('/:id/preferences', memberController.addMemberPreference);
router.delete('/:id/preferences/:eventTypeId', memberController.removeMemberPreference);

// rota para adicionar um membro a um evento
router.post('/:id/events', memberController.addMemberEvent);

app.use('/api/event-types', eventTypeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', memberRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));