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
    
    // Adicionar evento de clique para o item "Tipos de Eventos"
    if (item === 'Tipos de Eventos') {
        menuItem.addEventListener('click', () => eventTypeManager.showEventTypes());
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

