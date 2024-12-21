
/**
 * Classe que representa um tipo de evento individual
 * @constructor
 * @class EventType
 * @param {number} id - Identificador único do tipo de evento
 * @param {string} description - Descrição do tipo de evento
 * @throws {Error} Se a descrição estiver vazia ou não for string
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * @author André Rocha - 202300185 - 202300185@estudantes.ips.pt
 */
class EventType {
    constructor(id, description) {
        if (!description || typeof description !== 'string') {
            throw new Error(MessageEvents.REQUIRED_DESCRIPTION);
        }
        this.id = id;
        this.description = description.trim();
    }
}

/**
 * Classe responsável pelo gerenciamento de tipos de eventos
 * Inicializa o gerenciador de tipos de eventos
 * @class EventTypeManager
 * @constructor
 */
class EventTypeManager {
    constructor() {
        this.eventTypes = [];
        this.currentId = 0;
        this.eventAssociations = [];
        this.memberPreferences = [];
    }

    /**
     * Adiciona um novo tipo de evento
     * @param {string} description - Descrição do tipo de evento
     * @returns {EventType} O tipo de evento criado
     * @throws {Error} Se a descrição estiver vazia ou não for string
     */
    addEventType(description) {
        if (!description || typeof description !== 'string') {
            throw new Error(MessageEvents.REQUIRED_DESCRIPTION);
        }
        this.currentId++;
        const eventType = new EventType(this.currentId, description);
        this.eventTypes.push(eventType);
        return eventType;
    }

    /**
     * Retorna todos os tipos de eventos
     * @returns {EventType[]} Array com todos os tipos de eventos
     */
    getAllEventTypes() {
        return [...this.eventTypes];
    }

    /**
     * Atualiza um tipo de evento existente
     * @param {number} id - ID do tipo de evento
     * @param {string} description - Nova descrição
     * @returns {boolean} true se atualizado com sucesso
     * @throws {Error} Se o tipo de evento não for encontrado ou descrição inválida
     */
    updateEventType(id, description) {
        if (!description || typeof description !== 'string') {
            throw new Error(MessageEvents.REQUIRED_DESCRIPTION);
        }
        const eventType = this.eventTypes.find(et => et.id === id);
        if (!eventType) {
            throw new Error(MessageEvents.EVENT_TYPE_NOT_FOUND);
        }
        eventType.description = description.trim();
        return true;
    }

    /**
     * Remove um tipo de evento
     * @param {number} id - ID do tipo de evento
     * @returns {boolean} true se removido com sucesso
     * @throws {Error} Se o tipo de evento estiver em uso ou não for encontrado
     */
    deleteEventType(id) {
        // Verifica se existem eventos usando este tipo
        const eventsUsingType = eventManager.events.some(event => event.typeId === id);
        if (eventsUsingType) {
            throw new Error(MessageEvents.EVENT_TYPE_IN_USE);
        }

        // Verifica se existem preferências de membros usando este tipo
        if (this.memberPreferences.some(mp => mp.eventTypeId === id)) {
            throw new Error(MessageEvents.EVENT_TYPE_IN_PREFERENCES);
        }

        const index = this.eventTypes.findIndex(et => et.id === id);
        if (index === -1) {
            throw new Error(MessageEvents.EVENT_TYPE_NOT_FOUND);
        }

        this.eventTypes.splice(index, 1);
        return true;
    }

    /**
     * Busca um tipo de evento pelo ID
     * @param {number} id - ID do tipo de evento
     * @returns {EventType} O tipo de evento encontrado
     * @throws {Error} Se o tipo de evento não for encontrado
     */
    getEventType(id) {
        const eventType = this.eventTypes.find(et => et.id === id);
        if (!eventType) {
            throw new Error('Tipo de evento não encontrado');
        }
        return eventType;
    }

    /**
     * Exibe a interface principal de tipos de eventos
     */
    showEventTypes() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.remove();
        }

        const content = document.createElement('div');
        content.classList.add('main-content');

        content.appendChild(this.createHeader());
        content.appendChild(this.createEventTypesList());
        content.appendChild(this.createButtonContainer());

        const footer = document.querySelector('.footer');
        document.body.insertBefore(content, footer);
    }

    /**
     * Cria o cabeçalho da seção
     * @private
     * @returns {HTMLElement} Elemento do cabeçalho
     */
    createHeader() {
        const sectionTitle = document.createElement('h2');
        const titleText = document.createTextNode('Tipos de Eventos');
        sectionTitle.appendChild(titleText);
        return sectionTitle;
    }

    /**
     * Cria o container com os botões de ação
     * @private
     * @returns {HTMLElement} Container com os botões de ação
     */
    createButtonContainer() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buttons = [
            { text: 'Criar', id: 'btn-type-create', action: () => this.showEventTypeForm() },
            { text: 'Editar', id: 'btn-type-edit', action: () => this.handleEdit() },
            { text: 'Apagar', id: 'btn-type-delete', action: () => this.handleDelete() }
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
     * Cria a lista de tipos de eventos
     * @private
     * @returns {HTMLElement} Container com a lista de tipos de eventos
     */
    createEventTypesList() {
        const eventList = document.createElement('div');
        eventList.classList.add('event-types-list');
        eventList.id = 'event-types-list';

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

    /**
     * Cria o cabeçalho da tabela
     * @private
     * @returns {HTMLElement} Elemento do cabeçalho da tabela
     */
    createTableHeader() {
        const header = document.createElement('div');
        header.classList.add('event-types-header');
        header.id = 'event-types-header';
        
        const headers = ['Id', 'Descritivo'];
        headers.forEach(text => {
            const cell = document.createElement('div');
            const cellText = document.createTextNode(text);
            cell.appendChild(cellText);
            cell.classList.add('header-cell');
            header.appendChild(cell);
        });
        
        return header;
    }

    /**
     * Cria um item individual da lista
     * @private
     * @param {EventType} eventType - Tipo de evento a ser exibido
     * @returns {HTMLElement} Elemento representando o tipo de evento
     */
    createEventTypeItem(eventType) {
        const item = document.createElement('div');
        item.classList.add('event-type-item');
        item.id = `event-type-${eventType.id}`;
        item.dataset.eventTypeId = eventType.id;

        const cells = [eventType.id, eventType.description];
        cells.forEach(text => {
            const cell = document.createElement('div');
            const cellText = document.createTextNode(text);
            cell.appendChild(cellText);
            cell.classList.add('item-cell');
            item.appendChild(cell);
        });

        item.addEventListener('click', () => this.selectEventType(item));
        return item;
    }

    /**
     * Cria mensagem para quando não há tipos de eventos
     * @private
     * @returns {HTMLElement} Elemento com a mensagem
     */
    createEmptyMessage() {
        const message = document.createElement('p');
        message.classList.add('empty-message');
        const messageText = document.createTextNode(MessageEvents.NO_EVENT_TYPES);
        message.appendChild(messageText);
        return message;
    }

    /**
     * Exibe o formulário de tipo de evento
     * @private
     * @param {EventType} [selectedEventType=null] - Tipo de evento sendo editado
     */
    showEventTypeForm(selectedEventType = null) {
        const content = document.querySelector('.main-content');
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        const formTitle = document.createElement('h2');
        const titleText = document.createTextNode(
            selectedEventType ? 'Alterar Tipo de Evento' : 'Novo Tipo de Evento'
        );
        formTitle.appendChild(titleText);
        content.appendChild(formTitle);

        content.appendChild(this.createForm(selectedEventType));
    }

    /**
     * Cria o formulário para entrada de dados
     * @private
     * @param {EventType} [selectedEventType=null] - Tipo de evento sendo editado
     * @returns {HTMLElement} Container do formulário
     */
    createForm(selectedEventType) {
        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');
        formContainer.id = 'event-type-form';

        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('event-type-input');
        input.id = 'event-type-input';
        if (selectedEventType) {
            input.value = selectedEventType.description;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const saveButton = document.createElement('button');
        const saveText = document.createTextNode('Gravar');
        saveButton.appendChild(saveText);
        saveButton.classList.add('action-button');
        saveButton.id = 'btn-save-event-type';
        saveButton.addEventListener('click', () => this.handleSave(input.value, selectedEventType));

        const cancelButton = document.createElement('button');
        const cancelText = document.createTextNode('Cancelar');
        cancelButton.appendChild(cancelText);
        cancelButton.classList.add('action-button');
        cancelButton.id = 'btn-cancel-event-type';
        cancelButton.addEventListener('click', () => this.showEventTypes());

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);

        formContainer.appendChild(input);
        formContainer.appendChild(buttonContainer);
        return formContainer;
    }

    /**
     * Gerencia a seleção de um tipo de evento
     * @private
     * @param {HTMLElement} element - Elemento selecionado
     */
    selectEventType(element) {
        const previousSelected = document.querySelector('.event-type-item.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        element.classList.add('selected');
    }

    /**
     * Gerencia a edição de um tipo de evento
     * @private
     */
    handleEdit() {
        const selected = document.querySelector('.event-type-item.selected');
        if (!selected) {
            MessageEvents.showError(MessageEvents.SELECT_EVENT_TYPE_EDIT, document.querySelector(".main-content"));
            return;
        }
        const eventTypeId = parseInt(selected.dataset.eventTypeId);
        const eventType = this.getEventType(eventTypeId);
        this.showEventTypeForm(eventType);
    }

    /**
     * Gerencia a exclusão de um tipo de evento
     * @private
     */
    handleDelete() {
        const selected = document.querySelector('.event-type-item.selected');
        if (!selected) {
            MessageEvents.showError(MessageEvents.SELECT_EVENT_TYPE_DELETE, document.querySelector(".main-content"));
            return;
        }

        try {
            const eventTypeId = parseInt(selected.dataset.eventTypeId);
            this.deleteEventType(eventTypeId);
            MessageEvents.showSuccess(MessageEvents.SUCCESS_DELETE);
            this.showEventTypes();
        } catch (error) {
            MessageEvents.showError(error.message, document.querySelector(".main-content"));
        }
    }

    /**
     * Gerencia o salvamento de um tipo de evento
     * @private
     * @param {string} value - Valor do input
     * @param {EventType} [selectedEventType=null] - Tipo de evento sendo editado
     */
    handleSave(value, selectedEventType) {
        if (!value.trim()) {
            MessageEvents.showError(MessageEvents.REQUIRED_FIELDS, document.querySelector(".main-content"));
            return;
        }

        try {
            if (selectedEventType) {
                this.updateEventType(selectedEventType.id, value.trim());
                MessageEvents.showSuccess(MessageEvents.SUCCESS_UPDATE);
            } else {
                this.addEventType(value.trim());
                MessageEvents.showSuccess(MessageEvents.SUCCESS_CREATE);
            }
            this.showEventTypes();
        } catch (error) {
            MessageEvents.showError(error.message, document.querySelector(".main-content"));
        }
    }

    getEventsByTypes(preferredEventIds) {
        return this.eventTypes.filter(event => preferredEventIds.includes(event.id));
    }

    addMemberPreferences(memberId, eventTypeIds) {
        this.memberPreferences.push({ memberId, eventTypeIds });
    }

    getMemberPreferences(memberId) {
        return this.memberPreferences.find(mp => mp.memberId === memberId);
    }
}

const eventTypeManager = new EventTypeManager(); 