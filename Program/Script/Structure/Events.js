/**
 * @fileoverview Gerenciamento de eventos do clube de ciclismo
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * @author André Rocha - 202300185 - 202300185@estudantes.ips.pt
 */

/**
 * Classe que representa um evento individual
 * Cria uma nova instância de Event
 * @class Event
 * @constructor
 * @param {number} id - Identificador único do evento
 * @param {number} typeId - ID do tipo de evento associado
 * @param {string} description - Descrição do evento
 * @param {Date} date - Data do evento
 * @throws {Error} Se a descrição estiver vazia ou não for string
 * @throws {Error} Se a data não for um objeto Date válido
 */
class Event {
    constructor(id, typeId, description, date) {
        if (!description || typeof description !== 'string') {
            throw new Error(MessageEvents.REQUIRED_DESCRIPTION);
        }
        if (!date || !(date instanceof Date)) {
            throw new Error(MessageEvents.INVALID_DATE);
        }
        this.id = id;
        this.typeId = typeId;
        this.description = description.trim();
        this.date = date;
    }
}

/**
 * Classe responsável pelo gerenciamento de eventos
 * @class EventManager
 */
class EventManager {
    /**
     * Inicializa o gerenciador de eventos
     * @constructor
     */
    constructor() {
        this.events = [];
        this.currentId = 0;
    }

    /**
     * Adiciona um novo evento
     * @param {number} typeId - ID do tipo de evento
     * @param {string} description - Descrição do evento
     * @param {Date} date - Data do evento
     * @returns {Event} O evento criado
     * @throws {Error} Se o tipo de evento não existir
     */
    addEvent(typeId, description, date) {
        if (!eventTypeManager.getEventType(typeId)) {
            throw new Error(MessageEvents.INVALID_EVENT_TYPE);
        }
        this.currentId++;
        const event = new Event(this.currentId, typeId, description, date);
        this.events.push(event);
        return event;
    }

    /**
     * Retorna todos os eventos ordenados por data
     * @returns {Event[]} Array de eventos ordenados
     */
    getAllEvents() {
        return [...this.events].sort((a, b) => a.date - b.date);
    }

    /**
     * Atualiza um evento existente
     * @param {number} id - ID do evento a ser atualizado
     * @param {number} typeId - Novo ID do tipo de evento
     * @param {string} description - Nova descrição
     * @param {Date} date - Nova data
     * @returns {boolean} true se atualizado com sucesso
     * @throws {Error} Se o evento não for encontrado ou tipo de evento for inválido
     */
    updateEvent(id, typeId, description, date) {
        const event = this.events.find(e => e.id === id);
        if (!event) {
            throw new Error(MessageEvents.EVENT_NOT_FOUND);
        }
        if (!eventTypeManager.getEventType(typeId)) {
            throw new Error(MessageEvents.INVALID_EVENT_TYPE);
        }
        event.typeId = typeId;
        event.description = description.trim();
        event.date = date;
        return true;
    }

    /**
     * Remove um evento
     * @param {number} id - ID do evento a ser removido
     * @returns {boolean} true se removido com sucesso
     * @throws {Error} Se o evento não for encontrado
     */
    deleteEvent(id) {
        const index = this.events.findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error(MessageEvents.EVENT_NOT_FOUND);
        }
        this.events.splice(index, 1);
        return true;
    }

    /**
     * Exibe a interface principal de eventos
     * @private
     */
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

    /**
     * Cria o cabeçalho da seção de eventos
     * @private
     * @returns {HTMLElement} Elemento do cabeçalho
     */
    createHeader() {
        const sectionTitle = document.createElement('h2');
        const titleText = document.createTextNode('Eventos');
        sectionTitle.appendChild(titleText);
        return sectionTitle;
    }

    /**
     * Cria a lista de eventos
     * @private
     * @returns {HTMLElement} Elemento contendo a lista de eventos
     */
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

    /**
     * Cria o cabeçalho da tabela de eventos
     * @private
     * @returns {HTMLElement} Elemento do cabeçalho da tabela
     */
    createTableHeader() {
        const header = document.createElement('div');
        header.classList.add('events-header');
        
        const headers = ['Id', 'Tipo', 'Descritivo', 'Data'];
        headers.forEach(text => {
            const cell = document.createElement('div');
            cell.classList.add('header-cell');
            const cellText = document.createTextNode(text);
            cell.appendChild(cellText);
            header.appendChild(cell);
        });
        
        return header;
    }

    /**
     * Cria um item individual da lista de eventos
     * @private
     * @param {Event} event - Evento a ser exibido
     * @returns {HTMLElement} Elemento representando o evento
     */
    createEventItem(event) {
        const item = document.createElement('div');
        item.classList.add('event-item');
        item.id = `event-${event.id}`;

        const eventType = eventTypeManager.getEventType(event.typeId);
        const formattedDate = event.date.toISOString().split('T')[0];
        
        const cells = [
            event.id.toString(), 
            eventType.description, 
            event.description, 
            formattedDate
        ];

        cells.forEach(text => {
            const cell = document.createElement('div');
            cell.classList.add('item-cell');
            const cellText = document.createTextNode(text);
            cell.appendChild(cellText);
            item.appendChild(cell);
        });

        item.addEventListener('click', () => this.selectEvent(item));
        return item;
    }

    /**
     * Cria mensagem para quando não há eventos
     * @private
     * @returns {HTMLElement} Elemento com a mensagem
     */
    createEmptyMessage() {
        const message = document.createElement('p');
        message.classList.add('empty-message');
        const messageText = document.createTextNode(MessageEvents.NO_EVENTS);
        message.appendChild(messageText);
        return message;
    }

    /**
     * Cria o container com os botões de ação
     * @private
     * @returns {HTMLElement} Container com os botões
     */
    createButtonContainer() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buttons = [
            { text: 'Criar', id: 'btn-event-create', action: () => this.showEventForm() },
            { text: 'Editar', id: 'btn-event-edit', action: () => this.handleEdit() },
            { text: 'Apagar', id: 'btn-event-delete', action: () => this.handleDelete() }
        ];

        buttons.forEach(({ text, id, action }) => {
            const button = document.createElement('button');
            button.classList.add('action-button');
            button.id = id;
            const buttonText = document.createTextNode(text);
            button.appendChild(buttonText);
            button.addEventListener('click', action);
            buttonContainer.appendChild(button);
        });

        return buttonContainer;
    }

    /**
     * Exibe o formulário de evento
     * @private
     * @param {Event} [selectedEvent=null] - Evento a ser editado, se houver
     */
    showEventForm(selectedEvent = null) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.remove();
        }

        const content = document.createElement('div');
        content.classList.add('main-content', 'form-content');

        const title = document.createElement('h2');
        const titleText = document.createTextNode(selectedEvent ? 'Editar Evento' : 'Novo Evento');
        title.appendChild(titleText);
        content.appendChild(title);

        content.appendChild(this.createForm(selectedEvent));

        const footer = document.querySelector('.footer');
        document.body.insertBefore(content, footer);
    }

    /**
     * Cria o formulário para entrada de dados do evento
     * @private
     * @param {Event} [selectedEvent=null] - Evento a ser editado, se houver
     * @returns {HTMLElement} Formulário do evento
     */
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

    /**
     * Gerencia a seleção de um evento na lista
     * @private
     * @param {HTMLElement} element - Elemento selecionado
     */
    selectEvent(element) {
        const previousSelected = document.querySelector('.event-item.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        element.classList.add('selected');
    }

    /**
     * Gerencia a ação de editar um evento
     * @private
     */
    handleEdit() {
        const selected = document.querySelector('.event-item.selected');
        if (!selected) {
            MessageEvents.showError(MessageEvents.SELECT_EVENT_EDIT, document.querySelector('.main-content'));
            return;
        }
        const eventId = parseInt(selected.dataset.eventId);
        const event = this.events.find(e => e.id === eventId);
        this.showEventForm(event);
    }

    /**
     * Gerencia a ação de deletar um evento
     * @private
     */
    handleDelete() {
        const selected = document.querySelector('.event-item.selected');
        if (!selected) {
            MessageEvents.showError(MessageEvents.SELECT_EVENT_DELETE, document.querySelector('.main-content'));
            return;
        }
        
        try {
            const eventId = parseInt(selected.dataset.eventId);
            this.deleteEvent(eventId);
            this.showEvents();
        } catch (error) {
            MessageEvents.showError(error.message, document.querySelector('.main-content'));
        }
    }

    /**
     * Gerencia o salvamento de um evento
     * @private
     * @param {number} typeId - ID do tipo de evento
     * @param {string} description - Descrição do evento
     * @param {Date} date - Data do evento
     * @param {Event} [selectedEvent=null] - Evento sendo editado, se houver
     */
    handleSave(typeId, description, date, selectedEvent) {
        if (!description.trim() || !date || isNaN(date.getTime())) {
            MessageEvents.showError(MessageEvents.REQUIRED_FIELDS, document.querySelector('.main-content'));
            return;
        }

        try {
            this.validateDate(date);
            if (selectedEvent) {
                this.updateEvent(selectedEvent.id, typeId, description, date);
                MessageEvents.showSuccess(MessageEvents.SUCCESS_UPDATE);
            } else {
                this.addEvent(typeId, description, date);
                MessageEvents.showSuccess(MessageEvents.SUCCESS_CREATE);
            }
            this.showEvents();
        } catch (error) {
            MessageEvents.showError(error.message, document.querySelector('.main-content'));
        }
    }

    /**
     * Valida se a data do evento é futura
     * @private
     * @param {Date} date - Data a ser validada
     * @returns {boolean} true se a data for válida
     * @throws {Error} Se a data for anterior a hoje
     */
    validateDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const eventDate = new Date(date);
        eventDate.setHours(0, 0, 0, 0);
        
        if (eventDate < today) {
            throw new Error('A data do evento não pode ser anterior a hoje');
        }
        return true;
    }

    /**
     * Retorna um evento pelo seu ID
     * @param {number} id - ID do evento
     * @returns {Event|null} Evento encontrado ou null se não existir
     */
    getEvent(id) {
        return this.events.find(e => e.id === id) || null;
    }

    /**
     * Retorna eventos por tipo
     * @param {number} typeId - ID do tipo de evento
     * @returns {Event[]} Array de eventos do tipo especificado
     */
    getEventsByType(typeId) {
        return this.events.filter(e => e.typeId === typeId);
    }

    /**
     * Retorna eventos por data
     * @param {Date} date - Data para filtrar
     * @returns {Event[]} Array de eventos na data especificada
     */
    getEventsByDate(date) {
        return this.events.filter(e => {
            const eventDate = new Date(e.date);
            return eventDate.toDateString() === date.toDateString();
        });
    }

    /**
     * Verifica se existe um evento com o ID especificado
     * @param {number} id - ID do evento
     * @returns {boolean} true se o evento existir
     */
    hasEvent(id) {
        return this.events.some(e => e.id === id);
    }

    /**
     * Limpa todos os eventos
     * @returns {void}
     */
    clearEvents() {
        this.events = [];
        this.currentId = 0;
    }

    /**
     * Retorna o número total de eventos
     * @returns {number} Quantidade de eventos
     */
    getEventCount() {
        return this.events.length;
    }

    /**
     * Retorna eventos futuros
     * @returns {Event[]} Array de eventos com data futura
     */
    getFutureEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.events.filter(e => e.date >= today);
    }

    /**
     * Retorna eventos passados
     * @returns {Event[]} Array de eventos com data passada
     */
    getPastEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.events.filter(e => e.date < today);
    }
}

// Instância global do gerenciador de eventos
const eventManager = new EventManager();