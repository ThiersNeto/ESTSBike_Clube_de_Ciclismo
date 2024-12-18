// Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
// André Richa - 202300185 - 202300185@estudantes.ips.pt

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
        sectionTitle.textContent = 'Membros';
        return sectionTitle;
    }

    // Cria o container com os botões de ação
    createButtonContainer() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buttons = [
            { text: 'Criar', action: () => this.showMemberForm() },
            { text: 'Editar', action: () => this.handleEdit() },
            { text: 'Apagar', action: () => this.handleDelete() },
            { text: 'Inscrever em Evento', action: () => this.handleEventRegistration() }
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

        // Nome
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.classList.add('member-input');
        nameInput.placeholder = 'Nome';
        if (selectedMember) {
            nameInput.value = selectedMember.name;
        }

        // Tipos de eventos preferidos
        const eventsContainer = document.createElement('div');
        eventsContainer.classList.add('events-container');
        const eventsLabel = document.createElement('p');
        eventsLabel.textContent = 'Tipos de Eventos Preferidos';
        eventsContainer.appendChild(eventsLabel);

        const eventTypes = eventTypeManager.getAllEventTypes();
        if (eventTypes.length === 0) {
            const noEventsMessage = document.createElement('p');
            noEventsMessage.textContent = 'Nenhum tipo de evento disponível. Adicione tipos de eventos primeiro.';
            eventsContainer.appendChild(noEventsMessage);
        } else {
            eventTypes.forEach(eventType => {
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

                eventsContainer.appendChild(checkbox);
                eventsContainer.appendChild(label);
            });
        }



        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Gravar';  
        saveButton.classList.add('action-button');
        saveButton.addEventListener('click', () => {
            const selectedEvents = Array.from(document.querySelectorAll('.event-checkbox:checked')).map(checkbox => checkbox.value);
            this.handleSave(
                nameInput.value,
                selectedEvents,
                selectedMember,
            );
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.classList.add('action-button');
        cancelButton.addEventListener('click', () => this.showMembers());

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);

        formContainer.appendChild(nameInput);
        formContainer.appendChild(eventsContainer);
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
        item.dataset.memberId = member.id;

        const cells = [member.id, member.name];
        cells.forEach(text => {
            const cell = document.createElement('div');
            cell.textContent = text;
            cell.classList.add('item-cell');
            item.appendChild(cell);
        });

        item.addEventListener('click', () => this.selectMember(item));
        return item;
    }

    // Cria a mensagem para quando não há membros
    createEmptyMessage() {
        const message = document.createElement('p');
        message.textContent = 'Não existem membros registrados.';
        message.classList.add('empty-message');
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

    handleEventRegistration() {
        const selected = document.querySelector('.member-item.selected');
        if (!selected) {
            this.showError('Selecione um membro para inscrever em eventos.');
            return;
        }
    
        const memberId = parseInt(selected.dataset.memberId);
        const member = this.members.find(e => e.id === memberId);
    
        // Obtém as preferências de tipos de eventos do membro diretamente
        const memberPreferences = member.preferredEvents;  // Acesse diretamente o preferredEvents
        if (memberPreferences.length === 0) {
            this.showError('Este membro não tem preferências de tipo de evento.');
            return;
        }
    
        // Busca os eventos compatíveis com base nas preferências
        const compatibleEvents = eventTypeManager.getEventsByTypes(memberPreferences);
    
        if (compatibleEvents.length === 0) {
            this.showError('Não há eventos compatíveis com os tipos preferidos deste membro.');
            return;
        }
    
        this.showEventModal(member, compatibleEvents);
    }
    

    showEventModal(member, events) {
        console.log('Mostrando modal para', member.name);  // Adicionar log
        const modal = document.createElement('div');
        modal.classList.add('event-modal');
    
        const title = document.createElement('h3');
        title.textContent = `Inscrever ${member.name} em Evento`;
        modal.appendChild(title);
    
        const eventSelect = document.createElement('select');
        events.forEach(event => {
            const option = document.createElement('option');
            option.value = event.id;
            option.textContent = event.description;
            eventSelect.appendChild(option);
        });
        modal.appendChild(eventSelect);
    
        const buttonContainer = document.createElement('div');
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Inscrever';
        saveButton.addEventListener('click', () => {
            const selectedEventId = eventSelect.value;
            alert(`${member.name} foi inscrito no evento ID ${selectedEventId}`);
            modal.remove();
        });
    
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.addEventListener('click', () => modal.remove());
    
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        modal.appendChild(buttonContainer);
    
        document.body.appendChild(modal);
    }
}

// Criar instância global
const membersModule = new Members();    