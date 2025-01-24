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

// Rotas para gerir eventos
app.get('/api/events', eventController.getAllEvents);
app.get('/api/events/:id', eventController.getEvent);
app.post('/api/events', eventController.createEvent);
app.put('/api/events/:id', eventController.updateEvent);
app.delete('/api/events/:id', eventController.deleteEvent);

// Rotas adicionais para gerir inscrições em eventos
app.post('/api/events/:id/subscribe', eventController.subscribeToEvent);
app.delete('/api/events/:id/unsubscribe', eventController.unsubscribeFromEvent);
app.get('/api/events/:id/members', eventController.getEventMembers);

// Rotas para gerir tipos de eventos
app.get('/api/event-types', eventTypeController.getAllEventTypes);
app.get('/api/event-types/:id', eventTypeController.getEventType);
app.post('/api/event-types', eventTypeController.createEventType);
app.put('/api/event-types/:id', eventTypeController.updateEventType);
app.delete('/api/event-types/:id', eventTypeController.deleteEventType);

// Rotas para gerir membros
app.get('/api/members', memberController.getAllMembers);
app.get('/api/members/:id', memberController.getMember);
app.post('/api/members', memberController.createMember);
app.put('/api/members/:id', memberController.updateMember);
app.delete('/api/members/:id', memberController.deleteMember);

// Rotas adicionais para gerir preferências de tipos de eventos dos membros
app.get('/api/members/:id/preferences', memberController.getMemberPreferences);
app.post('/api/members/:id/preferences', memberController.addMemberPreference);
app.delete('/api/members/:id/preferences/:eventTypeId', memberController.removeMemberPreference);

// rota para adicionar um membro a um evento
app.post('/api/members/:id/events', memberController.addMemberEvent);

// Tratamento para rotas não encontradas
app.use((req, res, next) => {
    res.status(404).send('Rota não encontrada');
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));