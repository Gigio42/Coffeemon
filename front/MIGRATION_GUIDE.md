# 🔄 Guia de Migração - Arquitetura Feature-First

## 📦 Dependências Adicionadas

```bash
npm install
```

### Novas Bibliotecas:
- **zustand** (^5.0.3): Gerenciamento de estado global
- **@react-navigation/native** (^7.0.13): Navegação profissional
- **@react-navigation/native-stack** (^7.1.10): Stack Navigator
- **react-native-reanimated** (^3.17.3): Animações 60fps na thread nativa
- **@shopify/react-native-skia** (^1.7.3): Renderização pixel-perfect
- **react-native-safe-area-context** (^5.0.0): Safe areas
- **react-native-screens** (^4.4.0): Performance de navegação

## 🏗️ Nova Estrutura de Pastas

```
front/
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── images/
│   │   │   ├── sprites/
│   │   │   └── ui/
│   │   └── sounds/
│   ├── components/
│   │   ├── common/          # Átomos (PixelatedButton, HealthBar, etc)
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Moléculas (MonsterStatusCard, etc)
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── screens/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   ├── battle/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── screens/
│   │   │   ├── state/
│   │   │   └── types.ts
│   │   ├── matchmaking/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── screens/
│   │   │   └── types.ts
│   │   └── ecommerce/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── screens/
│   │       └── types.ts
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── RootStack.tsx
│   │   └── types.ts
│   ├── services/
│   │   ├── api.service.ts
│   │   └── socket.service.ts
│   ├── state/
│   │   ├── authStore.ts
│   │   ├── playerStore.ts
│   │   └── index.ts
│   ├── styles/
│   │   └── theme.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── config.ts
│   │   └── helpers.ts
│   └── App.tsx
├── index.ts
├── package.json
└── tsconfig.json
```

## 🎯 Estratégia de Migração

### Fase 1: Fundação ✅
- [x] Atualizar package.json
- [ ] Criar estrutura de pastas
- [ ] Criar tipos TypeScript completos

### Fase 2: Estado e Serviços
- [ ] Implementar Zustand stores
- [ ] Criar serviços globais (API, Socket)
- [ ] Criar custom hooks

### Fase 3: Componentes
- [ ] Criar componentes Atomic Design
- [ ] Implementar React Navigation

### Fase 4: Migração de Features
- [ ] Migrar Auth
- [ ] Migrar Matchmaking
- [ ] Migrar Battle
- [ ] Migrar Ecommerce

### Fase 5: Polish
- [ ] Adicionar animações Reanimated
- [ ] Implementar Skia para sprites
- [ ] Testes e validação

## 🔄 Mapeamento de Funcionalidades

### Mantidas 100%:
- ✅ Login/Logout
- ✅ Matchmaking PvP
- ✅ Sistema de Batalha
- ✅ Party Management (3 Coffeemons)
- ✅ QR Scanner (adicionar Coffeemons)
- ✅ E-commerce completo
- ✅ Todas as animações visuais

### Removidas (não existem no backend):
- ❌ Bot/PvE (batalha vs Bot)
- ❌ Botão "Batalha vs Bot"

### Adicionadas:
- ✅ Novos eventos WebSocket (NotificationsGateway)
- ✅ Tipos completos alinhados com backend
- ✅ Arquitetura escalável

## 📝 Notas Importantes

1. **Compatibilidade**: Código antigo em `screens/` será mantido temporariamente
2. **Gradual**: Migração incremental, feature por feature
3. **Zero Downtime**: App continua funcionando durante migração
4. **Testes**: Cada feature migrada será testada individualmente

## 🚀 Próximos Passos

Execute:
```bash
npm install
npm start
```

A migração será feita de forma incremental. O código antigo continuará funcionando enquanto migramos.
