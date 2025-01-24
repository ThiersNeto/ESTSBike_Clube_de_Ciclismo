import express from 'express';
import bodyParser  from 'body-parser';
import eventTypeRoutes from './Server/Routes/eventTypeRoutes.js';
import eventRoutes  from './Server/Routes/eventRoutes.js';
import memberRoutes  from './Server/Routes/memberRoutes.js';

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

app.use('/api/event-types', eventTypeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', memberRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));