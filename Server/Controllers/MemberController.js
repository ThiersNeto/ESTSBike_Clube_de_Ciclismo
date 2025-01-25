
/**
 * @module MemberController
 * @description Controlador para gestão de membros e suas preferências/eventos
 * 
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * <br>
 * @author André Rocha - 202300185 - 202300185@estudantes.ips.pt
 */
import { execute, string, number, boolean, toBoolean, sendError, sendResponse } from '../Config/Database.js';

/**
 * Comandos SQL para operações básicas de membros
 * @namespace MemberQueries
 */
const commandGetAll = 'SELECT * FROM members';
const commandGetOne = 'SELECT * FROM members WHERE id = ?';
const commandCreate = 'INSERT INTO members (name) VALUES (?)';
const commandUpdate = 'UPDATE members SET name = ? WHERE id = ?';
const commandDelete = 'DELETE FROM members WHERE id = ?';

/**
 * Comandos SQL para gestão de preferências
 * @namespace PreferenceQueries
 */
const commandGetPreferences = `
    SELECT et.*
    FROM event_types et
             JOIN member_preferred_event_types met ON et.id = met.event_type_id
    WHERE met.member_id = ?
`;
const commandAddPreference = 'INSERT INTO member_preferred_event_types (member_id, event_type_id) VALUES (?, ?)';
const commandRemovePreference = 'DELETE FROM member_preferred_event_types WHERE member_id = ? AND event_type_id = ?';

/**
 * Comandos SQL para gestão de eventos de membros
 * @namespace MemberEventQueries
 */
const commandGetMemberEvents = `
    SELECT e.*
    FROM events e
             JOIN member_events me ON e.id = me.event_id
    WHERE me.member_id = ?
`;

/**
 * Comandos de verificação
 * @namespace ValidationQueries
 */
const checkCommand = 'SELECT * FROM member_preferred_event_types WHERE member_id = ? AND event_type_id = ?';
const checkEventsCommand = `
    SELECT COUNT(*) as eventCount
    FROM member_events me
             JOIN events e ON me.event_id = e.id
    WHERE me.member_id = ? AND e.type_id = ?
`;
const checkExistingPreference = 'SELECT * FROM member_preferred_event_types WHERE member_id = ? AND event_type_id = ?';
const checkPreferredEventType = `
    SELECT COUNT(*) as count
    FROM member_preferred_event_types met
        JOIN events e ON met.event_type_id = e.type_id
    WHERE met.member_id = ? AND e.id = ?
`;

export default {
    /**
     * Obtém todos os membros cadastrados
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Array>}    Lista de membros
     * @throws {Error}              500 - Erro interno do servidor
     */
    async getAllMembers(request, response) {
        await sendResponse(response, commandGetAll, [], (result) => result);
    },

    /**
     * Obtém um membro pelo ID
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Dados do membro
     * @throws {Error}              404 - Membro não encontrado
     * @throws {Error}              500 - Erro interno do servidor
     */
    async getMember(request, response) {
        const id = number(request.params.id);
        await sendResponse(response, commandGetOne, [id], (result) => {
            if (result.length > 0) {
                return result[0];
            } else {
                sendError(response, 'Member not found', 404);
                return null;
            }
        });
    },

    /**
     * Cria um novo membro
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Dados do membro criado
     * @throws {Error}              400 - Nome não fornecido
     * @throws {Error}              500 - Erro interno do servidor
     */
    async createMember(request, response) {
        const name = string(request.body.name);

        if (name) {
            await sendResponse(response, commandCreate, [name], (result) => ({
                id: result.insertId,
                name
            }));
        } else {
            sendError(response, "You must provide a name for the member!");
        }
    },

    /**
     * Atualiza um membro existente
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error}              400 - Nome não fornecido
     * @throws {Error}              500 - Erro interno do servidor
     */
    async updateMember(request, response) {
        const id = number(request.params.id);
        const name = string(request.body.name);

        if (name) {
            await sendResponse(response, commandUpdate, [name, id], () => ({
                message: 'Member updated successfully'
            }));
        } else {
            sendError(response, "You must provide a name for the member!");
        }
    },

    /**
     * Exclui um membro
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error}              400 - Membro possui eventos associados
     * @throws {Error}              500 - Erro interno do servidor
     */
    async deleteMember(request, response) {
        const id = number(request.params.id);
        const checkCommand = 'SELECT * FROM member_events WHERE member_id = ?';

        const registrations = await execute(checkCommand, [id]);
        if (registrations && registrations.length > 0) {
            sendError(response, 'Cannot delete member with event registrations', 400);
            return;
        }

        await sendResponse(response, commandDelete, [id], () => ({
            message: 'Member deleted successfully'
        }));
    },

    /**
     * Obtém as preferências de tipos de evento de um membro
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Array>}    Lista de preferências
     * @throws {Error}              500 - Erro interno do servidor
     */
    async getMemberPreferences(request, response) {
        const id = number(request.params.id);
        await sendResponse(response, commandGetPreferences, [id], (result) => result);
    },

    /**
     * Adiciona uma preferência de tipo de evento a um membro
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error}              400 - IDs inválidos ou preferência já existente
     * @throws {Error}              500 - Erro interno do servidor
     */
    async addMemberPreference(request, response) {
        const memberId = number(request.params.id);
        const eventTypeId = number(request.params.eventTypeId);

        if (!memberId || !eventTypeId) {
            return sendError(response, "Invalid member ID or event type ID", 400);
        }

        try {
            const existingPreference = await execute(checkExistingPreference, [memberId, eventTypeId]);

            if (existingPreference && existingPreference.length > 0) {
                return sendError(response, "Member already has this event type preference", 400);
            }

            await sendResponse(response, commandAddPreference, [memberId, eventTypeId], (result) => {
                if (result.affectedRows > 0) {
                    return { message: 'Member preference added successfully' };
                } else {
                    throw new Error("Failed to add preference");
                }
            });
        } catch (error) {
            console.error('Error in addMemberPreference:', error);
            sendError(response, "An error occurred while adding the preference", 500);
        }
    },

    /**
     * Remove uma preferência de tipo de evento de um membro
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error}              400 - IDs inválidos ou eventos associados
     * @throws {Error}              404 - Preferência não encontrada
     * @throws {Error}              500 - Erro interno do servidor
     */
    async removeMemberPreference(request, response) {
        const memberId = number(request.params.id);
        const eventTypeId = number(request.params.eventTypeId);

        if (!memberId || !eventTypeId) {
            return sendError(response, "Invalid member ID or event type ID", 400);
        }

        try {
            const existingPreference = await execute(checkCommand, [memberId, eventTypeId]);

            if (!existingPreference || existingPreference.length === 0) {
                return sendError(response, "Preference not found", 404);
            }

            const [eventCount] = await execute(checkEventsCommand, [memberId, eventTypeId]);

            if (eventCount && eventCount.eventCount > 0) {
                return sendError(response, "Cannot remove preference. Member has associated events of this type.", 400);
            }

            await sendResponse(response, commandRemovePreference, [memberId, eventTypeId], (result) => {
                if (result.affectedRows > 0) {
                    return { message: 'Member preference removed successfully' };
                } else {
                    throw new Error("Failed to remove preference");
                }
            });
        } catch (error) {
            console.error('Error in removeMemberPreference:', error);
            sendError(response, "An error occurred while removing the preference", 500);
        }
    },

    /**
     * Associa um membro a um evento compatível com suas preferências
     * @async
     * @param {Object} request -    Objeto de requisição HTTP
     * @param {Object} response -   Objeto de resposta HTTP
     * @returns {Promise<Object>}   Mensagem de confirmação
     * @throws {Error}              400 - IDs inválidos ou tipo de evento não permitido
     * @throws {Error}              500 - Erro interno do servidor
     */
    async addMemberEvent(request, response) {
        const memberId = number(request.params.id);
        const eventId = number(request.params.eventId);

        if (!memberId || !eventId) {
            return sendError(response, "Invalid member ID or event ID", 400);
        }

        try {
            const [result] = await execute(checkPreferredEventType, [memberId, eventId]);

            if (result.count === 0) {
                return sendError(response, "Cannot add event. Event type is not in member's preferences.", 400);
            }

            const addMemberEventCommand = 'INSERT INTO member_events (member_id, event_id) VALUES (?, ?)';
            await sendResponse(response, addMemberEventCommand, [memberId, eventId], (result) => {
                if (result.affectedRows > 0) {
                    return { message: 'Member associated with event successfully' };
                } else {
                    throw new Error("Failed to associate member with event");
                }
            });
        } catch (error) {
            console.error('Error in addMemberEvent:', error);
            sendError(response, "An error occurred while associating member with event", 500);
        }
    }
};