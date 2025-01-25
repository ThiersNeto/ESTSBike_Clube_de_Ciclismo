
/**
 * @typedef {Object} DatabaseUtils
 * @property {Function} execute -       Executa uma query SQL no banco de dados
 * @property {Function} string -        Valida e converte um valor para string
 * @property {Function} number -        Valida e converte um valor para número
 * @property {Function} date -          Valida e converte um valor para data
 * @property {Function} boolean -       Valida e converte um valor para booleano
 * @property {Function} toBoolean -     Converte explicitamente para booleano
 * @property {Function} sendError -     Envia resposta de erro padronizada
 * @property {Function} sendResponse -  Envia resposta de sucesso padronizada
 */
import { execute, string, number, date, boolean, toBoolean, sendError, sendResponse } from '../Config/Database.js';

/**
 * Comandos SQL para operações CRUD de eventos
 * @namespace EventQueries
 */
const commandGetAll = 'SELECT * FROM events';
const commandGetOne = 'SELECT * FROM events WHERE id = ?';
const commandCreate = 'INSERT INTO events (type_id, description, date) VALUES (?, ?, ?)';
const commandUpdate = 'UPDATE events SET type_id = ?, description = ?, date = ? WHERE id = ?';
const commandDelete = 'DELETE FROM events WHERE id = ?';

/**
 * Comandos SQL para operações de inscrição
 * @namespace SubscriptionQueries
 */
const commandCheckRegistrations = 'SELECT * FROM member_events WHERE event_id = ?';
const commandSubscribe = 'INSERT INTO member_events (member_id, event_id) VALUES (?, ?)';
const commandUnsubscribe = 'DELETE FROM member_events WHERE member_id = ? AND event_id = ?';

/**
 * Query para verificação de tipo de evento preferido do membro
 * @type {string}
 * @description Verifica se o membro tem permissão para se inscrever no tipo de evento
 */
const checkPreferredTypeCommand = `
            SELECT 1
            FROM member_preferred_event_types mpt
            JOIN events e ON e.type_id = mpt.event_type_id
            WHERE mpt.member_id = ? AND e.id = ?
        `;

/**
 * Query para obtenção de membros inscritos em um evento
 * @type {string}
 * @description Recupera a lista de membros inscritos em um evento específico
 */
const commandGetMembers = `
        SELECT m.id, m.name 
        FROM members m 
        JOIN member_events me ON m.id = me.member_id 
        WHERE me.event_id = ?
    `;

/**
 * @module EventController
 * @description Controlador para gestão de operações relacionadas a eventos
 */
export default {
    /**
     * Obtém todos os eventos cadastrados
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Array>}    Lista de eventos
     * @throws {Error}              500 - Erro interno do servidor
     */
    async getAllEvents(request, response) {
        await sendResponse(response, commandGetAll, [], (result) => result);
    },

    /**
     * Obtém um único evento pelo ID
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Dados do evento
     * @throws {Error}              404 - Evento não encontrado
     * @throws {Error}              500 - Erro interno do servidor
     */
    async getEvent(request, response) {
        const id = number(request.params.id);
        await sendResponse(response, commandGetOne, [id], (result) => {
            if (result.length > 0) {
                return result[0];
            } else {
                sendError(response, 'Event not found', 404);
                return null;
            }
        });
    },

    /**
     * Cria um novo evento
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Dados do evento criado
     * @throws {Error}              400 - Parâmetros obrigatórios faltando
     * @throws {Error}              500 - Erro interno do servidor
     */
    async createEvent(request, response) {
        const typeId = number(request.body.type_id);
        const description = string(request.body.description);
        const eventDate = date(request.body.date);

        if (typeId && description && eventDate) {
            await sendResponse(response, commandCreate, [typeId, description, eventDate], (result) => ({
                id: result.insertId,
                type_id: typeId,
                description,
                date: eventDate
            }));
        } else {
            sendError(response, "You must provide type_id, description, and date for the event!");
        }
    },

    /**
     * Atualiza um evento existente
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error} 400 -        Parâmetros obrigatórios faltando
     * @throws {Error} 500 -        Erro interno do servidor
     */
    async updateEvent(request, response) {
        const id = number(request.params.id);
        const typeId = number(request.body.type_id);
        const description = string(request.body.description);
        const eventDate = date(request.body.date);

        if (typeId && description && eventDate) {
            await sendResponse(response, commandUpdate, [typeId, description, eventDate, id], () => ({
                message: 'Event updated successfully'
            }));
        } else {
            sendError(response, "You must provide type_id, description, and date for the event!");
        }
    },

    /**
     * Exclui um evento existente
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error} 400 -        Evento possui inscrições ativas
     * @throws {Error} 500 -        Erro interno do servidor
     */
    async deleteEvent(request, response) {
        const id = number(request.params.id);

        const registrations = await execute(commandCheckRegistrations, [id]);
        if (registrations && registrations.length > 0) {
            sendError(response, 'Cannot delete event with registered members', 400);
            return;
        }

        await sendResponse(response, commandDelete, [id], () => ({
            message: 'Event deleted successfully'
        }));
    },

    /**
     * Inscreve um membro em um evento
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error}              400 - IDs obrigatórios faltando ou tipo incompatível
     * @throws {Error}              500 - Erro interno do servidor
     */
    async subscribeToEvent(request, response) {
        const eventId = number(request.params.id);
        const memberId = number(request.body.member_id);

        if (!eventId || !memberId) {
            sendError(response, "Event ID and Member ID are required!", 400);
            return;
        }

        try {
            const preferredTypeResult = await execute(checkPreferredTypeCommand, [memberId, eventId]);

            if (preferredTypeResult.length === 0) {
                sendError(response, "Member cannot subscribe to events of non-preferred types", 400);
                return;
            }

            await sendResponse(response, commandSubscribe, [memberId, eventId], () => ({
                message: 'Successfully subscribed to the event'
            }));
        } catch (error) {
            sendError(response, "Error subscribing to event. The member might already be subscribed.", 400);
        }
    },

    /**
     * Remove a inscrição de um membro em um evento
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error}              400 - IDs obrigatórios faltando
     * @throws {Error}              404 - Inscrição não encontrada
     * @throws {Error}              500 - Erro interno do servidor
     */
    async unsubscribeFromEvent(request, response) {
        const eventId = number(request.params.id);
        const memberId = number(request.body.member_id);

        if (!eventId || !memberId) {
            sendError(response, "Event ID and Member ID are required!", 400);
            return;
        }

        await sendResponse(response, commandUnsubscribe, [memberId, eventId], (result) => {
            if (result.affectedRows > 0) {
                return { message: 'Successfully unsubscribed from the event' };
            } else {
                sendError(response, "Member was not subscribed to this event", 404);
                return null;
            }
        });
    },

    /**
     * Obtém todos os membros inscritos em um evento
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Array>}    Lista de membros inscritos
     * @throws {Error} 400 -        ID do evento faltando
     * @throws {Error} 500 -        Erro interno do servidor
     */
    async getEventMembers(request, response) {
        const eventId = number(request.params.id);

        if (!eventId) {
            sendError(response, "ID do evento é obrigatório!", 400);
            return;
        }

        try {
            await sendResponse(response, commandGetMembers, [eventId], (result) => {
                return result;
            });
        } catch (error) {
            console.error('Erro em getEventMembers:', error);
            sendError(response, "Ocorreu um erro ao obter os membros do evento", 500);
        }
    }
};