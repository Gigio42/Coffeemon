/**
 * Teste Upstash usando REST API (HTTP)
 * Alternativa se a conexão TCP/TLS estiver bloqueada
 */

const https = require('https');

const UPSTASH_REST_URL = "https://crack-wolf-17001.upstash.io";
const UPSTASH_TOKEN = "AUJpAAIncDIzMWRhYTU5YzAxY2Y0NjllODg4ZjAwNjY0NGFhZWQ3OHAyMTcwMDE";

console.log('🔄 Testando Upstash via REST API...\n');

function makeRequest(command, args = []) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify([command, ...args]);
    
    const options = {
      hostname: 'crack-wolf-17001.upstash.io',
      path: '/',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode === 200) {
            resolve(parsed.result);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        } catch (err) {
          reject(new Error(`Parse error: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  try {
    // Teste 1: PING
    console.log('🏓 Teste 1: PING');
    const pong = await makeRequest('PING');
    console.log(`   ✅ Resposta: ${pong}\n`);

    // Teste 2: SET
    console.log('📝 Teste 2: SET');
    await makeRequest('SET', ['test:coffeemon:rest', 'Hello from REST API!']);
    console.log('   ✅ Valor salvo com sucesso\n');

    // Teste 3: GET
    console.log('📖 Teste 3: GET');
    const value = await makeRequest('GET', ['test:coffeemon:rest']);
    console.log(`   ✅ Valor recuperado: "${value}"\n`);

    // Teste 4: DEL
    console.log('🗑️  Teste 4: DEL');
    await makeRequest('DEL', ['test:coffeemon:rest']);
    console.log('   ✅ Valor removido com sucesso\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Upstash REST API funcionando perfeitamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('💡 RECOMENDAÇÃO: Use REST API no backend\n');
    console.log('A REST API é mais confiável quando há firewalls');
    console.log('bloqueando conexões TCP na porta 6379.\n');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ REST API também falhou');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🔍 Possíveis causas:\n');
    console.log('1. ❌ Sem conexão com internet');
    console.log('2. ❌ Firewall bloqueando HTTPS');
    console.log('3. ❌ Token Upstash inválido');
    console.log('4. ❌ Database Upstash pausado/deletado\n');
    
    console.log('Verifique o dashboard Upstash:\n');
    console.log('https://console.upstash.com/redis\n');
    
    process.exit(1);
  }
}

runTests();
