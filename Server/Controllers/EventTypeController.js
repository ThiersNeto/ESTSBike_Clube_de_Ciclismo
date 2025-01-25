
/**
 * @module EventTypeController
 * @description Controlador para gestão de tipos de eventos
 */
import { execute, string, number, sendError, sendResponse } from '../Config/Database.js';

/**
 * Comandos SQL para operações de tipos de eventos
 * @namespace EventTypeQueries
 */
const commandGetAll = 'SELECT * FROM event_types';
const commandGetOne = 'SELECT * FROM event_types WHERE id = ?';
const commandCreate = 'INSERT INTO event_types (description) VALUES (?)';
const commandUpdate = 'UPDATE event_types SET description = ? WHERE id = ?';
const commandDelete = 'DELETE FROM event_types WHERE id = ?';
const commandCheckEvents = 'SELECT * FROM events WHERE event_type_id = ?';
const commandCheckPreferences = 'SELECT * FROM member_preferred_event_types WHERE event_type_id = ?';

export default {
    /**
     * Obtém todos os tipos de eventos cadastrados
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Array>}    Lista de tipos de eventos
     * @throws {Error}              500 - Erro interno do servidor
     */
    async getAllEventTypes(request, response) {
        await sendResponse(response, commandGetAll, [], (result) => result);
    },

    /**
     * Obtém um tipo de evento pelo ID
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Dados do tipo de evento
     * @throws {Error}              404 - Tipo de evento não encontrado
     * @throws {Error}              500 - Erro interno do servidor
     */
    async getEventType(request, response) {
        const id = number(request.params.id);
        await sendResponse(response, commandGetOne, [id], (result) => {
            if (result.length > 0) {
                return result[0];
            } else {
                sendError(response, 'Event type not found', 404);
                return null;
            }
        });
    },

    /**
     * Cria um novo tipo de evento
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Dados do tipo de evento criado
     * @throws {Error}              400 - Descrição não fornecida
     * @throws {Error}              500 - Erro interno do servidor
     */
    async createEventType(request, response) {
        const description = string(request.body.description);

        if (description) {
            await sendResponse(response, commandCreate, [description], (result) => ({
                id: result.insertId,
                description
            }));
        } else {
            sendError(response, "You must provide a description for the event type!");
        }
    },

    /**
     * Atualiza um tipo de evento existente
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error}              400 - Descrição não fornecida
     * @throws {Error}              500 - Erro interno do servidor
     */
    async updateEventType(request, response) {
        const id = number(request.params.id);
        const description = string(request.body.description);

        if (description) {
            await sendResponse(response, commandUpdate, [description, id], () => ({
                message: 'Event type updated successfully'
            }));
        } else {
            sendError(response, "You must provide a description for the event type!");
        }
    },

    /**
     * Exclui um tipo de evento
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error}              400 - Tipo associado a eventos ou preferências
     * @throws {Error}              500 - Erro interno do servidor
     */
    async deleteEventType(request, response) {
        const id = number(request.params.id);

        // Verifica associação com eventos
        const events = await execute(commandCheckEvents, [id]);
        if (events && events.length > 0) {
            sendError(response, 'Cannot delete event type with associated events', 400);
            return;
        }

        // Verifica associação com preferências de membros
        const preferences = await execute(commandCheckPreferences, [id]);
        if (preferences && preferences.length > 0) {
            sendError(response, 'Cannot delete event type with associated member preferences', 400);
            return;
        }

        await sendResponse(response, commandDelete, [id], () => ({
            message: 'Event type deleted successfully'
        }));
    }
};