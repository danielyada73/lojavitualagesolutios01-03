import fs from 'fs';

async function run() {
  const res = await fetch('https://renovabe.com.br/products/serum-firmador-facial');
  const html = await res.text();
  
  // Extrair o interior do <main id="MainContent">
  const mainMatch = html.match(/<main[\s\S]*?id=["']MainContent["'][\s\S]*?>([\s\S]*?)<\/main>/i);
  // Extrair variáveis CSS essenciais
  const styleMatch = html.match(/<style data-shopify>([\s\S]*?)<\/style>/i);
  // Extrair links css globais
  const headLinks = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || [];

  if (mainMatch) {
    let mainContent = mainMatch[1];
    let headHtml = (styleMatch ? styleMatch[0] : '') + headLinks.join('\n');

    let outContent = `export const RAW_PRODUCT_HTML = \`${mainContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;\n\n`;
    outContent += `export const RAW_PRODUCT_HEAD_HTML = \`${headHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;\n`;

    fs.writeFileSync('src/data/rawProductHtml.ts', outContent);
    console.log('Extraído com sucesso para src/data/rawProductHtml.ts');
  } else {
    console.error('MainContent não encontrado');
  }
}
run();
