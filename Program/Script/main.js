/**
 * @fileoverview Arquivo principal de inicialização do sistema ESTSBike
 * @author Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
 * @author André Rocha - 202300185 - 202300185@estudantes.ips.pt
 */

/**
 * Inicializa os tipos de eventos padrão do sistema
 * @function initializeEventTypes
 */
function initializeEventTypes() {
    eventTypeManager.addEventType("Estrada");
    eventTypeManager.addEventType("BTT");
    eventTypeManager.addEventType("BMX");
    eventTypeManager.addEventType("Pista");
    eventTypeManager.addEventType("Ciclocrosse");
    eventTypeManager.addEventType("Cicloturismo");
}

/**
 * Inicializa os eventos padrão do sistema
 * @function initializeEvents
 */
function initializeEvents() {
    eventManager.addEvent(1, "Clássica da Arrábida", new Date("2025-10-15"));
    eventManager.addEvent(2, "BTT Noturno", new Date("2025-11-15"));
    eventManager.addEvent(1, "Volta a Setúbal", new Date("2025-11-01"));
    eventManager.addEvent(6, "Passeio das Vindimas", new Date("2025-09-20"));
    eventManager.addEvent(6, "Tour do Alentejo", new Date("2025-09-30"));
    eventManager.addEvent(3, "BMX Extreme Show", new Date("2025-10-05"));
}

/**
 * Inicializa os membros padrão do sistema
 * @function initializeMembers
 */
function initializeMembers() {
    membersModule.addMember("Thiers Neto", [1, 2]);
    membersModule.addMember("Lucas Gomes", [3, 4]);
    membersModule.addMember("Eduardo Vemba", [5, 6]);
    membersModule.addMember("Saymon Gabriel", [2, 4]);
    membersModule.addMember("Gabriel Piscante", [7]);
    membersModule.addMember("João Silva", [1, 2, 3, 4, 5, 6,]);
}

/**
 * Cria o cabeçalho da aplicação
 * @function createHeader
 * @returns {HTMLElement} Elemento do cabeçalho
 */
function createHeader() {
    const header = document.createElement('header');

    // Título principal
    const title = document.createElement('div');
    const titleText = document.createTextNode("ESTSBike - Clube de Ciclismo");
    title.appendChild(titleText);
    title.classList.add('title');
    header.appendChild(title);

    // Menu de navegação
    header.appendChild(createNavigation());

    return header;
}

/**
 * Cria a navegação principal
 * @function createNavigation
 * @returns {HTMLElement} Elemento de navegação
 */
function createNavigation() {
    const nav = document.createElement('nav');
    nav.classList.add('nav');

    const menuItems = [
        { text: 'Membros', id: 'nav-members', action: () => membersModule.showMembers() },
        { text: 'Eventos', id: 'nav-events', action: () => eventManager.showEvents() },
        { text: 'Tipos de Eventos', id: 'nav-event-types', action: () => eventTypeManager.showEventTypes() }
    ];

    menuItems.forEach(({ text, id, action }) => {
        const menuItem = document.createElement('div');
        const itemText = document.createTextNode(text);
        menuItem.appendChild(itemText);
        menuItem.classList.add('nav-item');
        menuItem.id = id;
        menuItem.addEventListener('click', action);
        nav.appendChild(menuItem);
    });

    return nav;
}

/**
 * Cria o rodapé da aplicação
 * @function createFooter
 * @returns {HTMLElement} Elemento do rodapé
 */
function createFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('footer');

    const footerText = document.createElement('div');
    const text = document.createTextNode("2024 © Escola Superior de Tecnologia de Setúbal • Programação para a Web");
    footerText.appendChild(text);
    footerText.classList.add('footer-text');

    footer.appendChild(footerText);
    return footer;
}

/**
 * Inicializa a aplicação
 * @function initializeApp
 */
function initializeApp() {
    initializeEventTypes();
    initializeEvents();
    initializeMembers();

    // Cria estrutura básica
    document.body.appendChild(createHeader());
    document.body.appendChild(createFooter());

    // Mostra a tela inicial
    eventTypeManager.showEventTypes();
}

document.addEventListener('DOMContentLoaded', initializeApp);
