
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';

// Load env vars
dotenv.config();

const alias = process.env.VITE_YAMPI_ALIAS;
const userToken = process.env.VITE_YAMPI_TOKEN;
const userSecretKey = process.env.VITE_YAMPI_SECRET_KEY;
const BASE_URL = `https://api.dooki.com.br/v2/${alias}`;

if (!alias || !userToken || !userSecretKey) {
  console.error('❌ Yampi config missing in .env');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'User-Token': userToken,
  'User-Secret-Key': userSecretKey,
};

async function yampiFetch(endpoint: string, options: any = {}) {
  try {
    const response = await axios({
      method: options.method || 'GET',
      url: `${BASE_URL}${endpoint}`,
      headers,
      ...options
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`❌ API Error [${endpoint}]:`, error.response.status, JSON.stringify(error.response.data));
    } else {
      console.error(`❌ Fetch Error [${endpoint}]:`, error.message);
    }
    return null;
  }
}

async function getCategories() {
  const res = await yampiFetch('/catalog/categories?limit=100');
  return res?.data || [];
}

async function ensureCategory(name: string, categoriesCache: any[]) {
  const existing = categoriesCache.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing.id;

  console.log(`Creating category: ${name}`);
  const res = await yampiFetch('/catalog/categories', {
    method: 'POST',
    data: { name, active: true }
  });
  const newCat = res?.data;
  if (newCat) categoriesCache.push(newCat);
  return newCat?.id;
}

function parseCSV(content: string) {
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).filter(l => l.trim()).map(line => {
    // Simple CSV parser for quoted fields
    const parts = line.match(/(".*?"|[^",\n\r]+)(?=\s*,|\s*$)/g);
    if (!parts) return null;
    const obj: any = {};
    headers.forEach((h, i) => {
      let val = parts[i] || '';
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      obj[h.trim()] = val.trim();
    });
    return obj;
  }).filter(Boolean);
}

async function run() {
  const csvPath = 'age_solutions_produtos_yampi (1).csv';
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV not found at:', csvPath);
    return;
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const products = parseCSV(csvContent);
  console.log(`Parsed ${products.length} products from CSV.`);

  let categoriesCache = await getCategories();

  for (const p of products) {
    console.log(`\nSyncing product: ${p.nome} (${p.slug})`);

    // Prepare data
    const categoryName = (p.categorias || 'Geral').split(';')[0];
    const categoryId = await ensureCategory(categoryName, categoriesCache);

    const productData = {
      name: p.nome,
      active: p.ativo === 'sim',
      slug: p.slug,
      description: p.descricao,
      active_skus: true,
      category_id: categoryId,
    };

    // Check if product exists by slug
    const search = await yampiFetch(`/catalog/products?search[slug]=${p.slug}&limit=1`);
    let productId;

    if (search?.data?.length > 0) {
      productId = search.data[0].id;
      console.log(`Updating existing product ID ${productId}`);
      await yampiFetch(`/catalog/products/${productId}`, {
        method: 'PUT',
        data: productData
      });
    } else {
      console.log(`Creating new product...`);
      const res = await yampiFetch('/catalog/products', {
        method: 'POST',
        data: productData
      });
      productId = res?.data?.id;
    }

    if (!productId) {
      console.error(`Failed to sync product ${p.nome}`);
      continue;
    }

    // Sync Image
    if (p.link_foto_principal) {
      // Check if image exists
      const imgRes = await yampiFetch(`/catalog/products/${productId}/images`);
      const hasImg = imgRes?.data?.some((img: any) => img.url === p.link_foto_principal || img.image_url === p.link_foto_principal);
      
      if (!hasImg) {
        console.log(`Uploading image for ${p.nome}...`);
        await yampiFetch(`/catalog/products/${productId}/images`, {
          method: 'POST',
          data: {
            image_url: p.link_foto_principal,
            is_main: true
          }
        });
      } else {
        console.log(`Image already exists for ${p.nome}`);
      }
    }
  }

  console.log('\n✅ Sync complete!');
}

run();
