# 📁 Arquitetura do Front-end Coffeemon

Este documento explica a estrutura e responsabilidades de cada arquivo do projeto.

---

## 🎯 Princípio Fundamental

**Separação Total de Responsabilidades**: Cada arquivo tem uma função clara e específica. O `App.tsx` **NÃO** contém lógica de negócio - apenas gerencia navegação e estados compartilhados.

---

## 📂 Estrutura de Arquivos

```
front/
├── App.tsx                      # ⚡ Gerenciador de Navegação (MÍNIMO)
├── types/
│   └── index.ts                 # 📝 Tipos TypeScript
├── utils/
│   └── config.ts                # ⚙️ Configurações (URL do servidor, etc)
└── screens/
    ├── LoginScreen.tsx          # 🔐 Tela de Login
    ├── MatchmakingScreen.tsx    # 🔍 Tela de Procurar Partida
    └── BattleScreen.tsx         # ⚔️ Tela de Batalha
```

---

## 📄 Detalhamento de Cada Arquivo

### ⚡ **App.tsx** (75 linhas)
**Papel**: Gerenciador de Navegação

**O que FAZ:**
- ✅ Controla qual tela está sendo exibida (`currentScreen`)
- ✅ Armazena dados compartilhados (`authData`, `battleData`)
- ✅ Fornece callbacks de navegação inline

**O que NÃO FAZ:**
- ❌ Login/Logout
- ❌ Requisições HTTP
- ❌ Socket.IO
- ❌ Validações
- ❌ AsyncStorage

**Estados:**
- `currentScreen`: Qual tela está ativa (LOGIN, MATCHMAKING, BATTLE)
- `authData`: Token JWT e Player ID
- `battleData`: ID da batalha, estado e socket

---

### 🔐 **LoginScreen.tsx** (~180 linhas)
**Papel**: Autenticação Completa

**Responsabilidades:**
1. ✅ Exibir formulário de login (email/senha)
2. ✅ Validar campos
3. ✅ Fazer POST para `/auth/login`
4. ✅ Buscar dados do jogador em `/game/players/me`
5. ✅ Salvar `token` e `playerId` no AsyncStorage
6. ✅ Verificar se já está logado ao abrir (`checkAuthStatus`)
7. ✅ Navegar para Matchmaking após sucesso

**Funções Principais:**
- `checkAuthStatus()`: Verifica AsyncStorage ao iniciar
- `handleLogin()`: Toda lógica de autenticação

**Props:**
- `onNavigateToMatchmaking(token, playerId)`: Callback para ir ao matchmaking

---

### 🔍 **MatchmakingScreen.tsx** (~220 linhas)
**Papel**: Procurar Partida e Gerenciar Socket

**Responsabilidades:**
1. ✅ Conectar ao servidor via Socket.IO
2. ✅ Exibir status da conexão
3. ✅ Botão "Procurar Partida" (emite `findMatch`)
4. ✅ Escutar evento `matchFound`
5. ✅ Fazer logout (limpar AsyncStorage + desconectar socket)
6. ✅ Navegar para Batalha quando partida encontrada

**Funções Principais:**
- `setupSocket()`: Conecta Socket.IO e configura listeners
- `findMatch()`: Emite evento "findMatch"
- `handleLogout()`: Limpa tudo e volta ao login

**Props:**
- `token`: Token JWT
- `playerId`: ID do jogador
- `onNavigateToLogin()`: Callback para voltar ao login
- `onNavigateToBattle(battleId, battleState, socket)`: Callback para ir à batalha

---

### ⚔️ **BattleScreen.tsx** (~600 linhas)
**Papel**: Gerenciar Batalha Completa

**Responsabilidades:**
1. ✅ Escutar eventos Socket.IO (`battleUpdate`, `battleEnd`)
2. ✅ Renderizar Coffeemon dos jogadores
3. ✅ Exibir HP bars
4. ✅ Mostrar animações de dano
5. ✅ Gerenciar ações do jogador (ataques e trocas)
6. ✅ Emitir eventos `battleAction`
7. ✅ Exibir alerta quando batalha termina
8. ✅ Navegar para Matchmaking ao fim/fuga

**Funções Principais:**
- `setupBattleEvents()`: Configura listeners de batalha
- `sendAction(type, payload)`: Envia ação para servidor
- `handleBattleEnd(winnerId)`: Mostra alerta e volta ao matchmaking
- `updateCoffeemonImages()`: Atualiza sprites dos Coffeemon
- `handleAttackAnimation()`: Mostra animação de dano

**Props:**
- `battleId`: ID da batalha
- `battleState`: Estado inicial da batalha
- `playerId`: ID do jogador
- `socket`: Socket.IO já conectado
- `onNavigateToMatchmaking()`: Callback para voltar ao matchmaking

---

### 📝 **types/index.ts**
Define todos os tipos TypeScript:
- `Screen`: Enum das telas (LOGIN, MATCHMAKING, BATTLE)
- `BattleStatus`: Status da batalha (WAITING, IN_PROGRESS, FINISHED)
- `Move`: Golpe do Coffeemon
- `Coffeemon`: Dados do Coffeemon
- `PlayerState`: Estado do jogador na batalha
- `BattleState`: Estado completo da batalha

---

### ⚙️ **utils/config.ts**
Configurações globais:
- `getServerUrl()`: Detecta IP do servidor automaticamente
- `SOCKET_URL`: URL do servidor
- `BASE_IMAGE_URL`: URL base para imagens dos Coffeemon

---

## 🔄 Fluxo de Navegação

```
┌─────────────┐
│ LoginScreen │ ◄──────────────────┐
└──────┬──────┘                    │
       │ onNavigateToMatchmaking   │
       ▼                            │
┌──────────────────┐                │
│ MatchmakingScreen│ ───────────────┤ onNavigateToLogin
└────────┬─────────┘                │
         │ onNavigateToBattle       │
         ▼                           │
    ┌────────────┐                  │
    │BattleScreen│ ─────────────────┘
    └────────────┘ onNavigateToMatchmaking
```

---

## 🎨 Benefícios desta Arquitetura

1. **📦 Modular**: Cada tela é independente
2. **🧪 Testável**: Funções isoladas por arquivo
3. **📖 Legível**: Código auto-explicativo com comentários
4. **🔧 Manutenível**: Fácil encontrar e modificar código
5. **🚀 Escalável**: Adicionar novas telas é simples
6. **⚡ App.tsx Mínimo**: Apenas 75 linhas!

---

## 📊 Comparação Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **App.tsx** | ~1170 linhas | 75 linhas (-93%) |
| **Lógica no App.tsx** | ❌ Tudo misturado | ✅ Apenas navegação |
| **Funções de Login** | ❌ No App.tsx | ✅ Em LoginScreen |
| **Funções de Socket** | ❌ No App.tsx | ✅ Em MatchmakingScreen |
| **Funções de Batalha** | ❌ No App.tsx | ✅ Em BattleScreen |
| **Manutenibilidade** | ❌ Difícil | ✅ Fácil |

---

## 🎯 Regras de Ouro

1. **App.tsx**: Apenas navegação e estados compartilhados
2. **Cada Screen**: Gerencia sua própria lógica de negócio
3. **Callbacks**: Apenas mudam estados e navegam
4. **AsyncStorage**: Cada tela gerencia quando necessário
5. **Socket.IO**: Cada tela conecta/desconecta quando necessário

---

**Criado por:** Sistema de Refatoração Coffeemon  
**Data:** 05/10/2025  
**Versão:** 2.0 - Arquitetura Modular
