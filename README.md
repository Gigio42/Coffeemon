# ☕ Coffeemon

[](https://github.com/Gigio42/Coffeemon/actions/workflows/quality.yml)

Coffeemon é um projeto que une um e-commerce de cafés especiais a uma experiência de jogo com criaturas colecionáveis, os **Coffeemons**. Batalhe com seus Coffeemons, gerencie seu inventário e compre produtos, tudo em uma única plataforma.

<p align="center">
  <img src="https://raw.githubusercontent.com/Gigio42/Coffeemon/main/front/assets/coffeemons/maprion/base.png" width="150" alt="Maprion">
  <img src="https://raw.githubusercontent.com/Gigio42/Coffeemon/main/front/assets/coffeemons/limonetto/base.png" width="150" alt="Limonetto">
  <img src="https://raw.githubusercontent.com/Gigio42/Coffeemon/main/front/assets/coffeemons/jasminelle/base.png" width="150" alt="Jasminelle">
</p>

## 🌟 Visão Geral

O projeto é construído sobre uma arquitetura robusta, com um backend desenvolvido em **NestJS** que serve uma API REST para todas as funcionalidades da aplicação, além de utilizar **WebSockets** para a comunicação em tempo real durante as batalhas.

## ✨ Funcionalidades

O Coffeemon é dividido em dois módulos principais: E-commerce e Jogo.

### 🛍️ E-commerce

  - **Gerenciamento de Usuários:** Cadastro, autenticação via JWT e gerenciamento de perfis, com suporte a diferentes papéis (usuário comum e administrador).
  - **Catálogo de Produtos:** API completa para criar, listar, atualizar e deletar produtos de café.
  - **Sistema de Pedidos:** Funcionalidade para que os usuários criem e consultem seus pedidos, com múltiplos itens e cálculo de valor total.

### 🎮 Gamificação (Jogo Coffeemon)

  - **Criaturas Coffeemon:** Entidades com atributos únicos (HP, ataque, defesa), tipos (floral, frutado, etc.) e uma lista de habilidades especiais (movimentos).
  - **Sistema de Batalha em Turnos:** Lógica completa para batalhas entre jogadores, com gerenciamento de turnos, cálculo de dano, acertos críticos, e aplicação de efeitos de status como *burn* e *sleep*.
  - **Matchmaking em Tempo Real:** Um sistema de fila (queue) para encontrar oponentes e iniciar batalhas em tempo real utilizando WebSockets.
  - **Gerenciamento de Jogadores:** API para criar perfis de jogador, associá-los a usuários, gerenciar sua coleção de Coffeemons e montar equipes de até 3 criaturas para as batalhas.

## 🔧 Tecnologias Utilizadas

  - **Backend:** [NestJS](https://nestjs.com/)
  - **Banco de Dados:** [TypeORM](https://typeorm.io/) com [SQLite](https://www.sqlite.org/index.html) (configurado para desenvolvimento)
  - **Autenticação:** [JWT](https://jwt.io/) (JSON Web Tokens)
  - **API:** RESTful com documentação via [Swagger](https://swagger.io/)
  - **Comunicação em Tempo Real:** [WebSockets](https://developer.mozilla.org/pt-BR/docs/Web/API/WebSockets_API) com Socket.IO para o matchmaking e as batalhas.
  - **Testes:** [Jest](https://jestjs.io/) para testes unitários e end-to-end.

## 🚀 Como Executar o Projeto

Atualmente, o foco do projeto é o backend. Para executá-lo localmente:

### Pré-requisitos

  - [Node.js](https://nodejs.org/) (versão \>= 20)
  - [NPM](https://www.npmjs.com/)

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/Gigio42/Coffeemon.git

# 2. Navegue até o diretório do backend
cd Coffeemon/backend(NestJS)

# 3. Instale as dependências
npm install

# 4. Crie um arquivo .env na raiz do diretório do backend
#    e adicione a seguinte variável:
# JWT_SECRET=sua-chave-secreta-super-segura

# 5. Execute a aplicação em modo de desenvolvimento
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

## 📝 Manifesto do Programador

Este projeto segue um conjunto de boas práticas e princípios descritos no **[Manifesto do Programador](https://www.google.com/search?q=https://github.com/Gigio42/Coffeemon/blob/main/MANIFESTO.md)**, que guia o desenvolvimento com foco em qualidade, legibilidade e bem-estar do time.

## 📄 Licença

Este projeto é licenciado sob a **GNU Affero General Public License v3.0**. Veja o arquivo [LICENSE](https://www.google.com/search?q=https://github.com/Gigio42/Coffeemon/blob/main/LICENSE) para mais detalhes.
