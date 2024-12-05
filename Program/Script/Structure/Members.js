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