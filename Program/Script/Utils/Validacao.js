/**
 * @fileoverview Utilitário de validação para o sistema
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * @author André Rocha - 202300185 - 202300185@estudantes.ips.pt
 */

class Validacao {
    /**
     * Verifica se um membro pode ser excluído
     * @param {number} memberId - ID do membro
     * @param {Array} eventSubscriptions - Array de inscrições em eventos
     * @returns {boolean} - true se pode ser excluído, false caso contrário
     * @throws {Error} Se o membro tiver inscrições ativas
     */
    static validarExclusaoMembro(memberId, eventSubscriptions) {
        const inscricoesAtivas = eventSubscriptions.filter(sub => sub.memberId === memberId);
        
        if (inscricoesAtivas.length > 0) {
            throw new Error('Não é possível excluir: Membro possui inscrições em eventos ativos');
        }
        
        return true;
    }

    /**
     * Verifica se um evento pode ser excluído
     * @param {number} eventId - ID do evento
     * @param {Array} eventSubscriptions - Array de inscrições em eventos
     * @returns {boolean} - true se pode ser excluído, false caso contrário
     * @throws {Error} Se o evento tiver inscrições ativas
     */
    static validarExclusaoEvento(eventId, eventSubscriptions) {
        const inscricoesAtivas = eventSubscriptions.filter(sub => sub.eventId === eventId);
        
        if (inscricoesAtivas.length > 0) {
            throw new Error('Não é possível excluir: Evento possui membros inscritos');
        }
        
        return true;
    }
}
