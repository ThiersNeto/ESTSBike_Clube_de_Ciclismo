
/**
 * Classe auxiliar para funções comuns de UI
 * @class UIHelper
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * @author André Rocha - 202300185 - 202300185@estudantes.ips.pt
 */
class UIHelper {
    /**
     * Cria um cabeçalho de seção
     * @param {string} title -          Título da seção
     * @returns {HTMLElement}           Elemento do cabeçalho
     */
    static createSectionHeader(title) {
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = title;
        return sectionTitle;
    }

    /**
     * Cria um container de botões com ações
     * @param {Array<{text: string, id: string, action: Function}>} buttons - Array de configurações dos botões
     * @returns {HTMLElement} Container com os botões
     */
    static createButtonContainer(buttons) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        buttons.forEach(({ text, id, action }) => {
            const button = document.createElement('button');
            button.classList.add('action-button');
            button.id = id;
            button.textContent = text;
            button.addEventListener('click', action);
            buttonContainer.appendChild(button);
        });

        return buttonContainer;
    }

    /**
     * Cria um cabeçalho de tabela
     * @param {string[]} headers -          Array com os textos dos cabeçalhos
     * @param {string} headerClass -        Classe CSS para o container do cabeçalho
     * @returns {HTMLElement}               Elemento do cabeçalho da tabela
     */
    static createTableHeader(headers, headerClass) {
        const header = document.createElement('div');
        header.classList.add(headerClass);
        
        headers.forEach(text => {
            const cell = document.createElement('div');
            cell.textContent = text;
            cell.classList.add('header-cell');
            header.appendChild(cell);
        });
        
        return header;
    }

    /**
     * Cria uma mensagem para lista vazia
     * @param {string} message -        Texto da mensagem
     * @returns {HTMLElement}           Elemento com a mensagem
     */
    static createEmptyMessage(message) {
        const messageElement = document.createElement('p');
        messageElement.classList.add('empty-message');
        messageElement.textContent = message;
        return messageElement;
    }

    /**
     * Cria um formulário básico
     * @param {string} title -          Título do formulário
     * @param {HTMLElement} content -   Conteúdo do formulário
     * @returns {HTMLElement}           Container do formulário
     */
    static createFormContainer(title, content) {
        const container = document.createElement('div');
        container.classList.add('form-container');

        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        container.appendChild(titleElement);
        container.appendChild(content);

        return container;
    }

    /**
     * Limpa o conteúdo principal e prepara para novo conteúdo
     * @returns {HTMLElement} Novo elemento de conteúdo principal
     */
    static clearAndGetMainContent() {
        const existingContent = document.querySelector('.main-content');
        if (existingContent) {
            existingContent.remove();
        }

        const content = document.createElement('div');
        content.classList.add('main-content');

        const footer = document.querySelector('.footer');
        document.body.insertBefore(content, footer);

        return content;
    }

    /**
     * Gerencia a seleção de itens em uma lista
     * @param {HTMLElement} element -               Elemento clicado
     * @param {string} itemClass -                  Classe dos itens da lista
     */
    static handleItemSelection(element, itemClass) {
        const previousSelected = document.querySelector(`${itemClass}.selected`);
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        element.classList.add('selected');
    }

    /**
     * Cria um input de texto básico
     * @param {string} className -              Classe CSS do input
     * @param {string} [value=''] -             Valor inicial do input
     * @param {string} [placeholder=''] -       Placeholder do input
     * @returns {HTMLElement}                   Elemento input
     */
    static createTextInput(className, value = '', placeholder = '') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = className;
        input.value = value;
        input.placeholder = placeholder;
        return input;
    }

    /**
     * Cria um select com opções
     * @param {Array<{id: number|string, description: string}>} options -   Opções do select
     * @param {string} className -                                          Classe CSS do select
     * @param {number|string} [selectedValue] -                             Valor selecionado
     * @returns {HTMLElement}                                               Elemento select
     */
    static createSelect(options, className, selectedValue) {
        const select = document.createElement('select');
        select.className = className;
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.id;
            optionElement.textContent = option.description;
            if (selectedValue === option.id) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });
        
        return select;
    }

    /**
     * Cria um input de data
     * @param {string} className -              Classe CSS do input
     * @param {Date} [value] -                  Valor inicial do input
     * @returns {HTMLElement}                   Elemento input
     */
    static createDateInput(className, value) {
        const input = document.createElement('input');
        input.type = 'date';
        input.className = className;
        if (value) {
            input.value = value.toISOString().split('T')[0];
        }
        return input;
    }

    /**
     * Cria uma seção de formulário com duas colunas
     * @returns {HTMLElement} Container das colunas
     */
    static createFormColumns() {
        const columnsContainer = document.createElement('div');
        columnsContainer.classList.add('form-columns');
        return columnsContainer;
    }

    /**
     * Cria uma coluna de formulário
     * @returns {HTMLElement} Coluna do formulário
     */
    static createFormColumn() {
        const column = document.createElement('div');
        column.classList.add('form-column');
        return column;
    }

    /**
     * Cria uma seção de checkbox com título
     * @param {string} title -                                      Título da seção
     * @param {Array<{id: number, description: string}>} items -    Itens para checkbox
     * @param {number[]} selectedIds -                              IDs dos itens selecionados
     * @param {string} className -                                  Classe CSS para os checkboxes
     * @returns {HTMLElement}                                       Container dos checkboxes
     */
    static createCheckboxSection(title, items, selectedIds = [], className = '') {
        const section = document.createElement('div');
        section.classList.add('checkbox-section');

        const label = document.createElement('p');
        label.textContent = title;
        label.classList.add('form-label');
        section.appendChild(label);

        const container = document.createElement('div');
        container.classList.add('checkbox-container');

        items.forEach(item => {
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.classList.add('checkbox-wrapper');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = item.id;
            checkbox.id = `checkbox-${item.id}`;
            checkbox.className = className;
            checkbox.checked = selectedIds.includes(item.id);

            const checkboxLabel = document.createElement('label');
            checkboxLabel.htmlFor = `checkbox-${item.id}`;
            checkboxLabel.textContent = item.description;

            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(checkboxLabel);
            container.appendChild(checkboxWrapper);
        });

        section.appendChild(container);
        return section;
    }
} 