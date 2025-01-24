import express from 'express';
import memberController from '../Controllers/MemberController.js';

const router = express.Router();

router.get('/', memberController.getAllMembers);
router.get('/:id', memberController.getMember);
router.post('/', memberController.createMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

// Rotas adicionais para gerir preferências de tipos de eventos dos membros
router.get('/:id/preferences', memberController.getMemberPreferences);
router.post('/:id/preferences', memberController.addMemberPreference);
router.delete('/:id/preferences/:eventTypeId', memberController.removeMemberPreference);

// rota para adicionar um membro a um evento
router.post('/:id/events', memberController.addMemberEvent);

export default router;