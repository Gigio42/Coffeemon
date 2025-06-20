# Coffeemon Backend

Um backend construído com NestJS para o projeto Coffeemon, fornecendo serviços de API REST para gerenciamento de usuários, catálogo de produtos e processamento de pedidos.

## 📑 Índice

- [Coffeemon Backend](#coffeemon-backend)
  - [📑 Índice](#-índice)
  - [🔧 Instalação](#-instalação)
  - [⚙️ Configuração do Ambiente](#️-configuração-do-ambiente)
  - [🏃‍♂️ Executando a Aplicação](#️-executando-a-aplicação)
  - [🩺 Monitoramento de Saúde](#-monitoramento-de-saúde)
  - [📝 Documentação da API](#-documentação-da-api)
  - [🧪 Testes](#-testes)
  - [📁 Estrutura do Projeto](#-estrutura-do-projeto)
  - [🗄️ Banco de Dados](#️-banco-de-dados)

## 🔧 Instalação

```bash
# Clonar o repositório
git clone <url-do-repositório>

# Navegar até o diretório do projeto
cd Coffeemon/backend(NestJS)

# Instalar dependências
npm install
```

## ⚙️ Configuração do Ambiente
A aplicação usa um arquivo .env para variáveis de ambiente. Crie um arquivo .env no diretório raiz:
```bash
# Configuração JWT
JWT_SECRET=secret-key

```

## 🏃‍♂️ Executando a Aplicação
```bash
# Executar em modo build
npm run start

# Executar em modo de desenvolvimento com hot-reloading
npm run start:dev

# Executar em modo de depuração com hot-reloading
npm run start:debug

# Executar em modo de produção
npm run start:prod
```

## 🩺 Monitoramento de Saúde
A aplicação possui um sistema de monitoramento de saúde integrado utilizando o módulo @nestjs/terminus. Você pode verificar a saúde do sistema através do endpoint:

```bash
http://localhost:3000/health
```

Este endpoint fornece informações em tempo real sobre:

Conexão com o banco de dados: Verifica se o banco de dados está acessível e funcionando corretamente
Utilização de memória: Monitora o consumo de memória da aplicação para evitar problemas de desempenho
O sistema de saúde foi projetado para ser facilmente extensível. No futuro, pode ser expandido para monitorar outras coisas.

## 📝 Documentação da API
A API é documentada usando Swagger. Após iniciar a aplicação, acesse a documentação em:

http://localhost:3000/api

A interface do Swagger fornece:

Exploração de todos os endpoints disponíveis
Teste direto das chamadas da API pelo navegador
Visualização dos esquemas de requisição/resposta
Informações sobre requisitos de autenticação

## 🧪 Testes
Este projeto possui cobertura extensa de testes com diferentes opções:

```bash
# Executar testes unitários
# Roda todos os testes uma única vez e mostra resultados
npm run test

# Executar testes em modo de observação (interativo)
# Permite ver os testes sendo executados um por um e fornece feedback
npm run test:watch

# Executar testes com relatório de cobertura
# Gera relatórios detalhados no diretório coverage/
# Mostra quanto do código está coberto por testes
npm run test:cov

# Depurar testes
# Útil para executar passo a passo com pontos de interrupção
npm run test:debug

# Executar testes end-to-end
# Testa as APIs como um todo, simulando requisições reais
npm run test:e2e
```

## 📁 Estrutura do Projeto
```
src/
├── auth/            # Funcionalidade de autenticação
├── orders/          # Processamento e gerenciamento de pedidos 
├── products/        # Gerenciamento do catálogo de produtos
├── users/           # Gerenciamento de usuários
├── app.module.ts    # Módulo principal da aplicação
├── main.ts          # Ponto de entrada da aplicação
└── ormconfig.ts     # Configuração do banco de dados
```

## 🗄️ Banco de Dados
O projeto utiliza SQLite como banco de dados padrão para desenvolvimento, facilitando a configuração inicial. A conexão é gerenciada pelo TypeORM.

Para limpar o banco de dados, você pode usar o script:
```bash
./deleteDB.ps1
```