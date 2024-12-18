/**
 * @fileoverview Gerenciamento de membros do clube de ciclismo
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * @author André Rocha - 202300185 - 202300185@estudantes.ips.pt
 */

    /**
     * Cria uma nova instância de membro
     * @constructor
     * @class Member
     * @param {number} id - Identificador único do membro
     * @param {string} name - Nome do membro
     * @param {number[]} preferredEvents - Array com IDs dos tipos de eventos preferidos
     * @throws {Error} Se o nome estiver vazio ou não for string
     */
    class Member {
    constructor(id, name, preferredEvents = []) {
        if (!name || typeof name !== 'string') {
            throw new Error(MessageEvents.REQUIRED_NAME);
        }
        this.id = id;
        this.name = name.trim();
        this.preferredEvents = preferredEvents;
    }
}

class Members {
    constructor() {
        this.members = [];
        this.currentId = 0;
        this.selectedMember = null;
        this.events = [];
        this.eventSubscriptions = [];
    }

    // Adiciona um novo membro
    addMember(name, preferredEvents) {
        this.currentId++;
        const member = new Member(this.currentId, name, preferredEvents);
        this.members.push(member);
        return member;
    }

    // Retorna todos os membros
    getAllMembers() {
        return [...this.members];
    }

    // Atualiza um membro existente
    updateMember(id, name, preferredEvents) {
        const member = this.members.find(e => e.id === id);
        if (!member) {
            throw new Error(MessageEvents.MEMBER_NOT_FOUND);
        }
        member.name = name;
        member.preferredEvents = preferredEvents;
        return true;
    }

    // Remove um membro
    deleteMember(id) {
        const index = this.members.findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error(MessageEvents.MEMBER_NOT_FOUND);
        }
        this.members.splice(index, 1);
        return true;
    }

    // Exibe a interface principal de membros
    showMembers() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.remove();
        }

        const content = document.createElement('div');
        content.classList.add('main-content');

        content.appendChild(this.createHeader());
        content.appendChild(this.createMembersList());
        content.appendChild(this.createButtonContainer());

        const footer = document.querySelector('.footer');
        document.body.insertBefore(content, footer);
    }

    // Cria o cabeçalho da seção
    createHeader() {
        const sectionTitle = document.createElement('h2');
        const titleText = document.createTextNode('Membros');
        sectionTitle.appendChild(titleText);
        return sectionTitle;
    }

    // Cria o container com os botões de ação
    createButtonContainer() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buttons = [
            { text: 'Criar', id: 'btn-member-create', action: () => this.showMemberForm() },
            { text: 'Editar', id: 'btn-member-edit', action: () => this.handleEdit() },
            { text: 'Apagar', id: 'btn-member-delete', action: () => this.handleDelete() },
            { text: 'Inscrever em Evento', id: 'btn-member-subscribe', action: () => this.handleEventRegistration() }
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

    // Gerencia o salvamento
    handleSave(name, selectedEvents, selectedMember) {
        if (!name) {
            this.showError('Preencha todos os campos.');
            return;
        }

        try {
            if (selectedMember) {
                this.updateMember(selectedMember.id, name, selectedEvents.map(Number));
            } else {
                this.addMember(name, selectedEvents.map(Number));
            }
            this.showMembers();
        } catch (error) {
            this.showError(error.message);
        }
    }

// Gerencia a ação de editar
    handleEdit() {
        const selected = document.querySelector('.member-item.selected');
        if (!selected) {
            this.showError('Selecione um membro para editar.');
            return;
        }
        const memberId = parseInt(selected.dataset.memberId);
        const member = this.members.find(e => e.id === memberId);
        this.showMemberForm(member);
    }


    // Gerencia a ação de deletar
    handleDelete() {
        const selected = document.querySelector('.member-item.selected');
        if (!selected) {
            this.showError('Selecione um membro para apagar.');
            return;
        }
        
        try {
            const memberId = parseInt(selected.dataset.memberId);
            this.deleteMember(memberId);
            this.showMembers();
        } catch (error) {
            this.showError(error.message);
        }
    }

    // Exibe o formulário para criar/editar um membro
    showMemberForm(selectedMember = null) {
        const content = document.querySelector('.main-content');
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        const formTitle = document.createElement('h2');
        formTitle.textContent = selectedMember ? 'Alterar Membro' : 'Novo Membro';
        content.appendChild(formTitle);

        const form = this.createForm(selectedMember);
        content.appendChild(form);
    }


    // Cria o formulário para entrada de dados
    createForm(selectedMember) {
        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');

        // Nome (em cima)
        const nameSection = document.createElement('div');
        nameSection.classList.add('name-section');

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Nome';
        nameLabel.classList.add('form-label');

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.classList.add('member-input');
        nameInput.placeholder = 'Nome';
        if (selectedMember) {
            nameInput.value = selectedMember.name;
        }

        nameSection.appendChild(nameLabel);
        nameSection.appendChild(nameInput);

        // Container para as duas colunas
        const columnsContainer = document.createElement('div');
        columnsContainer.classList.add('form-columns');

        // Coluna da esquerda (Tipos de eventos preferidos)
        const leftColumn = document.createElement('div');
        leftColumn.classList.add('form-column');

        const eventsLabel = document.createElement('p');
        eventsLabel.textContent = 'Tipos de Eventos Preferidos';
        eventsLabel.classList.add('form-label');

        const eventsContainer = document.createElement('div');
        eventsContainer.classList.add('events-checkbox-container');

        // Busca todos os tipos de eventos disponíveis
        const eventTypes = eventTypeManager.getAllEventTypes();
        
        if (eventTypes.length === 0) {
            const noEventsMessage = document.createElement('p');
            noEventsMessage.textContent = MessageEvents.NO_EVENT_TYPES;
            noEventsMessage.classList.add('empty-message');
            eventsContainer.appendChild(noEventsMessage);
        } else {
            const checkboxGrid = document.createElement('div');
            checkboxGrid.classList.add('checkbox-grid');

            eventTypes.forEach(eventType => {
                const checkboxContainer = document.createElement('div');
                checkboxContainer.classList.add('checkbox-container');
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = eventType.id;
                checkbox.id = `event-${eventType.id}`;
                checkbox.classList.add('event-checkbox');
                if (selectedMember && selectedMember.preferredEvents.includes(eventType.id)) {
                    checkbox.checked = true;
                }

                const label = document.createElement('label');
                label.htmlFor = `event-${eventType.id}`;
                label.textContent = eventType.description;
                
                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);
                checkboxGrid.appendChild(checkboxContainer);
            });

            eventsContainer.appendChild(checkboxGrid);
        }

        leftColumn.appendChild(eventsLabel);
        leftColumn.appendChild(eventsContainer);

        // Coluna da direita (Eventos disponíveis)
        const rightColumn = document.createElement('div');
        rightColumn.classList.add('form-column');

        if (selectedMember) {
            const eventsListLabel = document.createElement('p');
            eventsListLabel.textContent = 'Eventos';
            eventsListLabel.classList.add('form-label');

            const eventsListContainer = document.createElement('div');
            eventsListContainer.classList.add('events-list-container');

            // Cabeçalho da tabela de eventos
            const tableHeader = document.createElement('div');
            tableHeader.classList.add('events-header');
            ['Id', 'Tipo', 'Descritivo', 'Data'].forEach(text => {
                const cell = document.createElement('div');
                cell.textContent = text;
                cell.classList.add('header-cell');
                tableHeader.appendChild(cell);
            });
            eventsListContainer.appendChild(tableHeader);

            // Verifica se o membro tem tipos de eventos preferidos
            if (selectedMember.preferredEvents.length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.textContent = 'Não há Eventos - Este membro não tem tipos de eventos preferidos';
                emptyMessage.classList.add('empty-message');
                eventsListContainer.appendChild(emptyMessage);
            } else {
                // Filtra eventos pelos tipos preferidos
                const availableEvents = eventManager.events.filter(event => {
                    // Verifica se o evento é futuro
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    // Verifica se o evento é do tipo preferido E é uma data futura
                    return eventDate >= today && selectedMember.preferredEvents.includes(event.typeId);
                });

                if (availableEvents.length === 0) {
                    const emptyMessage = document.createElement('p');
                    emptyMessage.textContent = 'Não há Eventos futuros do seu Tipo de Evento Preferido';
                    emptyMessage.classList.add('empty-message');
                    eventsListContainer.appendChild(emptyMessage);
                } else {
                    availableEvents.forEach(event => {
                        const eventRow = document.createElement('div');
                        eventRow.classList.add('event-row');

                        const eventType = eventTypeManager.getEventType(event.typeId);
                        const cells = [
                            event.id,
                            eventType.description,
                            event.description,
                            event.date.toISOString().split('T')[0]
                        ];

                        cells.forEach(text => {
                            const cell = document.createElement('div');
                            cell.textContent = text;
                            cell.classList.add('item-cell');
                            eventRow.appendChild(cell);
                        });

                        // Adiciona o botão de inscrição
                        const inscricaoCell = document.createElement('div');
                        inscricaoCell.classList.add('item-cell');

                        const inscricaoButton = document.createElement('button');
                        inscricaoButton.textContent = 'Inscrever';
                        inscricaoButton.classList.add('inscricao-button');
                        inscricaoButton.addEventListener('click', (e) => {
                            e.preventDefault();
                            try {
                                this.subscribeToEvent(selectedMember.id, event.id);
                                MessageEvents.showSuccess('Inscrito com sucesso no evento!');
                                this.showMemberForm(selectedMember);
                            } catch (error) {
                                MessageEvents.showError(error.message);
                            }
                        });

                        inscricaoCell.appendChild(inscricaoButton);
                        eventRow.appendChild(inscricaoCell);

                        eventsListContainer.appendChild(eventRow);
                    });
                }
            }

            rightColumn.appendChild(eventsListLabel);
            rightColumn.appendChild(eventsListContainer);
        }

        columnsContainer.appendChild(leftColumn);
        columnsContainer.appendChild(rightColumn);

        // Botões
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Gravar';
        saveButton.classList.add('action-button');
        saveButton.addEventListener('click', () => {
            const selectedEvents = Array.from(document.querySelectorAll('.event-checkbox:checked'))
                .map(checkbox => parseInt(checkbox.value));
            this.handleSave(nameInput.value, selectedEvents, selectedMember);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.classList.add('action-button');
        cancelButton.addEventListener('click', () => this.showMembers());

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);

        // Montagem final do formulário
        formContainer.appendChild(nameSection);
        formContainer.appendChild(columnsContainer);
        formContainer.appendChild(buttonContainer);

        return formContainer;
    }

    // Cria a lista de membros
    createMembersList() {
        const membersList = document.createElement('div');
        membersList.classList.add('members-list');

        const tableHeader = this.createTableHeader();
        membersList.appendChild(tableHeader);

        const members = this.getAllMembers();
        if (members.length === 0) {
            membersList.appendChild(this.createEmptyMessage());
        } else {
            members.forEach(member => {
                membersList.appendChild(this.createMemberItem(member));
            });
        }

        return membersList;
    }

    // Cria o cabeçalho da tabela
    createTableHeader() {
        const header = document.createElement('div');
        header.classList.add('members-header');
        
        const headers = ['Id', 'Nome'];
        headers.forEach(text => {
            const cell = document.createElement('div');
            cell.textContent = text;
            cell.classList.add('header-cell');
            header.appendChild(cell);
        });
        
        return header;
    }

    // Cria um item individual da lista de membros
    createMemberItem(member) {
        const item = document.createElement('div');
        item.classList.add('member-item');
        item.id = `member-${member.id}`;

        const cells = [member.id, member.name];
        cells.forEach(text => {
            const cell = document.createElement('div');
            cell.classList.add('item-cell');
            const cellText = document.createTextNode(text.toString());
            cell.appendChild(cellText);
            item.appendChild(cell);
        });

        item.addEventListener('click', () => this.selectMember(item));
        return item;
    }

    // Cria a mensagem para quando não há membros
    createEmptyMessage() {
        const message = document.createElement('p');
        message.classList.add('empty-message');
        const messageText = document.createTextNode(MessageEvents.NO_MEMBERS);
        message.appendChild(messageText);
        return message;
    }

    // Gerencia a seleção de um item na lista
    selectMember(element) {
        const previousSelected = document.querySelector('.member-item.selected');
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

    // Método para inscrever em evento
    subscribeToEvent(memberId, eventId) {
        // Verifica se já está inscrito
        const isSubscribed = this.eventSubscriptions.some(
            sub => sub.memberId === memberId && sub.eventId === eventId
        );

        if (isSubscribed) {
            throw new Error('Membro já está inscrito neste evento');
        }

        this.eventSubscriptions.push({ memberId, eventId });
        return true;
    }

    // Método para cancelar inscrição
    unsubscribeFromEvent(memberId, eventId) {
        const index = this.eventSubscriptions.findIndex(
            sub => sub.memberId === memberId && sub.eventId === eventId
        );

        if (index === -1) {
            throw new Error('Inscrição não encontrada');
        }

        this.eventSubscriptions.splice(index, 1);
        return true;
    }

    // Método para gerenciar inscrição em eventos
    handleEventRegistration() {
        const selected = document.querySelector('.member-item.selected');
        if (!selected) {
            this.showError('Selecione um membro para inscrever em eventos.');
            return;
        }
    
        const memberId = parseInt(selected.dataset.memberId);
        const member = this.members.find(e => e.id === memberId);
    
        const memberPreferences = member.preferredEvents;
        if (memberPreferences.length === 0) {
            this.showError('Este membro não tem preferências de tipo de evento.');
            return;
        }
    
        const compatibleEvents = eventTypeManager.getEventsByTypes(memberPreferences);
    
        if (compatibleEvents.length === 0) {
            this.showError('Não há eventos compatíveis com os tipos preferidos deste membro.');
            return;
        }
    
        this.showEventModal(member, compatibleEvents);
    }

    showEventModal(member, events) {
        const modal = document.createElement('div');
        modal.classList.add('event-modal');
        modal.id = 'event-subscription-modal';

        const title = document.createElement('h3');
        const titleText = document.createTextNode(`Inscrever ${member.name} em Evento`);
        title.appendChild(titleText);
        modal.appendChild(title);

        const eventSelect = document.createElement('select');
        eventSelect.id = 'event-select';
        events.forEach(event => {
            const option = document.createElement('option');
            option.value = event.id;
            const optionText = document.createTextNode(event.description);
            option.appendChild(optionText);
            eventSelect.appendChild(option);
        });
        modal.appendChild(eventSelect);

        const buttonContainer = document.createElement('div');
        const saveButton = document.createElement('button');
        const saveText = document.createTextNode('Inscrever');
        saveButton.appendChild(saveText);
        saveButton.id = 'btn-subscribe-confirm';
        
        const cancelButton = document.createElement('button');
        const cancelText = document.createTextNode('Cancelar');
        cancelButton.appendChild(cancelText);
        cancelButton.id = 'btn-subscribe-cancel';

        saveButton.addEventListener('click', () => {
            const selectedEventId = eventSelect.value;
            this.subscribeToEvent(member.id, parseInt(selectedEventId));
            modal.remove();
        });

        cancelButton.addEventListener('click', () => modal.remove());

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        modal.appendChild(buttonContainer);

        document.body.appendChild(modal);
    }
}

// Criar instância global
const membersModule = new Members();    