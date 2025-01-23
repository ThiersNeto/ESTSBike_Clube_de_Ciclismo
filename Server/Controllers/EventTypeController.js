import { execute, string, number, sendError, sendResponse } from '../Config/Database.js';

const commandGetAll = 'SELECT * FROM event_types';
const commandGetOne = 'SELECT * FROM event_types WHERE id = ?';
const commandCreate = 'INSERT INTO event_types (description) VALUES (?)';
const commandUpdate = 'UPDATE event_types SET description = ? WHERE id = ?';
const commandDelete = 'DELETE FROM event_types WHERE id = ?';
const commandCheckEvents = 'SELECT * FROM events WHERE event_type_id = ?';

export default {
    async getAllEventTypes(request, response) {
        await sendResponse(response, commandGetAll, [], (result) => result);
    },

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

    async deleteEventType(request, response) {
        const id = number(request.params.id);
        
        const events = await execute(commandCheckEvents, [id]);
        if (events && events.length > 0) {
            sendError(response, 'Cannot delete event type with associated events', 400);
            return;
        }
        
        await sendResponse(response, commandDelete, [id], () => ({
            message: 'Event type deleted successfully'
        }));
    }
};