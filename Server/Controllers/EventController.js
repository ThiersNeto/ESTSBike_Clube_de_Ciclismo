import { execute, string, number, date, boolean, toBoolean, sendError, sendResponse } from '../Config/Database.js';

const commandGetAll = 'SELECT * FROM events';
const commandGetOne = 'SELECT * FROM events WHERE id = ?';
const commandCreate = 'INSERT INTO events (type_id, description, date) VALUES (?, ?, ?)';
const commandUpdate = 'UPDATE events SET type_id = ?, description = ?, date = ? WHERE id = ?';
const commandDelete = 'DELETE FROM events WHERE id = ?';
const commandCheckRegistrations = 'SELECT * FROM member_events WHERE event_id = ?';
const commandSubscribe = 'INSERT INTO member_events (member_id, event_id) VALUES (?, ?)';
const commandUnsubscribe = 'DELETE FROM member_events WHERE member_id = ? AND event_id = ?';
const checkPreferredTypeCommand = `
            SELECT 1
            FROM member_preferred_event_types mpt
            JOIN events e ON e.type_id = mpt.event_type_id
            WHERE mpt.member_id = ? AND e.id = ?
        `;
        const commandGetMembers = `
        SELECT m.id, m.name 
        FROM members m 
        JOIN member_events me ON m.id = me.member_id 
        WHERE me.event_id = ?
    `;


export default {
    async getAllEvents(request, response) {
        await sendResponse(response, commandGetAll, [], (result) => result);
    },

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