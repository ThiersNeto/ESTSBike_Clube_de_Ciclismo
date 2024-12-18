// Thiers Neto - 201902549 - 201902549@estudantes.ips.pt
// André Rocha - 202300185 - 202300185@estudantes.ips.pt

// Add initial event types
eventTypeManager.addEventType("Estrada");
eventTypeManager.addEventType("BTT");
eventTypeManager.addEventType("BMX");
eventTypeManager.addEventType("Pista");
eventTypeManager.addEventType("Ciclocrosse");
eventTypeManager.addEventType("Cicloturismo");

// Add initial events
eventManager.addEvent(6, "Passeio das Vindimas", new Date("2024-09-20"));
eventManager.addEvent(6, "Tour do Alentejo", new Date("2024-09-30"));
eventManager.addEvent(3, "BMX Extreme Show", new Date("2024-10-05"));
eventManager.addEvent(1, "Clássica da Arrábida", new Date("2024-10-15"));
eventManager.addEvent(2, "BTT Noturno", new Date("2024-11-15"));
eventManager.addEvent(1, "Volta a Setúbal", new Date("2024-11-01"));

// Add initial members
membersModule.addMember("Thiers Neto", [1, 2]);
membersModule.addMember("Lucas Gomes", [3, 4]);
membersModule.addMember("Eduardo Vemba", [5, 6]);
membersModule.addMember("Saymon Gabriel", [2, 4])

// Header
const header = document.createElement('header');

// Título principal
const title = document.createElement('div');
title.textContent = "ESTSBike - Clube de Ciclismo";
title.classList.add('title');
header.appendChild(title);

// Menu de navegação
const nav = document.createElement('nav');
nav.classList.add('nav');

// Itens do menu
const menuItems = ['Membros', 'Eventos', 'Tipos de Eventos'];

menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.textContent = item;
    menuItem.classList.add('nav-item');
    
    if (item === 'Tipos de Eventos') {
        menuItem.addEventListener('click', () => eventTypeManager.showEventTypes());
    } else if (item === 'Eventos') {
        menuItem.addEventListener('click', () => eventManager.showEvents());
    } else if (item === 'Membros') {
        menuItem.addEventListener('click', () => membersModule.showMembers());
    }
    
    nav.appendChild(menuItem);
});

header.appendChild(nav);
document.body.appendChild(header);

// Footer
const footer = document.createElement('footer');
footer.classList.add('footer');

const footerText = document.createElement('div');
footerText.textContent = "2024 © Escola Superior de Tecnologia de Setúbal • Programação para a Web";
footerText.classList.add('footer-text');

footer.appendChild(footerText);
document.body.appendChild(footer);
eventTypeManager.showEventTypes();
