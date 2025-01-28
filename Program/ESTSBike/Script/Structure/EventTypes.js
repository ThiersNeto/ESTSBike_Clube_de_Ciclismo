
/**
 * Classe que representa um tipo de evento individual
 * @constructor
 * @class EventType
 * @param {number} id -             Identificador único do tipo de evento
 * @param {string} description -    Descrição do tipo de evento
 * @throws {Error}                  Se a descrição estiver vazia ou não for string
 *
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * <br>
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
        this.loadEventTypesFromServer();
    }

    async loadEventTypesFromServer() {
        try {
            const response = await fetch('http://localhost:3000/api/event-types');
            if (!response.ok) {
                throw new Error('Failed to fetch event types');
            }
            const eventTypes = await response.json();
            this.eventTypes = eventTypes;
            this.currentId = Math.max(...eventTypes.map(et => et.id), 0);
        } catch (error) {
            console.error('Error loading event types:', error);
        }
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

        this.syncCreateEventType(eventType);
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
        this.syncUpdateEventType(eventType);
        return true;
    }

    /**
     * Remove um tipo de evento
     * @param {number} id - ID do tipo de evento
     * @returns {boolean} true se removido com sucesso
     * @throws {Error} Se o tipo de evento estiver em uso ou não for encontrado
     */
    deleteEventType(id) {
        const eventsUsingType = eventManager.events.some(event => event.typeId === id);
        if (eventsUsingType) {
            throw new Error(MessageEvents.EVENT_TYPE_IN_USE);
        }

        if (this.memberPreferences.some(mp => mp.eventTypeId === id)) {
            throw new Error(MessageEvents.EVENT_TYPE_IN_PREFERENCES);
        }

        const index = this.eventTypes.findIndex(et => et.id === id);
        if (index === -1) {
            throw new Error(MessageEvents.EVENT_TYPE_NOT_FOUND);
        }

        const eventType = this.eventTypes[index];
        this.eventTypes.splice(index, 1);
        this.syncDeleteEventType(eventType);
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
        const content = UIHelper.clearAndGetMainContent();
        content.appendChild(this.createHeader());
        content.appendChild(this.createEventTypesList());
        content.appendChild(this.createButtonContainer());
    }

    /**
     * Cria o cabeçalho da seção
     * @private
     * @returns {HTMLElement} Elemento do cabeçalho
     */
    createHeader() {
        return UIHelper.createSectionHeader('Tipos de Eventos');
    }

    /**
     * Cria o container com os botões de ação
     * @private
     * @returns {HTMLElement} Container com os botões de ação
     */
    createButtonContainer() {
        return UIHelper.createButtonContainer([
            { text: 'Criar', id: 'btn-type-create', action: () => this.showEventTypeForm() },
            { text: 'Editar', id: 'btn-type-edit', action: () => this.handleEdit() },
            { text: 'Apagar', id: 'btn-type-delete', action: () => this.handleDelete() }
        ]);
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
        return UIHelper.createTableHeader(
            ['Id', 'Descritivo'],
            'event-types-header'
        );
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
        return UIHelper.createEmptyMessage(MessageEvents.NO_EVENT_TYPES);
    }

    /**
     * Exibe o formulário de tipo de evento
     * @private
     * @param {EventType} [selectedEventType=null] - Tipo de evento sendo editado
     */
    showEventTypeForm(selectedEventType = null) {
        const content = UIHelper.clearAndGetMainContent();
        const formContent = this.createForm(selectedEventType);
        
        content.appendChild(
            UIHelper.createFormContainer(
                selectedEventType ? 'Alterar Tipo de Evento' : 'Novo Tipo de Evento',
                formContent,
                () => {
                    const input = formContent.querySelector('.event-type-input');
                    this.handleSave(input.value, selectedEventType);
                },
                () => this.showEventTypes()
            )
        );
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
        UIHelper.handleItemSelection(element, '.event-type-item');
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

    /**
     * Filtra tipos de eventos com base em IDs preferidos
     * @method getEventsByTypes
     * @param {number[]} preferredEventIds      Array de IDs de tipos de eventos
     * @returns {EventType[]}                   Lista filtrada de tipos de eventos
     */
    getEventsByTypes(preferredEventIds) {
        return this.eventTypes.filter(event => preferredEventIds.includes(event.id));
    }

    /**
     * Adiciona preferências de tipos de eventos para um membro
     * @method addMemberPreferences
     * @param {number} memberId - ID do membro
     * @param {number[]} eventTypeIds - IDs dos tipos de eventos preferidos
     * @description Armazena no array memberPreferences
     */
    addMemberPreferences(memberId, eventTypeIds) {
        this.memberPreferences.push({ memberId, eventTypeIds });
    }

    /**
     * Obtém preferências de tipos de eventos de um membro
     * @method getMemberPreferences
     * @param {number} memberId     ID do membro
     * @returns {Object|null}       Objeto com preferências ou null se não encontrado
     */
    getMemberPreferences(memberId) {
        return this.memberPreferences.find(mp => mp.memberId === memberId);
    }


    /**
     * Obtém todos os tipos de eventos da API
     * @static
     * @async
     * @method getAllEventTypes
     * @returns {Promise<EventType[]>}  Lista de tipos de eventos
     * @throws {Error}                  Se falhar a requisição
     */
    static async getAllEventTypes() {
        try {
          const response = await fetch('http://localhost:3000/api/event-types');
          if (!response.ok) {
            throw new Error('Failed to fetch event types');
          }
          return await response.json();
        } catch (error) {
          console.error('Error:', error);
          return [];
        }
      }

    /**
     * Cria um novo tipo de evento via API
     * @static
     * @async
     * @method createEventType
     * @param {Object} eventType -      Dados do tipo de evento
     * @returns {Promise<Object|null>}  Resposta da API ou null em caso de erro
     * @throws {Error}                  Se falhar a requisição
     */
      
    syncCreateEventType(eventType) {
        fetch('/api/event-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({description: eventType.description }),
        })
    }

    syncUpdateEventType(eventType) {
        fetch(`/api/event-types/${eventType.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: eventType.description }),
        })
    }

    syncDeleteEventType(eventType) {
        fetch(`/api/event-types/${eventType.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}

const eventTypeManager = new EventTypeManager(); 