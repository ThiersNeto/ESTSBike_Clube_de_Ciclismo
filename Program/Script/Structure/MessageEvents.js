// Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
// André Rocha - 202300185 - 202300185@estudantes.ips.pt

class MessageEvents {
    // Mensagens de seleção
    static SELECT_MEMBER_EDIT = 'Selecione um membro para editar.';
    static SELECT_MEMBER_DELETE = 'Selecione um membro para apagar.';
    static SELECT_EVENT_EDIT = 'Selecione um evento para editar.';
    static SELECT_EVENT_DELETE = 'Selecione um evento para apagar.';
    static SELECT_EVENT_TYPE_EDIT = 'Selecione um tipo de evento para editar';
    static SELECT_EVENT_TYPE_DELETE = 'Selecione um tipo de evento para apagar';

    // Mensagens de validação
    static REQUIRED_FIELDS = 'Preencha todos os campos.';
    static REQUIRED_DESCRIPTION = 'A descrição deve ser uma string não vazia';
    static REQUIRED_NAME = 'O nome deve ser uma string não vazia';
    static INVALID_DATE = 'A data deve ser um objeto Date válido';
    static INVALID_EVENT_TYPE = 'Tipo de evento inválido';

    // Mensagens de erro
    static MEMBER_NOT_FOUND = 'Membro não encontrado';
    static EVENT_NOT_FOUND = 'Evento não encontrado';
    static EVENT_TYPE_NOT_FOUND = 'Tipo de evento não encontrado';
    static EVENT_TYPE_IN_USE = 'Não é possível excluir: tipo de evento associado a eventos existentes';
    static EVENT_TYPE_IN_PREFERENCES = 'Não é possível excluir: tipo de evento associado a preferências de membros';

    // Mensagens vazias
    static NO_MEMBERS = 'Não existem membros registrados.';
    static NO_EVENTS = 'Não existem eventos cadastrados.';
    static NO_EVENT_TYPES = 'Não existem tipos de eventos cadastrados.';
    static NO_EVENTS_AVAILABLE = 'Nenhum evento disponível. Adicione eventos primeiro.';

    // Mensagens de sucesso
    static SUCCESS_CREATE = 'Registro criado com sucesso!';
    static SUCCESS_UPDATE = 'Registro atualizado com sucesso!';
    static SUCCESS_DELETE = 'Registro excluído com sucesso!';

    // Método para exibir mensagens de erro
    static showError(message, container) {
        MessageEvents.removeExistingMessages();
        
        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-message');
        errorContainer.textContent = message;
        
        document.body.appendChild(errorContainer);

        setTimeout(() => {
            if (errorContainer && errorContainer.parentNode) {
                errorContainer.remove();
            }
        }, 3000);
    }

    // Método para exibir mensagens de sucesso
    static showSuccess(message) {
        MessageEvents.removeExistingMessages();
        
        const successContainer = document.createElement('div');
        successContainer.classList.add('success-message');
        successContainer.textContent = message;
        
        document.body.appendChild(successContainer);

        setTimeout(() => {
            if (successContainer && successContainer.parentNode) {
                successContainer.remove();
            }
        }, 3000);
    }

    // Remove mensagens existentes
    static removeExistingMessages() {
        const existingMessages = document.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(message => message.remove());
    }

    // Método para mostrar confirmação
    static showConfirm(message, onConfirm) {
        const confirmContainer = document.createElement('div');
        confirmContainer.classList.add('confirm-message');
        
        const messageText = document.createElement('p');
        messageText.textContent = message;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('confirm-buttons');
        
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmar';
        confirmButton.classList.add('confirm-button');
        confirmButton.onclick = () => {
            onConfirm();
            confirmContainer.remove();
        };
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.classList.add('cancel-button');
        cancelButton.onclick = () => confirmContainer.remove();
        
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
        confirmContainer.appendChild(messageText);
        confirmContainer.appendChild(buttonContainer);
        
        document.body.appendChild(confirmContainer);
    }
}