class Member {
    constructor(id, name, email) {
        if (!name || typeof name !== 'string') {
            throw new Error('O nome deve ser uma string não vazia');
        }
        if (!email || typeof email !== 'string') {
            throw new Error('O email deve ser uma string não vazia');
        }
        this.id = id;
        this.name = name.trim();
        this.email = email.trim();
    }
}

class Members {
    constructor() {
        this.members = [];
        this.currentId = 0;
        this.selectedMember = null;
    }

    // Adiciona um novo membro
    addMember(name, email) {
        this.currentId++;
        const member = new Member(this.currentId, name, email);
        this.members.push(member);
        return member;
    }

    // Retorna todos os membros
    getAllMembers() {
        return [...this.members];
    }

    // Atualiza um membro existente
    updateMember(id, name, email) {
        const member = this.member.find(e => e.id === id);
        if (!member) {
            throw new Error('Membro não encontrado');
        }
        member.name = name;
        member.email = email;
        return true;
    }

    // Remove um membro
    deleteMember(id) {
        const index = this.members.findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error('Membro não encontrado');
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
        content.appendChild(this.createButtonContainer());
        content.appendChild(this.createMembersList());

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

    // Gerencia o salvamento
    handleSave(name, email, selectedMember) {
        if (!name || !email) {
            this.showError('Preencha todos os campos.');
            return;
        }

        try {
            if (selectedMember) {
                this.updateMember(selectedMember.id, name, email);
            } else {
                this.addMember(name, email);
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
        content.innerHTML = '';

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
        nameInput.classList.add('event-input');
        nameInput.placeholder = 'Nome';
        if (selectedMember) {
            nameInput.value = selectedMember.name;
        }

        // email
        const emailInput = document.createElement('input');
        emailInput.type = 'text';
        emailInput.classList.add('event-input');
        emailInput.placeholder = 'Email';
        if (selectedMember) {
            emailInput.value = selectedMember.email;
        }


        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Gravar';
        saveButton.classList.add('action-button');
        saveButton.addMemberListener('click', () => {
            this.handleSave(
                nameInput.value,
                emailInput.value,
                selectedMember
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
        
        const headers = ['Id', 'Nome', 'Email'];
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

        const cells = [member.id, member.name, member.email];
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
}

// Criar instância global
const membersModule = new Members();    