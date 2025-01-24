import { execute, string, number, boolean, toBoolean, sendError, sendResponse } from '../Config/Database.js';

const commandGetAll = 'SELECT * FROM members';
const commandGetOne = 'SELECT * FROM members WHERE id = ?';
const commandCreate = 'INSERT INTO members (name) VALUES (?)';
const commandUpdate = 'UPDATE members SET name = ? WHERE id = ?';
const commandDelete = 'DELETE FROM members WHERE id = ?';
const commandGetPreferences = `
    SELECT et.* 
    FROM event_types et 
    JOIN member_event_types met ON et.id = met.event_type_id 
    WHERE met.member_id = ?
`;
const commandAddPreference = 'INSERT INTO member_event_types (member_id, event_type_id) VALUES (?, ?)';
const commandRemovePreference = 'DELETE FROM member_event_types WHERE member_id = ? AND event_type_id = ?';
const commandGetMemberEvents = `
    SELECT e.* 
    FROM events e 
    JOIN member_events me ON e.id = me.event_id 
    WHERE me.member_id = ?
`;

export default {
    async getAllMembers(request, response) {
        await sendResponse(response, commandGetAll, [], (result) => result);
    },

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

    async getMemberPreferences(request, response) {
        const id = number(request.params.id);
        await sendResponse(response, commandGetPreferences, [id], (result) => result);
    },

    async addMemberPreference(request, response) {
        const memberId = number(request.params.id);
        const eventTypeId = number(request.body.event_type_id);

        if (memberId && eventTypeId) {
            await sendResponse(response, commandAddPreference, [memberId, eventTypeId], () => ({
                message: 'Member preference added successfully'
            }));
        } else {
            sendError(response, "You must provide member ID and event type ID!");
        }
    },

    async removeMemberPreference(request, response) {
        const memberId = number(request.params.id);
        const eventTypeId = number(request.params.eventTypeId);

        await sendResponse(response, commandRemovePreference, [memberId, eventTypeId], () => ({
            message: 'Member preference removed successfully'
        }));
    }
};
