# ESTSBike - Clube de Ciclismo

## Descrição
O ESTSBike é um sistema de gerenciamento para um clube de ciclismo, desenvolvido como projeto acadêmico para a Escola Superior de Tecnologia de Setúbal. O sistema permite o gerenciamento de membros, eventos e tipos de eventos do clube, oferecendo uma solução completa para organizar e administrar as atividades do clube.
## Funcionalidades

### Gestão de Membros
- Cadastro de novos membros: Adicione novos membros ao clube.
- Edição de informações: Atualize os dados dos membros.
- Remoção de membros: Remova membros do sistema.
- Visualização de lista de membros: Veja todos os membros cadastrados.
- Preferências de tipos de eventos: Defina os tipos de eventos preferidos de cada membro.

### Gestão de Eventos
- Criação de eventos: Cadastre novos eventos no clube
- Edição de eventos:  Atualize informações de eventos existentes.
- Remoção de eventos: Remova eventos do sistema
- Visualização de lista de eventos: Consulte todos os eventos cadastrados
- Sistema de inscrição: Permite que membros se inscrevam em eventos

### Gestão de Tipos de Eventos
- Cadastro de tipos de eventos: Defina novos tipos de eventos (ex: passeio, competição)
- Edição de tipos de eventos: Atualize os tipos de eventos existentes
- Remoção de tipos de eventos: Remova tipos de eventos do sistema
- Visualização de lista de tipos de eventos: Consulte todos os tipos de eventos cadastrados.

## Tecnologias Utilizadas
- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
- Backend
  - Node.js
  - MySQL
- Arquitetura
  - Programação Orientada a Objetos (POO)

## Estrutura do Projeto
    PW/
    ├── README.md
    ├── package.json
    ├── package-lock.json
    ├── server.js
    ├── Program/
    │   ├── index.html
    │   ├── CSS/
    │   │   ├── responseve.css
    │   │   └── style.css
    │   └── Script/
    │       ├── Structure/
    │       │   ├── Members.js
    │       │   ├── Events.js
    │       │   ├── EventTypes.js
    │       │   └── Messages.js
    │       └── Utils/
    │           └── main.js
    ├── Server/
    │   ├── Config/
    │   │   ├── connection-options.js
    │   │   └── DataBase.js
    │   ├── Controllers/
    │   │   ├── EventController.js
    │   │   ├── EventTypeController.js
    │   │   └── MemberController.js
    │   └── SQL/
    │       ├── schema.sql
    │       └── seed.sql
    └── node_modules/ (Dependências do Node.js)

## Como Executar
1. Node.js
2. MySQL
3. Navegador moderno (Chrome, Firefox, Edge)

## Autores
- Thiers Neto - 201902549
- André Rocha - 202300185