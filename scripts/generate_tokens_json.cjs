
const fs = require('fs');
const path = require('path');

// Pega as variáveis de ambiente
const alias = process.env.VITE_YAMPI_ALIAS;
const userToken = process.env.VITE_YAMPI_TOKEN;
const userSecretKey = process.env.VITE_YAMPI_SECRET_KEY;
const BASE_URL = `https://api.dooki.com.br/v2/${alias}`;

if (!alias || !userToken || !userSecretKey) {
  console.error('❌ Erro: Configurações da Yampi não encontradas no ambiente.');
  console.log('Certifique-se de ter o arquivo .env preenchido e rodar com: node --env-file=.env scripts/generate_tokens_json.cjs');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'User-Token': userToken,
  'User-Secret-Key': userSecretKey,
};

async function run() {
  console.log('🔍 Buscando produtos na Yampi...');
  try {
    const response = await fetch(`${BASE_URL}/catalog/products?include=skus.prices&limit=100`, { headers });
    
    if (!response.ok) {
        throw new Error(`Erro na API Yampi: ${response.status}`);
    }

    const body = await response.json();
    const products = body.data || [];
    
    const tokenMap = {};

    products.forEach((p) => {
      const skus = p.skus?.data || [];
      const firstSku = skus[0];
      
      let token = firstSku?.token || p.token;
      
      if (!token && firstSku?.purchase_url) {
        token = firstSku.purchase_url.split('/r/')[1];
      }
      
      if (!token && firstSku?.checkout_url) {
        token = firstSku.checkout_url.split('/r/')[1];
      }

      if (token && token.length > 5) {
        tokenMap[p.slug] = token;
        tokenMap[String(p.id)] = token;
        // Também mapeia o nome limpo para fallback de busca
        const cleanName = p.name.toLowerCase().trim();
        tokenMap[cleanName] = token;
        console.log(`✅ [${p.slug}] -> ${token}`);
      } else {
        console.warn(`⚠️ [${p.slug}] Sem token encontrado ou inválido.`);
      }
    });

    const outputPath = path.join(process.cwd(), 'src', 'data', 'yampi_tokens.json');
    fs.writeFileSync(outputPath, JSON.stringify(tokenMap, null, 2));
    console.log(`\n🎉 Mapa de tokens salvo com sucesso em: ${outputPath}`);
    console.log('O checkout agora deve redirecionar corretamente!');
  } catch (error) {
    console.error('❌ Erro ao buscar dados:', error.message);
  }
}

run();
