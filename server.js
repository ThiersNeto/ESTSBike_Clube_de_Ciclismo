import express from 'express';
import bodyParser from 'body-parser';
import eventTypeController from './Server/Controllers/EventTypeController.js';
import eventController from './Server/Controllers/EventController.js';
import memberController from './Server/Controllers/MemberController.js';
import cors from 'cors';
import fs from 'fs';
import { execute } from './Server/Config/Database.js';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Converte a URL do módulo para um caminho de arquivo.
 * @constant __filename
 * @type {string}
 */
const __filename = fileURLToPath(import.meta.url);

/**
 * Obtém o diretório atual do arquivo.
 * @constant __dirname
 * @type {string}
 */
const __dirname = path.dirname(__filename);

/**
 * Instância do aplicativo Express.
 * @constant app
 * @type {express.Application}
 */
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

/**
 * Executa um script SQL para criar o esquema do banco de dados.
 * @async
 * @function executeSQLScript
 * @throws {Error} - Se ocorrer um erro ao executar o script SQL.
 */
async function executeSQLScript() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'Server', 'SQL', 'schema.sql'), 'utf8');
        const statements = sql.split(';').filter(statement => statement.trim() !== '');
        
        for (const statement of statements) {
            await execute(statement);
        }
        console.log('Database schema created successfully');
    } catch (error) {
        console.error('Error creating database schema:', error);
        throw error;
    }
}

/**
 * Inicia o servidor e configura as rotas.
 * @async
 * @function startServer
 * @throws {Error} Se ocorrer um erro ao iniciar o servidor.
 */
async function startServer() {
    try {
        await executeSQLScript();
        console.log('Database schema created and connected!');

        // Configuração das rotas
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
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
