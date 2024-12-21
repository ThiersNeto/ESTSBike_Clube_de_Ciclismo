# ESTSBike - Clube de Ciclismo

## 📝 Descrição
ESTSBike é um sistema de gerenciamento para um clube de ciclismo, desenvolvido como projeto acadêmico para a Escola Superior de Tecnologia de Setúbal. O sistema permite o gerenciamento de membros, eventos e tipos de eventos do clube.

## 🚀 Funcionalidades

### 👥 Gestão de Membros
- Cadastro de novos membros
- Edição de informações dos membros
- Remoção de membros
- Visualização de lista de membros
- Preferências de tipos de eventos por membro

### 📅 Gestão de Eventos
- Criação de eventos
- Edição de eventos existentes
- Remoção de eventos
- Visualização de lista de eventos
- Sistema de inscrição em eventos

### 🎯 Gestão de Tipos de Eventos
- Cadastro de tipos de eventos
- Edição de tipos de eventos
- Remoção de tipos de eventos
- Visualização de lista de tipos de eventos

## 🛠️ Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)
- Arquitetura MVC
- Programação Orientada a Objetos

## 🏗️ Estrutura do Projeto
    Program/
├── CSS/
│ └── style.css
├── Script/
│ └── Structure/
│ ├── Members.js
│ ├── Events.js
│ ├── EventTypes.js
│ └── Messages.js
└── index.html


## 💻 Como Executar
1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador web moderno
3. O sistema estará pronto para uso

## 🔒 Validações e Regras de Negócio
- Não é possível excluir tipos de eventos que possuem eventos associados
- Não é possível excluir membros inscritos em eventos
- Eventos só podem ser criados com datas futuras
- Campos obrigatórios são validados em todos os formulários

## 👥 Autores
- Thiers Neto - 201902549
- André Rocha - 202300185

## 🎓 Instituição
Escola Superior de Tecnologia de Setúbal - 2024