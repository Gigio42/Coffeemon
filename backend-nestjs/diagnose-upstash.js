/**
 * Script de diagnóstico detalhado para Upstash Redis
 */

const Redis = require('ioredis');

const UPSTASH_URL = "rediss://default:AUJpAAIncDIzMWRhYTU5YzAxY2Y0NjllODg4ZjAwNjY0NGFhZWQ3OHAyMTcwMDE@crack-wolf-17001.upstash.io:6379";

console.log('🔍 Diagnóstico Upstash Redis\n');
console.log('URL:', UPSTASH_URL);
console.log('Host:', 'crack-wolf-17001.upstash.io');
console.log('Port:', '6379');
console.log('TLS:', 'Habilitado (rediss://)\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Teste 1: Conexão básica
console.log('📡 Teste 1: Conexão básica (sem TLS)...');
const redisNoTLS = new Redis(UPSTASH_URL, {
  tls: undefined, // Sem TLS primeiro
  connectTimeout: 5000,
  lazyConnect: true,
});

redisNoTLS.on('error', (err) => {
  console.log('   ❌ Erro sem TLS:', err.message);
});

redisNoTLS.connect().then(() => {
  console.log('   ✅ Conexão sem TLS funcionou!');
  redisNoTLS.disconnect();
}).catch((err) => {
  console.log('   ❌ Falhou sem TLS:', err.message);
  console.log('   ℹ️  Isso é esperado, Upstash requer TLS\n');
  
  // Teste 2: Com TLS (rejectUnauthorized: false)
  console.log('📡 Teste 2: Conexão com TLS (rejectUnauthorized: false)...');
  const redisTLS1 = new Redis(UPSTASH_URL, {
    tls: {
      rejectUnauthorized: false,
    },
    connectTimeout: 5000,
    lazyConnect: true,
    enableOfflineQueue: false,
  });

  let connected1 = false;

  redisTLS1.on('connect', () => {
    connected1 = true;
    console.log('   ✅ TCP conectado!');
  });

  redisTLS1.on('ready', () => {
    console.log('   ✅ Redis READY!');
    console.log('   🎉 Conexão com TLS funcionou!\n');
    redisTLS1.disconnect();
    
    // Se chegou aqui, o problema está resolvido
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DIAGNÓSTICO: Upstash está acessível!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  });

  redisTLS1.on('error', (err) => {
    if (!connected1) {
      console.log('   ❌ Erro com TLS:', err.message);
      console.log('   ℹ️  Código:', err.code);
      console.log('   ℹ️  Syscall:', err.syscall, '\n');
      
      // Teste 3: Com TLS (rejectUnauthorized: true)
      console.log('📡 Teste 3: Conexão com TLS (rejectUnauthorized: true)...');
      const redisTLS2 = new Redis(UPSTASH_URL, {
        tls: {
          rejectUnauthorized: true,
        },
        connectTimeout: 5000,
        lazyConnect: true,
      });

      let connected2 = false;

      redisTLS2.on('connect', () => {
        connected2 = true;
        console.log('   ✅ TCP conectado!');
      });

      redisTLS2.on('ready', () => {
        console.log('   ✅ Redis READY!');
        console.log('   🎉 Conexão funcionou!\n');
        redisTLS2.disconnect();
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ DIAGNÓSTICO: Upstash está acessível!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        process.exit(0);
      });

      redisTLS2.on('error', (err) => {
        if (!connected2) {
          console.log('   ❌ Erro:', err.message, '\n');
          
          // Diagnóstico final
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('❌ DIAGNÓSTICO: Não foi possível conectar');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          
          console.log('🔍 Possíveis causas:\n');
          console.log('1. ❌ Firewall bloqueando porta 6379');
          console.log('   Solução: Verifique firewall/antivírus\n');
          
          console.log('2. ❌ Proxy/VPN interferindo na conexão');
          console.log('   Solução: Desative proxy/VPN temporariamente\n');
          
          console.log('3. ❌ Credenciais Upstash inválidas');
          console.log('   Solução: Verifique no dashboard Upstash\n');
          
          console.log('4. ❌ Upstash Database pausado/deletado');
          console.log('   Solução: Verifique status no dashboard\n');
          
          console.log('5. ❌ Rede sem acesso externo');
          console.log('   Solução: Teste conexão com internet\n');
          
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('💡 ALTERNATIVA: Use REST API do Upstash');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          console.log('Execute: node test-upstash-rest.js\n');
          
          redisTLS2.disconnect();
          process.exit(1);
        }
      });

      redisTLS2.connect().catch(() => {});
    }
  });

  redisTLS1.connect().catch(() => {});
});

// Timeout geral
setTimeout(() => {
  console.log('\n⏰ Timeout geral: Nenhuma conexão estabelecida');
  process.exit(1);
}, 15000);
