
import fs from 'fs';
import path from 'path';

// Pega as variáveis de ambiente (Node.js 20.6+ suporta --env-file, 
// senão pegamos manualmente se estiverem no process.env)
const alias = process.env.VITE_YAMPI_ALIAS;
const userToken = process.env.VITE_YAMPI_TOKEN;
const userSecretKey = process.env.VITE_YAMPI_SECRET_KEY;
const BASE_URL = `https://api.dooki.com.br/v2/${alias}`;

if (!alias || !userToken || !userSecretKey) {
  console.error('❌ Erro: Configurações da Yampi não encontradas no ambiente.');
  console.log('Certifique-se de rodar com: node --env-file=.env scripts/generate_tokens_json.ts');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'User-Token': userToken,
  'User-Secret-Key': userSecretKey,
};

async function run() {
  console.log('🔍 Buscando produtos na Yampi (Zero-Deps)...');
  try {
    const response = await fetch(`${BASE_URL}/catalog/products?include=skus.prices&limit=100`, { headers });
    
    if (!response.ok) {
        throw new Error(`Erro na API Yampi: ${response.status}`);
    }

    const body = await response.json() as any;
    const products = body.data || [];
    
    const tokenMap: Record<string, string> = {};

    products.forEach((p: any) => {
      const skus = p.skus?.data || [];
      const firstSku = skus[0];
      
      let token = firstSku?.token || p.token;
      
      if (!token && firstSku?.purchase_url) {
        token = firstSku.purchase_url.split('/r/')[1];
      }
      
      if (!token && firstSku?.checkout_url) {
        token = firstSku.checkout_url.split('/r/')[1];
      }

      if (token) {
        tokenMap[p.slug] = token;
        tokenMap[String(p.id)] = token;
        console.log(`✅ [${p.slug}] -> ${token}`);
      } else {
        console.warn(`⚠️ [${p.slug}] Sem token encontrado!`);
      }
    });

    const outputPath = path.join(process.cwd(), 'src', 'data', 'yampi_tokens.json');
    fs.writeFileSync(outputPath, JSON.stringify(tokenMap, null, 2));
    console.log(`\n🎉 Mapa de tokens salvo em: ${outputPath}`);
  } catch (error: any) {
    console.error('❌ Erro ao buscar dados:', error.message);
  }
}

run();
