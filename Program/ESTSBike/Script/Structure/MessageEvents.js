
/**
 * Classe responsável pelo gerenciamento de mensagens do sistema
 * @class MessageEvents
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * @author André Rocha - 202300185 - 202300185@estudantes.ips.pt
 */

class MessageEvents {
    /**
     * Mensagens de Seleção
     * Utilizadas para orientar o usuário sobre seleções necessárias
     */;
    static SELECT_EVENT_EDIT = 'Selecione um evento para editar.';
    static SELECT_EVENT_DELETE = 'Selecione um evento para apagar.';
    static SELECT_EVENT_TYPE_EDIT = 'Selecione um tipo de evento para editar';
    static SELECT_EVENT_TYPE_DELETE = 'Selecione um tipo de evento para apagar';

    /**
     * Mensagens de Validação
     * Utilizadas para validação de campos e dados
     */
    static REQUIRED_FIELDS = 'Preencha todos os campos.';
    static REQUIRED_DESCRIPTION = 'A descrição deve ser uma string não vazia';
    static REQUIRED_NAME = 'O nome deve ser uma string não vazia';
    static INVALID_DATE = 'A data deve ser um objeto Date válido';
    static INVALID_EVENT_TYPE = 'Tipo de evento inválido';

    /**
     * Mensagens de Erro
     * Utilizadas para indicar erros no sistema
     */
    static MEMBER_NOT_FOUND = 'Membro não encontrado';
    static EVENT_NOT_FOUND = 'Evento não encontrado';
    static EVENT_TYPE_NOT_FOUND = 'Tipo de evento não encontrado';
    static EVENT_TYPE_IN_USE = 'Não é possível excluir: existem eventos cadastrados com este tipo';
    static EVENT_TYPE_IN_PREFERENCES = 'Não é possível excluir: tipo de evento associado a preferências de membros';

    /**
     * Mensagens de Estado
     * Utilizadas para indicar estados do sistema
     */
    static NO_MEMBERS = 'Não existem membros registrados.';
    static NO_EVENTS = 'Não existem eventos cadastrados.';
    static NO_EVENT_TYPES = 'Não existem tipos de eventos cadastrados.';

    /**
     * Mensagens de Sucesso
     * Utilizadas para confirmar operações bem-sucedidas
     */
    static SUCCESS_CREATE = 'Registro criado com sucesso!';
    static SUCCESS_UPDATE = 'Registro atualizado com sucesso!';
    static SUCCESS_DELETE = 'Registro excluído com sucesso!';

    /**
     * Exibe uma mensagem de erro
     * @static
     * @param {string} message -            Mensagem de erro a ser exibida
     * @param {HTMLElement} [element] -     Elemento onde a mensagem será exibida
     */
    static showError(message, element) {
        MessageEvents.removeExistingMessages();
        
        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-message');
        errorContainer.id = 'error-message';
        errorContainer.textContent = message;
        
        if (element) {
            element.appendChild(errorContainer);
        } else {
            document.body.appendChild(errorContainer);
        }

        setTimeout(() => errorContainer.remove(), 3000);
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
        successContainer.textContent = message;
        
        document.body.appendChild(successContainer);

        setTimeout(() => successContainer.remove(), 3000);
    }

    /**
     * Remove mensagens existentes na tela
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
        messageElement.textContent = message;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('confirm-buttons');
        
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmar';
        confirmButton.id = 'btn-confirm';
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
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