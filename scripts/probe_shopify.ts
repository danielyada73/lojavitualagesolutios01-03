import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const domain = process.env.VITE_SHOPIFY_DOMAIN;
const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

async function probe() {
  const endpoint = `https://${domain}/api/2026-01/graphql.json`;

  const query = `
    {
      collections(first: 50) {
        edges {
          node {
            title
            handle
            products(first: 5) {
              edges {
                node {
                  title
                }
              }
            }
          }
        }
      }
      products(first: 50) {
        edges {
          node {
            title
            handle
            tags
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token!,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    fs.writeFileSync('shopify_probe_results.json', JSON.stringify(data, null, 2));
    console.log('✅ Diagnostic saved to shopify_probe_results.json');
  } catch (error) {
    console.error('❌ Error during probe:', error);
  }
}

probe();
