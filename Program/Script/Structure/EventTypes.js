class EventType {
    // Construtor para criar um novo tipo de evento
    constructor(id, description) {
        if (!description || typeof description !== 'string') {
            throw new Error('A descrição deve ser uma string não vazia');
        }
        this.id = id;
        this.description = description.trim();
    }
}

class EventTypeManager {
    // Inicializa as estruturas de dados necessárias
    constructor() {
        this.eventTypes = [];
        this.currentId = 0;
        this.eventAssociations = [];
        this.memberPreferences = [];
    }

    // Adiciona um novo tipo de evento à lista
    addEventType(description) {
        if (!description || typeof description !== 'string') {
            throw new Error('A descrição deve ser uma string não vazia');
        }
        this.currentId++;
        const eventType = new EventType(this.currentId, description);
        this.eventTypes.push(eventType);
        return eventType;
    }

    // Retorna uma cópia da lista de todos os tipos de eventos
    getAllEventTypes() {
        return [...this.eventTypes];
    }

    // Atualiza a descrição de um tipo de evento existente
    updateEventType(id, description) {
        if (!description || typeof description !== 'string') {
            throw new Error('A descrição deve ser uma string não vazia');
        }
        const eventType = this.eventTypes.find(et => et.id === id);
        if (!eventType) {
            throw new Error('Tipo de evento não encontrado');
        }
        eventType.description = description.trim();
        return true;
    }

    // Remove um tipo de evento se não estiver em uso
    deleteEventType(id) {
        if (this.eventAssociations.some(ea => ea.eventTypeId === id)) {
            throw new Error('Não é possível excluir: tipo de evento associado a eventos existentes');
        }
        if (this.memberPreferences.some(mp => mp.eventTypeId === id)) {
            throw new Error('Não é possível excluir: tipo de evento associado a preferências de membros');
        }
        const index = this.eventTypes.findIndex(et => et.id === id);
        if (index === -1) {
            throw new Error('Tipo de evento não encontrado');
        }
        this.eventTypes.splice(index, 1);
        return true;
    }

    // Busca um tipo de evento específico pelo ID
    getEventType(id) {
        const eventType = this.eventTypes.find(et => et.id === id);
        if (!eventType) {
            throw new Error('Tipo de evento não encontrado');
        }
        return eventType;
    }

    // Exibe a interface principal de tipos de eventos
    showEventTypes() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.remove();
        }

        const content = document.createElement('div');
        content.classList.add('main-content');

        content.appendChild(this.createHeader());
        content.appendChild(this.createButtonContainer());
        content.appendChild(this.createEventTypesList());

        const footer = document.querySelector('.footer');
        document.body.insertBefore(content, footer);
    }

    // Cria o cabeçalho da seção
    createHeader() {
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Tipos de Eventos';
        return sectionTitle;
    }

    // Cria o container com os botões de ação
    createButtonContainer() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buttons = [
            { text: 'Criar', action: () => this.showEventTypeForm() },
            { text: 'Editar', action: () => this.handleEdit() },
            { text: 'Apagar', action: () => this.handleDelete() }
        ];

        buttons.forEach(({ text, action }) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.classList.add('action-button');
            button.addEventListener('click', action);
            buttonContainer.appendChild(button);
        });

        return buttonContainer;
    }

    // Cria a lista de tipos de eventos
    createEventTypesList() {
        const eventList = document.createElement('div');
        eventList.classList.add('event-types-list');

        const tableHeader = this.createTableHeader();
        eventList.appendChild(tableHeader);

        const eventTypes = this.getAllEventTypes();
        if (eventTypes.length === 0) {
            eventList.appendChild(this.createEmptyMessage());
        } else {
            eventTypes.forEach(eventType => {
                eventList.appendChild(this.createEventTypeItem(eventType));
            });
        }

        return eventList;
    }

    // Cria o cabeçalho da tabela de tipos de eventos
    createTableHeader() {
        const header = document.createElement('div');
        header.classList.add('event-types-header');
        
        const headers = ['Id', 'Descritivo'];
        headers.forEach(text => {
            const cell = document.createElement('div');
            cell.textContent = text;
            cell.classList.add('header-cell');
            header.appendChild(cell);
        });
        
        return header;
    }

    // Cria um item individual da lista de tipos de eventos
    createEventTypeItem(eventType) {
        const item = document.createElement('div');
        item.classList.add('event-type-item');
        item.dataset.eventTypeId = eventType.id;

        const cells = [eventType.id, eventType.description];
        cells.forEach(text => {
            const cell = document.createElement('div');
            cell.textContent = text;
            cell.classList.add('item-cell');
            item.appendChild(cell);
        });

        item.addEventListener('click', () => this.selectEventType(item));
        return item;
    }

    // Cria a mensagem para quando não há tipos de eventos cadastrados
    createEmptyMessage() {
        const message = document.createElement('p');
        message.textContent = 'Não existem tipos de eventos cadastrados.';
        message.classList.add('empty-message');
        return message;
    }

    // Exibe o formulário para criar/editar um tipo de evento
    showEventTypeForm(selectedEventType = null) {
        const content = document.querySelector('.main-content');
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        const formTitle = document.createElement('h2');
        formTitle.textContent = selectedEventType ? 'Alterar Tipo de Evento' : 'Novo Tipo de Evento';
        content.appendChild(formTitle);

        const form = this.createForm(selectedEventType);
        content.appendChild(form);
    }

    // Cria o formulário para entrada de dados
    createForm(selectedEventType) {
        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');

        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('event-type-input');
        if (selectedEventType) {
            input.value = selectedEventType.description;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Gravar';
        saveButton.classList.add('action-button');
        saveButton.addEventListener('click', () => this.handleSave(input.value, selectedEventType));

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.classList.add('action-button');
        cancelButton.addEventListener('click', () => this.showEventTypes());

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);

        formContainer.appendChild(input);
        formContainer.appendChild(buttonContainer);
        return formContainer;
    }

    // Gerencia a ação de editar um tipo de evento
    handleEdit() {
        const selected = document.querySelector('.event-type-item.selected');
        if (!selected) {
            this.showError('Selecione um tipo de evento para editar');
            return;
        }
        const eventTypeId = parseInt(selected.dataset.eventTypeId);
        const eventType = this.getEventType(eventTypeId);
        this.showEventTypeForm(eventType);
    }

    // Gerencia a ação de deletar
    handleDelete() {
        const selected = document.querySelector('.event-type-item.selected');
        if (!selected) {
            this.showError('Selecione um tipo de evento para apagar');
            return;
        }
        
        try {
            const eventTypeId = parseInt(selected.dataset.eventTypeId);
            this.deleteEventType(eventTypeId);
            this.showEventTypes();
        } catch (error) {
            this.showError(error.message);
        }
    }

    // Gerencia o salvamento
    handleSave(value, selectedEventType) {
        if (!value.trim()) {
            this.showError('O campo descrição é obrigatório');
            return;
        }

        try {
            if (selectedEventType) {
                this.updateEventType(selectedEventType.id, value.trim());
            } else {
                this.addEventType(value.trim());
            }
            this.showEventTypes();
        } catch (error) {
            this.showError(error.message);
        }
    }

    // Gerencia a seleção de um item na lista
    selectEventType(element) {
        const previousSelected = document.querySelector('.event-type-item.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        element.classList.add('selected');
    }

    // Exibe mensagens de erro temporárias
    showError(message) {
        const content = document.querySelector('.main-content');
        const existingError = content.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-message');
        errorContainer.textContent = message;
        content.insertBefore(errorContainer, content.firstChild);

        setTimeout(() => errorContainer.remove(), 3000);
    }
}

// Instância global do gerenciador de tipos de eventos
const eventTypeManager = new EventTypeManager(); 