/**
 * Classe que representa um membro individual
 * @class Member
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

/**
 * Classe responsável pelo gerenciamento de membros
 * @class Members
 */
class Members {
    constructor() {
        this.members = [];
        this.currentId = 0;
        this.selectedMember = null;
        this.events = [];
        this.eventSubscriptions = [];
    }

    // Métodos CRUD básicos
    addMember(name, preferredEvents) {
        this.currentId++;
        const member = new Member(this.currentId, name, preferredEvents);
        this.members.push(member);
        return member;
    }

    getAllMembers() {
        return [...this.members];
    }

    updateMember(id, name, preferredEvents) {
        const member = this.members.find(e => e.id === id);
        if (!member) throw new Error(MessageEvents.MEMBER_NOT_FOUND);
        member.name = name;
        member.preferredEvents = preferredEvents;
        return true;
    }

    deleteMember(id) {
        const index = this.members.findIndex(e => e.id === id);
        if (index === -1) throw new Error(MessageEvents.MEMBER_NOT_FOUND);
        this.members.splice(index, 1);
        return true;
    }

    // Métodos de UI
    showMembers() {
        const content = UIHelper.clearAndGetMainContent();
        content.appendChild(this.createHeader());
        content.appendChild(this.createMembersList());
        content.appendChild(this.createButtonContainer());
    }

    createHeader() {
        return UIHelper.createSectionHeader('Membros');
    }

    createButtonContainer() {
        return UIHelper.createButtonContainer([
            { text: 'Criar', id: 'btn-member-create', action: () => this.showMemberForm() },
            { text: 'Editar', id: 'btn-member-edit', action: () => this.handleEdit() },
            { text: 'Apagar', id: 'btn-member-delete', action: () => this.handleDelete() }
        ]);
    }

    createMembersList() {
        const membersList = document.createElement('div');
        membersList.classList.add('members-list');

        membersList.appendChild(UIHelper.createTableHeader(['Id', 'Nome'], 'members-header'));

        const members = this.getAllMembers();
        if (members.length === 0) {
            membersList.appendChild(UIHelper.createEmptyMessage(MessageEvents.NO_MEMBERS));
        } else {
            members.forEach(member => membersList.appendChild(this.createMemberItem(member)));
        }

        return membersList;
    }

    createMemberItem(member) {
        const item = document.createElement('div');
        item.classList.add('member-item');
        item.dataset.memberId = member.id;

        [member.id, member.name].forEach(text => {
            const cell = document.createElement('div');
            cell.classList.add('item-cell');
            cell.textContent = text.toString();
            item.appendChild(cell);
        });

        item.addEventListener('click', () => UIHelper.handleItemSelection(item, '.member-item'));
        return item;
    }

    // Métodos de Formulário
    showMemberForm(selectedMember = null) {
        const content = UIHelper.clearAndGetMainContent();
        
        // Criar o container do formulário
        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');

        // Adicionar título
        const title = document.createElement('h2');
        title.textContent = selectedMember ? 'Alterar Membro' : 'Novo Membro';
        formContainer.appendChild(title);

        // Criar e adicionar o conteúdo do formulário
        const formContent = this.createForm(selectedMember);
        formContainer.appendChild(formContent);

        content.appendChild(formContainer);

        // Criar os botões usando UIHelper similar à lista de membros
        const buttons = [
            { text: 'Gravar', id: 'btn-member-save', action: () => this.handleSave(selectedMember) },
            { text: 'Cancelar', id: 'btn-member-cancel', action: () => this.showMembers() }
        ];
        
        const buttonContainer = UIHelper.createButtonContainer(buttons);
        content.appendChild(buttonContainer);
    }

    handleSave(selectedMember) {
        const nameInput = document.querySelector('.member-input');
        const checkboxes = document.querySelectorAll('.event-checkbox:checked');
        const preferredEvents = Array.from(checkboxes).map(cb => parseInt(cb.value));

        if (!nameInput.value.trim()) {
            MessageEvents.showError('Nome é obrigatório');
            return;
        }

        try {
            if (selectedMember) {
                this.updateMember(selectedMember.id, nameInput.value, preferredEvents);
                MessageEvents.showSuccess(MessageEvents.SUCCESS_UPDATE);
            } else {
                this.addMember(nameInput.value, preferredEvents);
                MessageEvents.showSuccess(MessageEvents.SUCCESS_CREATE);
            }
            this.showMembers();
        } catch (error) {
            MessageEvents.showError(error.message);
        }
    }

    // Métodos de Manipulação de Eventos
    subscribeToEvent(memberId, eventId) {
        if (this.eventSubscriptions.some(sub => sub.memberId === memberId && sub.eventId === eventId)) {
            throw new Error('Membro já está inscrito neste evento');
        }
        this.eventSubscriptions.push({ memberId, eventId });
        return true;
    }

    cancelEventSubscription(memberId, eventId) {
        const index = this.eventSubscriptions.findIndex(
            sub => sub.memberId === memberId && sub.eventId === eventId
        );
        if (index === -1) throw new Error('Inscrição não encontrada');
        
        this.eventSubscriptions.splice(index, 1);
        MessageEvents.showSuccess('Inscrição cancelada com sucesso');
        return true;
    }

    // Handlers
    handleEdit() {
        const selected = document.querySelector('.member-item.selected');
        if (!selected) {
            MessageEvents.showError('Selecione um membro para editar.');
            return;
        }
        const memberId = parseInt(selected.dataset.memberId);
        const member = this.members.find(e => e.id === memberId);
        this.showMemberForm(member);
    }

    handleDelete() {
        const selected = document.querySelector('.member-item.selected');
        if (!selected) {
            MessageEvents.showError('Selecione um membro para apagar.');
            return;
        }
        
        try {
            const memberId = parseInt(selected.dataset.memberId);
            Validacao.validarExclusaoMembro(memberId, this.eventSubscriptions);
            this.deleteMember(memberId);
            MessageEvents.showSuccess(MessageEvents.SUCCESS_DELETE);
            this.showMembers();
        } catch (error) {
            MessageEvents.showError(error.message);
        }
    }

    createForm(selectedMember) {
        const formContent = document.createElement('div');
        formContent.classList.add('form-content');

        // Seção do nome
        formContent.appendChild(this.createNameSection(selectedMember));

        // Container de duas colunas para eventos
        const columnsContainer = this.createEventsSection(selectedMember);
        formContent.appendChild(columnsContainer);

        return formContent;
    }

    createNameSection(selectedMember) {
        const nameSection = document.createElement('div');
        nameSection.classList.add('form-row');
        
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Nome';
        nameLabel.classList.add('form-label');
        
        const nameInput = UIHelper.createTextInput(
            'member-input',
            selectedMember?.name || '',
            'Nome do membro'
        );
        
        nameSection.appendChild(nameLabel);
        nameSection.appendChild(nameInput);
        return nameSection;
    }

    createEventsSection(selectedMember) {
        const columnsContainer = UIHelper.createFormColumns();

        // Coluna esquerda - Tipos de eventos preferidos
        const preferredEventsColumn = this.createPreferredEventsColumn(selectedMember);
        columnsContainer.appendChild(preferredEventsColumn);

        // Coluna direita - Eventos disponíveis (apenas para edição)
        if (selectedMember) {
            const availableEventsColumn = this.createAvailableEventsColumn(selectedMember);
            columnsContainer.appendChild(availableEventsColumn);
        }

        return columnsContainer;
    }

    createPreferredEventsColumn(selectedMember) {
        const column = UIHelper.createFormColumn();
        const eventTypes = eventTypeManager.getAllEventTypes();
        
        if (eventTypes.length > 0) {
            const checkboxSection = UIHelper.createCheckboxSection(
                'Tipos de Eventos Preferidos',
                eventTypes,
                selectedMember?.preferredEvents || [],
                'event-checkbox'
            );
            column.appendChild(checkboxSection);
        } else {
            column.appendChild(UIHelper.createEmptyMessage(MessageEvents.NO_EVENT_TYPES));
        }
        
        return column;
    }

    createAvailableEventsColumn(member) {
        const column = UIHelper.createFormColumn();
        const container = document.createElement('div');
        container.classList.add('events-list-container');

        // Título da seção
        const title = document.createElement('h3');
        title.textContent = 'Eventos Disponíveis';
        title.classList.add('form-label');
        container.appendChild(title);

        // Lista de eventos disponíveis
        const availableEvents = this.getAvailableEventsForMember(member);
        
        if (availableEvents.length === 0) {
            container.appendChild(
                UIHelper.createEmptyMessage('Não há eventos disponíveis para os tipos preferidos')
            );
        } else {
            container.appendChild(this.createEventsGrid(availableEvents, member));
        }

        column.appendChild(container);
        return column;
    }

    getAvailableEventsForMember(member) {
        return eventManager.events.filter(event => {
            const eventDate = new Date(event.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return eventDate >= today && member.preferredEvents.includes(event.typeId);
        });
    }

    createEventsGrid(events, member) {
        const grid = document.createElement('div');
        grid.classList.add('events-grid');

        // Cabeçalho
        grid.appendChild(
            UIHelper.createTableHeader(
                ['Id', 'Tipo', 'Descritivo', 'Data', 'Ação'],
                'events-header'
            )
        );

        // Linhas de eventos
        events.forEach(event => {
            grid.appendChild(this.createEventRow(event, member));
        });

        return grid;
    }

    createEventRow(event, member) {
        const row = document.createElement('div');
        row.classList.add('event-row');

        const eventType = eventTypeManager.getEventType(event.typeId);
        const isSubscribed = this.eventSubscriptions.some(
            sub => sub.memberId === member.id && sub.eventId === event.id
        );

        // Células de informação
        [
            event.id,
            eventType.description,
            event.description,
            new Date(event.date).toLocaleDateString()
        ].forEach(text => {
            const cell = document.createElement('div');
            cell.classList.add('item-cell');
            cell.textContent = text;
            row.appendChild(cell);
        });

        // Célula de ação
        const actionCell = document.createElement('div');
        actionCell.classList.add('item-cell', 'action-cell');

        const actionButton = document.createElement('button');
        actionButton.textContent = isSubscribed ? 'Cancelar' : 'Inscrever';
        actionButton.classList.add('action-button', isSubscribed ? 'cancel-button' : 'subscribe-button');
        
        actionButton.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                if (isSubscribed) {
                    this.cancelEventSubscription(member.id, event.id);
                } else {
                    this.subscribeToEvent(member.id, event.id);
                }
                this.showMemberForm(member);
            } catch (error) {
                MessageEvents.showError(error.message);
            }
        });

        actionCell.appendChild(actionButton);
        row.appendChild(actionCell);

        return row;
    }
}

const membersModule = new Members();    