/**
 * @fileoverview Gerenciamento de mensagens e notificações do sistema
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * @author André Rocha - 202300185 - 202300185@estudantes.ips.pt
 */

/**
 * Classe responsável pelo gerenciamento de mensagens do sistema
 * @class MessageEvents
 */
class MessageEvents {
    /**
     * @static
     * @description Mensagens do sistema organizadas por categoria
     * 
     * Mensagens de Seleção:
     * - SELECT_MEMBER_EDIT: Seleção de membro para edição
     * - SELECT_MEMBER_DELETE: Seleção de membro para exclusão
     * - SELECT_EVENT_EDIT: Seleção de evento para edição
     * - SELECT_EVENT_DELETE: Seleção de evento para exclusão
     * - SELECT_EVENT_TYPE_EDIT: Seleção de tipo de evento para edição
     * - SELECT_EVENT_TYPE_DELETE: Seleção de tipo de evento para exclusão
     * 
     * Mensagens de Validação:
     * - REQUIRED_FIELDS: Campos obrigatórios
     * - REQUIRED_DESCRIPTION: Descrição obrigatória
     * - REQUIRED_NAME: Nome obrigatório
     * - INVALID_DATE: Data inválida
     * - INVALID_EVENT_TYPE: Tipo de evento inválido
     * 
     * Mensagens de Erro:
     * - MEMBER_NOT_FOUND: Membro não encontrado
     * - EVENT_NOT_FOUND: Evento não encontrado
     * - EVENT_TYPE_NOT_FOUND: Tipo de evento não encontrado
     * - EVENT_TYPE_IN_USE: Tipo de evento em uso
     * - EVENT_TYPE_IN_PREFERENCES: Tipo de evento em preferências
     * 
     * Mensagens de Estado:
     * - NO_MEMBERS: Lista de membros vazia
     * - NO_EVENTS: Lista de eventos vazia
     * - NO_EVENT_TYPES: Lista de tipos de eventos vazia
     * - NO_EVENTS_AVAILABLE: Nenhum evento disponível
     * 
     * Mensagens de Sucesso:
     * - SUCCESS_CREATE: Sucesso na criação
     * - SUCCESS_UPDATE: Sucesso na atualização
     * - SUCCESS_DELETE: Sucesso na exclusão
     */
    static SELECT_MEMBER_EDIT = 'Selecione um membro para editar.';
    static SELECT_MEMBER_DELETE = 'Selecione um membro para apagar.';
    static SELECT_EVENT_EDIT = 'Selecione um evento para editar.';
    static SELECT_EVENT_DELETE = 'Selecione um evento para apagar.';
    static SELECT_EVENT_TYPE_EDIT = 'Selecione um tipo de evento para editar';
    static SELECT_EVENT_TYPE_DELETE = 'Selecione um tipo de evento para apagar';
    static REQUIRED_FIELDS = 'Preencha todos os campos.';
    static REQUIRED_DESCRIPTION = 'A descrição deve ser uma string não vazia';
    static REQUIRED_NAME = 'O nome deve ser uma string não vazia';
    static INVALID_DATE = 'A data deve ser um objeto Date válido';
    static INVALID_EVENT_TYPE = 'Tipo de evento inválido';
    static MEMBER_NOT_FOUND = 'Membro não encontrado';
    static EVENT_NOT_FOUND = 'Evento não encontrado';
    static EVENT_TYPE_NOT_FOUND = 'Tipo de evento não encontrado';
    static EVENT_TYPE_IN_USE = 'Não é possível excluir: tipo de evento associado a eventos existentes';
    static EVENT_TYPE_IN_PREFERENCES = 'Não é possível excluir: tipo de evento associado a preferências de membros';
    static NO_MEMBERS = 'Não existem membros registrados.';
    static NO_EVENTS = 'Não existem eventos cadastrados.';
    static NO_EVENT_TYPES = 'Não existem tipos de eventos cadastrados.';
    static NO_EVENTS_AVAILABLE = 'Nenhum evento disponível. Adicione eventos primeiro.';
    static SUCCESS_CREATE = 'Registro criado com sucesso!';
    static SUCCESS_UPDATE = 'Registro atualizado com sucesso!';
    static SUCCESS_DELETE = 'Registro excluído com sucesso!';

    /**
     * Exibe uma mensagem de erro
     * @static
     * @param {string} message - Mensagem de erro a ser exibida
     */
    static showError(message) {
        MessageEvents.removeExistingMessages();
        
        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-message');
        errorContainer.id = 'error-message';
        const messageText = document.createTextNode(message);
        errorContainer.appendChild(messageText);
        
        document.body.appendChild(errorContainer);

        setTimeout(() => {
            const container = document.getElementById('error-message');
            if (container) {
                container.remove();
            }
        }, 3000);
    }

    /**
     * Exibe uma mensagem de sucesso
     * @static
     * @param {string} message - Mensagem de sucesso a ser exibida
     */
    static showSuccess(message) {
        MessageEvents.removeExistingMessages();
        
        const successContainer = document.createElement('div');
        successContainer.classList.add('success-message');
        successContainer.id = 'success-message';
        const messageText = document.createTextNode(message);
        successContainer.appendChild(messageText);
        
        document.body.appendChild(successContainer);

        setTimeout(() => {
            const container = document.getElementById('success-message');
            if (container) {
                container.remove();
            }
        }, 3000);
    }

    /**
     * Remove todas as mensagens existentes na tela
     * @static
     * @private
     */
    static removeExistingMessages() {
        const existingMessages = document.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(message => message.remove());
    }

    /**
     * Exibe um diálogo de confirmação
     * @static
     * @param {string} message - Mensagem de confirmação
     * @param {Function} onConfirm - Função a ser executada ao confirmar
     */
    static showConfirm(message, onConfirm) {
        const confirmContainer = document.createElement('div');
        confirmContainer.classList.add('confirm-message');
        confirmContainer.id = 'confirm-dialog';
        
        const messageElement = document.createElement('p');
        const messageText = document.createTextNode(message);
        messageElement.appendChild(messageText);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('confirm-buttons');
        
        const confirmButton = document.createElement('button');
        const confirmText = document.createTextNode('Confirmar');
        confirmButton.appendChild(confirmText);
        confirmButton.id = 'btn-confirm';
        
        const cancelButton = document.createElement('button');
        const cancelText = document.createTextNode('Cancelar');
        cancelButton.appendChild(cancelText);
        cancelButton.id = 'btn-cancel';
        
        confirmButton.addEventListener('click', () => {
            onConfirm();
            confirmContainer.remove();
        });
        
        cancelButton.addEventListener('click', () => confirmContainer.remove());
        
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
        confirmContainer.appendChild(messageElement);
        confirmContainer.appendChild(buttonContainer);
        
        document.body.appendChild(confirmContainer);
    }
}