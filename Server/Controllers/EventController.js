import { execute, string, number, date, boolean, toBoolean, sendError, sendResponse } from '../Config/Database.js';

const commandGetAll = 'SELECT * FROM events';
const commandGetOne = 'SELECT * FROM events WHERE id = ?';
const commandCreate = 'INSERT INTO events (type_id, description, date) VALUES (?, ?, ?)';
const commandUpdate = 'UPDATE events SET type_id = ?, description = ?, date = ? WHERE id = ?';
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
    }
};