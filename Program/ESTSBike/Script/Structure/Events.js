
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
 *
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * <br>
 * @author André Rocha - 202300185 - 202300185@estudantes.ips.pt
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
        this.loadEventsFromServer();
    }

    async loadEventsFromServer() {
        try {
            console.log('Iniciando carregamento de eventos do servidor...');
            const response = await fetch('http://localhost:3000/api/events');

            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }

            const events = await response.json();
            console.log('Dados recebidos do servidor:', events);

            if (!Array.isArray(events)) {
                throw new Error('Os dados recebidos não são um array');
            }

            this.events = events.map(event => {
                if (!event.id || !event.type_id || !event.description || !event.date) {
                    console.warn('Dados de evento inválidos:', event);
                    return null;
                }
                return new Event(
                    parseInt(event.id),
                    parseInt(event.type_id),
                    event.description,
                    new Date(event.date)
                );
            }).filter(event => event !== null);

            this.currentId = this.events.length > 0 ? Math.max(...this.events.map(event => event.id)) : 0;
            console.log('Eventos carregados com sucesso:', this.events);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            this.events = [];
            this.currentId = 0;
        } finally {
            console.log('Carregamento de eventos finalizado');
        }
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
        this.syncCreateEvent(event);
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
        this.syncUpdateEvent(event);
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
        this.syncDeleteEvent(id);
        return true;
    }

    /**
     * Exibe a interface principal de eventos
     * @private
     */
    showEvents() {
        const content = UIHelper.clearAndGetMainContent();
        content.appendChild(this.createHeader());
        content.appendChild(this.createEventsList());
        content.appendChild(this.createButtonContainer());
    }

    /**
     * Cria o cabeçalho da seção de eventos
     * @private
     * @returns {HTMLElement} Elemento do cabeçalho
     */
    createHeader() {
        return UIHelper.createSectionHeader('Eventos');
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
        return UIHelper.createTableHeader(
            ['Id', 'Tipo', 'Descritivo', 'Data'],
            'events-header'
        );
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
        item.dataset.eventId = event.id;

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
        return UIHelper.createEmptyMessage(MessageEvents.NO_EVENTS);
    }

    /**
     * Cria o container com os botões de ação
     * @private
     * @returns {HTMLElement} Container com os botões
     */
    createButtonContainer() {
        return UIHelper.createButtonContainer([
            { text: 'Criar', id: 'btn-event-create', action: () => this.showEventForm() },
            { text: 'Editar', id: 'btn-event-edit', action: () => this.handleEdit() },
            { text: 'Apagar', id: 'btn-event-delete', action: () => this.handleDelete() }
        ]);
    }

    /**
     * Exibe o formulário de evento
     * @private
     * @param {Event} [selectedEvent=null] - Evento a ser editado, se houver
     */
    showEventForm(selectedEvent = null) {
        const content = UIHelper.clearAndGetMainContent();
        const formContent = this.createForm(selectedEvent);
        
        content.appendChild(
            UIHelper.createFormContainer(
                selectedEvent ? 'Editar Evento' : 'Novo Evento',
                formContent,
                () => {
                    const typeSelect = formContent.querySelector('select');
                    const descInput = formContent.querySelector('input[type="text"]');
                    const dateInput = formContent.querySelector('input[type="date"]');
                    this.handleSave(
                        parseInt(typeSelect.value),
                        descInput.value,
                        new Date(dateInput.value),
                        selectedEvent
                    );
                },
                () => this.showEvents()
            )
        );
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

        const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.classList.add('event-input');
        descInput.placeholder = 'Descrição';
        if (selectedEvent) {
            descInput.value = selectedEvent.description;
        }

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
        UIHelper.handleItemSelection(element, '.event-item');
    }

    /**
     * Gerencia a ação de editar um evento
     * @private
     */
    handleEdit() {
        const selected = document.querySelector('.event-item.selected');
        if (!selected) {
            MessageEvents.showError(MessageEvents.SELECT_EVENT_EDIT, document.querySelector(".main-content"));
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
            MessageEvents.showError(MessageEvents.SELECT_EVENT_DELETE, document.querySelector(".main-content"));
            return;
        }
        
        try {
            const eventId = parseInt(selected.dataset.eventId);
            console.log("Tentando excluir evento ID:", eventId);

            Validacao.validarExclusaoEvento(eventId, membersModule.eventSubscriptions);
            
            if (this.deleteEvent(eventId)) {
                MessageEvents.showSuccess(MessageEvents.SUCCESS_DELETE);
                this.showEvents();
            }
        } catch (error) {
            MessageEvents.showError(error.message, document.querySelector(".main-content"));
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
            MessageEvents.showError(MessageEvents.REQUIRED_FIELDS, document.querySelector(".main-content"));
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

    syncCreateEvent(event) {
       fetch('http://localhost:3000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type_id: event.typeId,
                description: event.description,
                date: event.date.toISOString().split('T')[0]
            }),
        })
    }


    syncUpdateEvent(event) {
        fetch(`http://localhost:3000/api/events/${event.id}`, {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                 type_id: event.typeId,
                 description: event.description,
                 date: event.date.toISOString().split('T')[0]
             }),
         })
     }

    syncDeleteEvent(id) {
        fetch(`http://localhost:3000/api/events/${id}`, {
             method: 'DELETE',
             headers: {
                 'Content-Type': 'application/json',
             },
         });
     }
}
const eventManager = new EventManager();