
/**
 * Classe que representa um membro individual
 * @class Member
 * @property {number} id -                  ID único do membro
 * @property {string} name -                Nome do membro
 * @property {number[]} preferredEvents -    IDs dos tipos de eventos preferidos
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
 * Classe responsável pelo gerenciamento completo de membros
 * @class Members
 * @property {Member[]} members -           Lista de membros cadastrados
 * <p>
 * @property {number} currentId -           Contador para geração de IDs
 * <p>
 * @property {Member|null} selectedMember - Membro atualmente selecionado na UI
 */
class Members {
    constructor() {
        this.members = [];
        this.currentId = 0;
        this.selectedMember = null;
        this.events = [];
        this.eventSubscriptions = [];
        this.loadMembersFromServer();
    }

    async loadMembersFromServer() {
        try {
            const response = await fetch('http://localhost:3000/api/members');
            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }
            const members = await response.json();
            this.members = members;
            this.currentId = Math.max(...members.map(member => member.id), 0);
        } catch (error) {
            console.error('Error loading members:', error);
        }
    }

    /**
     * Adiciona um novo membro
     * @method addMember
     * @param {string} name -                       Nome do membro
     * @param {number[]} [preferredEvents=[]] -     IDs dos tipos de eventos preferidos
     * @returns {Member}                            Novo membro criado
     */
    addMember(name, preferredEvents) {
        this.currentId++;
        const member = new Member(this.currentId, name, preferredEvents);
        this.members.push(member);
        this.syncCreateMember(member);
        return member;
    }

    /**
     * Retorna todos os membros cadastrados
     * @method getAllMembers
     * @returns {Member[]}      Lista de membros
     */
    getAllMembers() {
        return [...this.members];
    }

    /**
     * Atualiza um membro existente
     * @method updateMember
     * @param {number} id -                     ID do membro
     * <p>
     * @param {string} name -                   Novo nome
     * <p>
     * @param {number[]} preferredEvents -      Novos IDs de eventos preferidos
     * <p>
     * @returns {boolean}                       True se atualizado com sucesso
     * @throws {Error}                          Se membro não encontrado
     */
    updateMember(id, name, preferredEvents) {
        const member = this.members.find(e => e.id === id);
        if (!member) throw new Error(MessageEvents.MEMBER_NOT_FOUND);
        member.name = name;
        member.preferredEvents = preferredEvents;
        this.syncUpdateMember(member);
        return true;
    }

    /**
     * Remove um membro
     * @method deleteMember
     * @param {number} id -         ID do membro
     * @returns {boolean}           True se removido com sucesso
     * @throws {Error}              Se membro não encontrado
     */
    deleteMember(id) {
        const index = this.members.findIndex(e => e.id === id);
        if (index === -1) throw new Error(MessageEvents.MEMBER_NOT_FOUND);
        this.members.splice(index, 1);
        this.syncDeleteMember(id);
        return true;
    }

    /**
     * Exibe a lista de membros na interface
     * @method showMembers
     */
    showMembers() {
        const content = UIHelper.clearAndGetMainContent();
        content.appendChild(this.createHeader());
        content.appendChild(this.createMembersList());
        content.appendChild(this.createButtonContainer());
    }

    /**
     * Inscreve membro em um evento
     * @method subscribeToEvent
     * @param {number} memberId -       ID do membro
     * <p>
     * @param {number} eventId -        ID do evento
     * <p>
     * @returns {boolean}               True se inscrito com sucesso
     * @throws {Error}                  Se inscrição já existir
     */
    createHeader() {
        return UIHelper.createSectionHeader('Membros');
    }

    /**
     * Cria container com botões de ações para membros
     * @method createButtonContainer
     * @returns {HTMLElement} Div com botões de CRUD
     * @description Gera 3 botões com as seguintes ações:
     * - Criar: Abre formulário de novo membro
     * - Editar: Inicia edição do membro selecionado
     * - Apagar: Remove membro selecionado
     */
    createButtonContainer() {
        return UIHelper.createButtonContainer([
            { text: 'Criar', id: 'btn-member-create', action: () => this.showMemberForm() },
            { text: 'Editar', id: 'btn-member-edit', action: () => this.handleEdit() },
            { text: 'Apagar', id: 'btn-member-delete', action: () => this.handleDelete() }
        ]);
    }

    /**
     * Cria lista visual de membros com cabeçalho e itens
     * @method createMembersList
     * @returns {HTMLElement} Container da lista de membros
     * @description Estrutura inclui:
     * - Cabeçalho com colunas ID e Nome
     * - Itens de membro ou mensagem de lista vazia
     * - Estilização via classes CSS:
     *   - .members-list (container principal)
     *   - .members-header (cabeçalho)
     *   - .member-item (cada linha de membro)
     */
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

    /**
     * Cria elemento HTML para exibição do membro
     * @method createMemberItem
     * @param {Member} member - Instância do membro
     * @returns {HTMLElement} Elemento HTML do membro
     */
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

    /**
     * Cria e exibe o formulário de membro
     * @method showMemberForm
     * @param {Member|null} [selectedMember=null] - Membro para edição
     */
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

    /**
     * Manipula o salvamento do formulário
     * @method handleSave
     * @param {Member|null} selectedMember - Membro sendo editado
     */
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

    /**
     * Inscreve membro em um evento
     * @method subscribeToEvent
     * @param {number} memberId -       ID do membro
     * <br>
     * @param {number} eventId -        ID do evento
     * <br>
     * @returns {boolean}               True se inscrito com sucesso
     * @throws {Error}                  Se inscrição já existir
     */
    subscribeToEvent(memberId, eventId) {
        if (this.eventSubscriptions.some(sub => sub.memberId === memberId && sub.eventId === eventId)) {
            throw new Error('Membro já está inscrito neste evento');
        }
        this.eventSubscriptions.push({ memberId, eventId });
        return true;
    }

    /**
     * Cancela inscrição em evento
     * @method cancelEventSubscription
     * @param {number} memberId -       ID do membro
     * <br>
     * @param {number} eventId -        ID do evento
     * <br>
     * @returns {boolean}               True se cancelado com sucesso
     * @throws {Error}                  Se inscrição não existir
     */
    cancelEventSubscription(memberId, eventId) {
        const index = this.eventSubscriptions.findIndex(
            sub => sub.memberId === memberId && sub.eventId === eventId
        );
        if (index === -1) throw new Error('Inscrição não encontrada');
        
        this.eventSubscriptions.splice(index, 1);
        MessageEvents.showSuccess('Inscrição cancelada com sucesso');
        return true;
    }

    /**
     * Manipula a edição de membros
     * @method handleEdit
     * @description Verifica seleção e exibe formulário de edição
     * @throws {Error} Exibe erro se nenhum membro estiver selecionado
     */
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

    /**
     * Manipula a exclusão de membros
     * @method handleDelete
     * @description Valida e executa exclusão de membro
     * @throws {Error} Exibe erros de validação ou operação
     * @see Validacao.validarExclusaoMembro
     */
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

    /**
     * Cria estrutura base do formulário
     * @method createForm
     * @param {Member|null} selectedMember -    Membro para edição ou null para novo
     * @returns {HTMLElement}                   Container do formulário com seções organizadas
     */
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

    /**
     * Cria seção de nome do formulário
     * @method createNameSection
     * @param {Member|null} selectedMember -    Membro sendo editado
     * @returns {HTMLElement}                   Seção com campo de entrada de nome
     *
     * @description Inclui:
     * - Label "Nome"
     * - Input text com classe 'member-input'
     * - Valor pré-preenchido para edição
     */
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

    /**
     * Cria layout de colunas para seções de eventos
     * @method createEventsSection
     * @param {Member|null} selectedMember -    Define se exibe coluna de eventos disponíveis
     * @returns {HTMLElement}                   Container com duas colunas:
     * - Esquerda: Tipos preferidos
     * - Direita: Eventos disponíveis (apenas em edição)
     */
    createEventsSection(selectedMember) {
        const columnsContainer = UIHelper.createFormColumns();

        const preferredEventsColumn = this.createPreferredEventsColumn(selectedMember);
        columnsContainer.appendChild(preferredEventsColumn);

        if (selectedMember) {
            const availableEventsColumn = this.createAvailableEventsColumn(selectedMember);
            columnsContainer.appendChild(availableEventsColumn);
        }

        return columnsContainer;
    }

    /**
     * Cria coluna de tipos de eventos preferidos
     * @method createPreferredEventsColumn
     * @param {Member|null} selectedMember -    Preferências atuais do membro
     * @returns {HTMLElement}                   Coluna com checkboxes ou mensagem de ausência
     */
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

    /**
     * Cria coluna de eventos disponíveis para inscrição
     * @method createAvailableEventsColumn
     * @param {Member} member -     Membro com preferências definidas
     * @returns {HTMLElement}       Coluna com grid de eventos ou mensagem
     * @description                 Exibe apenas eventos futuros compatíveis com preferências
     */
    createAvailableEventsColumn(member) {
        const column = UIHelper.createFormColumn();
        const container = document.createElement('div');
        container.classList.add('events-list-container');

        const title = document.createElement('h3');
        title.textContent = 'Eventos Disponíveis';
        title.classList.add('form-label');
        container.appendChild(title);

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

    /**
     * Filtra eventos disponíveis para um membro
     * @method getAvailableEventsForMember
     * @param {Member} member - Membro com preferências
     * @returns {Event[]} Lista filtrada por:
     * - Data igual ou posterior à atual
     * - Tipo consta nas preferências
     */
    getAvailableEventsForMember(member) {
        return eventManager.events.filter(event => {
            const eventDate = new Date(event.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return eventDate >= today && member.preferredEvents.includes(event.typeId);
        });
    }

    /**
     * Cria grade de eventos disponíveis
     * @method createEventsGrid
     * @param {Event[]} events -    Lista de eventos
     * @param {Member} member -     Membro relacionado
     * @returns {HTMLElement}       Elemento HTML da grade
     */
    createEventsGrid(events, member) {
        const grid = document.createElement('div');
        grid.classList.add('events-grid');

        grid.appendChild(
            UIHelper.createTableHeader(
                ['Id', 'Tipo', 'Descritivo', 'Data', 'Ação'],
                'events-header'
            )
        );

        events.forEach(event => {
            grid.appendChild(this.createEventRow(event, member));
        });

        return grid;
    }

    /**
     *  Cria uma linha da grade de eventos com informações e ações de inscrição
     *  @method createEventRow
     *  @param {Object} event -                 Objeto contendo os dados do evento
     *  @param {number} event.id -              ID único do evento
     *  @param {number} event.typeId -          ID do tipo de evento
     *  @param {string} event.description -     Descrição detalhada do evento
     *  @param {string} event.date -            Data do evento em formato ISO
     *  @param {Member} member -                Instância do membro associado à linha
     */
    createEventRow(event, member) {
        const row = document.createElement('div');
        row.classList.add('event-row');

        const eventType = eventTypeManager.getEventType(event.typeId);
        const isSubscribed = this.eventSubscriptions.some(
            sub => sub.memberId === member.id && sub.eventId === event.id
        );

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

    syncCreateMember(member) {
        fetch('http://localhost:3000/api/members', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                name: member.name,
                preferred_events: member.preferredEvents
             }),
         })
     }
 
 
     syncUpdateMember(member) {
         fetch(`http://localhost:3000/api/members/${member.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: member.name,
                preferred_events: member.preferredEvents
              }),
          })
      }
 
     syncDeleteMember(memberId) {
         fetch(`http://localhost:3000/api/members/${memberId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
      }
}

const membersModule = new Members();    