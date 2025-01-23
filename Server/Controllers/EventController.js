import { execute, string, number, date, boolean, toBoolean, sendError, sendResponse } from '../Config/Database.js';

const commandGetAll = 'SELECT * FROM events';
const commandGetOne = 'SELECT * FROM events WHERE id = ?';
const commandCreate = 'INSERT INTO events (name, date, description, event_type_id) VALUES (?, ?, ?, ?)';
const commandUpdate = 'UPDATE events SET name = ?, date = ?, description = ?, event_type_id = ? WHERE id = ?';
const commandDelete = 'DELETE FROM events WHERE id = ?';
const commandCheckRegistrations = 'SELECT * FROM member_events WHERE event_id = ?';

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
        const name = string(request.body.name);
        const eventDate = date(request.body.date);
        const description = string(request.body.description);
        const eventTypeId = number(request.body.event_type_id);

        if (name && eventDate && description && eventTypeId) {
            await sendResponse(response, commandCreate, [name, eventDate, description, eventTypeId], (result) => ({
                id: result.insertId,
                name,
                date: eventDate,
                description,
                event_type_id: eventTypeId
            }));
        } else {
            sendError(response, "You must provide name, date, description, and event type ID for the event!");
        }
    },

    async updateEvent(request, response) {
        const id = number(request.params.id);
        const name = string(request.body.name);
        const eventDate = date(request.body.date);
        const description = string(request.body.description);
        const eventTypeId = number(request.body.event_type_id);

        if (name && eventDate && description && eventTypeId) {
            await sendResponse(response, commandUpdate, [name, eventDate, description, eventTypeId, id], () => ({
                message: 'Event updated successfully'
            }));
        } else {
            sendError(response, "You must provide name, date, description, and event type ID for the event!");
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
    }
};
