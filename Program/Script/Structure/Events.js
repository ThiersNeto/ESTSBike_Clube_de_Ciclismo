class Event {
    // Construtor para criar um novo evento
    constructor(id, typeId, description, date) {
        if (!description || typeof description !== 'string') {
            throw new Error('A descrição deve ser uma string não vazia');
        }
        if (!date || !(date instanceof Date)) {
            throw new Error('A data deve ser um objeto Date válido');
        }
        this.id = id;
        this.typeId = typeId;
        this.description = description.trim();
        this.date = date;
    }
}

class EventManager {
    // Inicializa as estruturas de dados necessárias
    constructor() {
        this.events = [];
        this.currentId = 0;
    }

    // Adiciona um novo evento à lista
    addEvent(typeId, description, date) {
        if (!eventTypeManager.getEventType(typeId)) {
            throw new Error('Tipo de evento inválido');
        }
        this.currentId++;
        const event = new Event(this.currentId, typeId, description, date);
        this.events.push(event);
        return event;
    }

    // Retorna todos os eventos ordenados por data
    getAllEvents() {
        return [...this.events].sort((a, b) => a.date - b.date);
    }

    // Atualiza um evento existente
    updateEvent(id, typeId, description, date) {
        const event = this.events.find(e => e.id === id);
        if (!event) {
            throw new Error('Evento não encontrado');
        }
        if (!eventTypeManager.getEventType(typeId)) {
            throw new Error('Tipo de evento inválido');
        }
        event.typeId = typeId;
        event.description = description.trim();
        event.date = date;
        return true;
    }

    // Remove um evento
    deleteEvent(id) {
        const index = this.events.findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error('Evento não encontrado');
        }
        this.events.splice(index, 1);
        return true;
    }

    // Exibe a interface principal de eventos
    showEvents() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.remove();
        }

        const content = document.createElement('div');
        content.classList.add('main-content', 'events-content');

        content.appendChild(this.createHeader());
        content.appendChild(this.createEventsList());
        content.appendChild(this.createButtonContainer());

        const footer = document.querySelector('.footer');
        document.body.insertBefore(content, footer);
    }

    // Cria o cabeçalho da seção
    createHeader() {
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = 'Eventos';
        return sectionTitle;
    }

    // Cria a lista de eventos
    createEventsList() {
        const eventList = document.createElement('div');
        eventList.classList.add('events-list');

        const tableHeader = this.createTableHeader();
        eventList.appendChild(tableHeader);

        const events = this.getAllEvents();
        if (events.length === 0) {
            eventList.appendChild(this.createEmptyMessage());
        } else {
            events.forEach(event => {
                eventList.appendChild(this.createEventItem(event));
            });
        }

        return eventList;
    }

    // Cria o cabeçalho da tabela
    createTableHeader() {
        const header = document.createElement('div');
        header.classList.add('events-header');
        
        const headers = ['Id', 'Tipo', 'Descritivo', 'Data'];
        headers.forEach(text => {
            const cell = document.createElement('div');
            cell.textContent = text;
            cell.classList.add('header-cell');
            header.appendChild(cell);
        });
        
        return header;
    }

    // Cria um item individual da lista de eventos
    createEventItem(event) {
        const item = document.createElement('div');
        item.classList.add('event-item');
        item.dataset.eventId = event.id;

        const eventType = eventTypeManager.getEventType(event.typeId);
        const formattedDate = event.date.toISOString().split('T')[0];
        
        const cells = [
            event.id, 
            eventType.description, 
            event.description, 
            formattedDate
        ];

        cells.forEach(text => {
            const cell = document.createElement('div');
            cell.textContent = text;
            cell.classList.add('item-cell');
            item.appendChild(cell);
        });

        item.addEventListener('click', () => this.selectEvent(item));
        return item;
    }

    // Cria a mensagem para quando não há eventos
    createEmptyMessage() {
        const message = document.createElement('p');
        message.textContent = 'Não existem eventos cadastrados.';
        message.classList.add('empty-message');
        return message;
    }

    // Cria o container com os botões de ação
    createButtonContainer() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buttons = [
            { text: 'Criar', action: () => this.showEventForm() },
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

    // Exibe o formulário para criar/editar um evento
    showEventForm(selectedEvent = null) {
        const content = document.querySelector('.main-content');
        content.innerHTML = '';

        const formTitle = document.createElement('h2');
        formTitle.textContent = selectedEvent ? 'Alterar Evento' : 'Novo Evento';
        content.appendChild(formTitle);

        const form = this.createForm(selectedEvent);
        content.appendChild(form);
    }

    // Cria o formulário para entrada de dados
    createForm(selectedEvent) {
        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');

        // Tipo de evento (select)
        const typeSelect = document.createElement('select');
        typeSelect.classList.add('event-input');
        const eventTypes = eventTypeManager.getAllEventTypes();
        eventTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.description;
            if (selectedEvent && selectedEvent.typeId === type.id) {
                option.selected = true;
            }
            typeSelect.appendChild(option);
        });

        // Descrição
        const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.classList.add('event-input');
        descInput.placeholder = 'Descrição';
        if (selectedEvent) {
            descInput.value = selectedEvent.description;
        }

        // Data
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.classList.add('event-input');
        if (selectedEvent) {
            dateInput.value = selectedEvent.date.toISOString().split('T')[0];
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Gravar';
        saveButton.classList.add('action-button');
        saveButton.addEventListener('click', () => {
            const date = new Date(dateInput.value);
            this.handleSave(
                parseInt(typeSelect.value),
                descInput.value,
                date,
                selectedEvent
            );
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.classList.add('action-button');
        cancelButton.addEventListener('click', () => this.showEvents());

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);

        formContainer.appendChild(typeSelect);
        formContainer.appendChild(descInput);
        formContainer.appendChild(dateInput);
        formContainer.appendChild(buttonContainer);

        return formContainer;
    }

    // Gerencia a seleção de um item na lista
    selectEvent(element) {
        const previousSelected = document.querySelector('.event-item.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        element.classList.add('selected');
    }

    // Gerencia a ação de editar
    handleEdit() {
        const selected = document.querySelector('.event-item.selected');
        if (!selected) {
            this.showError('Selecione um evento para editar.');
            return;
        }
        const eventId = parseInt(selected.dataset.eventId);
        const event = this.events.find(e => e.id === eventId);
        this.showEventForm(event);
    }

    // Gerencia a ação de deletar
    handleDelete() {
        const selected = document.querySelector('.event-item.selected');
        if (!selected) {
            this.showError('Selecione um evento para apagar.');
            return;
        }
        
        try {
            const eventId = parseInt(selected.dataset.eventId);
            this.deleteEvent(eventId);
            this.showEvents();
        } catch (error) {
            this.showError(error.message);
        }
    }

    // Gerencia o salvamento
    handleSave(typeId, description, date, selectedEvent) {
        if (!description.trim() || !date) {
            this.showError('Preencha todos os campos.');
            return;
        }

        try {
            if (selectedEvent) {
                this.updateEvent(selectedEvent.id, typeId, description, date);
            } else {
                this.addEvent(typeId, description, date);
            }
            this.showEvents();
        } catch (error) {
            this.showError(error.message);
        }
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

// Instância global do gerenciador de eventos
const eventManager = new EventManager();