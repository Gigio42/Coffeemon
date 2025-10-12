# 📷 Sistema de Captura de Coffeemons via QR Code

Sistema completo para capturar Coffeemons escaneando QR codes gerados por uma página web.

## 🎯 Funcionalidades

### 1. Gerador de QR Codes (Web)
- Página HTML que busca todos os Coffeemons da API
- Gera QR codes únicos para cada Coffeemon
- Permite baixar os QR codes como imagens PNG
- URL configurável para conectar a diferentes backends

### 2. Scanner de QR Codes (Mobile)
- Botão na tela de Matchmaking para abrir câmera
- Scanner de QR code integrado usando Expo Camera
- Adiciona automaticamente o Coffeemon ao jogador
- Feedback visual e notificações
- Recarrega lista de Coffeemons após captura

---

## 📁 Arquivos Criados

| Arquivo | Caminho | Descrição |
|---------|---------|-----------|
| **qr-generator.html** | `backend-nestjs/etc/mocks/qr-generator.html` | Página web para gerar QR codes |
| **QRScanner.tsx** | `front/screens/QRScanner.tsx` | Componente React Native do scanner |
| **MatchmakingScreen.tsx** | `front/screens/MatchmakingScreen.tsx` | Atualizado com botão de captura |
| **app.json** | `front/app.json` | Atualizado com permissões de câmera |

---

## 🚀 Como Usar

### **Passo 1: Gerar QR Codes**

1. Certifique-se que o backend está rodando:
```powershell
cd backend-nestjs
npm run start:dev
```

2. Abra o gerador de QR codes no navegador:
```
backend-nestjs/etc/mocks/qr-generator.html
```

3. Configure a URL do servidor se necessário:
   - Localhost: `http://localhost:3000`
   - Rede local: `http://SEU_IP:3000` (exemplo: `http://192.168.1.100:3000`)

4. A página irá:
   - Buscar todos os Coffeemons da API
   - Gerar um QR code para cada um
   - Exibir em cards com informações (nome, tipo, stats)

5. Baixe os QR codes clicando em "💾 Baixar QR Code"

---

### **Passo 2: Capturar Coffeemons no App**

1. Inicie o app React Native:
```powershell
cd front
npm start
```

2. Faça login no app

3. Na tela de Matchmaking, clique em **"📷 Capturar Coffeemon"**

4. Permita o acesso à câmera quando solicitado

5. Aponte a câmera para um QR code gerado

6. O app irá:
   - Ler o QR code
   - Extrair o ID do Coffeemon
   - Fazer requisição `POST /game/players/me/coffeemons/:id`
   - Adicionar o Coffeemon ao seu inventário
   - Mostrar alerta com informações do Coffeemon capturado
   - Recarregar automaticamente a lista de Coffeemons

---

## 📡 Formato do QR Code

Os QR codes contêm URLs no formato:
```
coffeemon://add/{coffeemonId}
```

Exemplos:
- `coffeemon://add/1` → Adiciona Coffeemon com ID 1
- `coffeemon://add/2` → Adiciona Coffeemon com ID 2

---

## 🔧 Dependências Instaladas

```json
{
  "expo-camera": "^15.0.16",
  "expo-barcode-scanner": "^13.0.1"
}
```

---

## 🎨 Interface do Scanner

### Tela do Scanner:
```
┌─────────────────────────────┐
│  📷 Escaneie o QR Code      │
│  Aponte a câmera para o     │
│  QR code do Coffeemon       │
│                             │
│     ┌───────────┐           │
│     │           │           │
│     │  QR AREA  │           │
│     │           │           │
│     └───────────┘           │
│                             │
│  [🔄 Escanear Novamente]    │
│  [❌ Cancelar]              │
└─────────────────────────────┘
```

### Feedback Visual:
- ✅ Cantos verdes indicam área de scan
- ⏳ Loading durante processamento
- 🎉 Alert de sucesso ao capturar
- ❌ Alert de erro se QR inválido

---

## ⚙️ Configuração de Permissões

### **Android (app.json)**
```json
{
  "android": {
    "permissions": ["CAMERA"]
  }
}
```

### **iOS (app.json)**
```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "Este app precisa de acesso à câmera para escanear QR codes..."
    }
  }
}
```

### **Expo Plugin**
```json
{
  "plugins": [
    [
      "expo-camera",
      {
        "cameraPermission": "Este app precisa de acesso à câmera..."
      }
    ]
  ]
}
```

---

## 🔍 Validações Implementadas

### No Frontend (QRScanner.tsx):
- ✅ Verifica formato do QR code (`coffeemon://add/{id}`)
- ✅ Valida se o ID é um número válido
- ✅ Previne scans duplicados
- ✅ Trata erros de rede

### No Backend (já existente):
- ✅ Verifica se o Coffeemon existe
- ✅ Verifica se o jogador existe
- ✅ Cria instância única de PlayerCoffeemons
- ✅ Define stats iniciais baseados no template

---

## 🎯 Fluxo Completo

```
1. Admin/Sistema gera QR codes
   ↓
2. QR code é impresso/compartilhado
   ↓
3. Jogador abre app e clica "Capturar Coffeemon"
   ↓
4. Câmera abre e lê QR code
   ↓
5. App extrai ID do Coffeemon (coffeemon://add/1)
   ↓
6. App faz POST /game/players/me/coffeemons/1
   ↓
7. Backend adiciona Coffeemon ao jogador
   ↓
8. App mostra sucesso e recarrega lista
   ↓
9. Coffeemon aparece em "Disponíveis"
```

---

## 🐛 Troubleshooting

### **Câmera não abre**
- Verifique se o app tem permissão de câmera nas configurações do dispositivo
- Reinstale o app após adicionar as permissões no `app.json`

### **QR code não é reconhecido**
- Verifique se o QR code foi gerado corretamente
- Certifique-se que há boa iluminação
- Mantenha a câmera estável e a uma distância adequada

### **Erro ao adicionar Coffeemon**
- Verifique se o backend está rodando
- Verifique se o token JWT está válido
- Verifique se o Coffeemon existe no banco de dados
- Veja os logs do console para mais detalhes

### **Página de QR codes não carrega Coffeemons**
- Verifique a URL do servidor no campo de configuração
- Abra o console do navegador (F12) para ver erros
- Certifique-se que o backend está acessível
- Teste a rota diretamente: `http://localhost:3000/game/coffeemons`

---

## 📱 Testando em Diferentes Ambientes

### **Desenvolvimento Local**
```
Backend: http://localhost:3000
Frontend: Expo Go app
QR Generator: Abrir HTML no navegador
```

### **Rede Local (Teste em dispositivo físico)**
```
Backend: http://SEU_IP:3000 (ex: http://192.168.1.100:3000)
Frontend: Expo Go no celular (mesma rede Wi-Fi)
QR Generator: Configurar URL para http://SEU_IP:3000
```

---

## 💡 Ideias Futuras

- [ ] Sistema de raridade de Coffeemons
- [ ] Limite diário de capturas
- [ ] QR codes com tempo de expiração
- [ ] QR codes de eventos especiais
- [ ] Integração com localização GPS
- [ ] Trading de Coffeemons via QR code
- [ ] Batalhas iniciadas via QR code

---

## 📝 Notas Importantes

1. **Cada QR code pode ser usado múltiplas vezes** - Considere adicionar lógica para prevenir duplicatas se necessário

2. **Coffeemons são adicionados ao inventário, não ao time** - O jogador precisa adicionar manualmente ao time depois

3. **URL do QR code é custom (`coffeemon://`)** - Não é um link HTTP normal, é processado internamente pelo app

4. **Permissões de câmera são críticas** - Sem elas, o scanner não funciona

5. **Teste primeiro em emulador/simulador** - Depois teste em dispositivo físico para validar câmera

---

## ✅ Checklist de Implementação

- [x] Instalar dependências (expo-camera, expo-barcode-scanner)
- [x] Criar página HTML geradora de QR codes
- [x] Criar componente QRScanner
- [x] Integrar scanner na MatchmakingScreen
- [x] Adicionar permissões no app.json
- [x] Implementar lógica de adicionar Coffeemon
- [x] Adicionar feedback visual (alerts, loading)
- [x] Recarregar lista após captura
- [x] Tratamento de erros

---

## 🎉 Pronto para Usar!

O sistema está completo e funcional. Basta:
1. Gerar os QR codes na página web
2. Escanear com o app
3. Capturar Coffeemons!

**Divirta-se capturando todos! 🎮✨**
