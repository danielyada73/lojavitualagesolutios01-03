import { Product, ProductVariation } from '../types';

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = '2026-01';

export async function shopifyFetch({ query, variables = {} }: { query: string, variables?: any }) {
  if (!domain || !storefrontAccessToken) {
    console.error('❌ Shopify config missing', { domain, token: !!storefrontAccessToken });
    return null;
  }
  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store'
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${JSON.stringify(body.errors)}`);
    }
    return body;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return null;
  }
}

/**
 * Fragmento de Produto com Metafields profissionais
 */
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    images(first: 5) {
      edges {
        node {
          url
        }
      }
    }
    collections(first: 5) {
      edges {
        node {
          handle
        }
      }
    }
    subtitle: metafield(namespace: "product_details", key: "subtitle") { value }
    reviews_rating: metafield(namespace: "product_details", key: "reviews_rating") { value }
    reviews_count: metafield(namespace: "product_details", key: "reviews_count") { value }
    benefits_json: metafield(namespace: "product_details", key: "benefits_json") { value }
    how_to_use_desc: metafield(namespace: "product_details", key: "how_to_use_description") { value }
    how_to_use_steps: metafield(namespace: "product_details", key: "how_to_use_steps") { value }
    timeline_json: metafield(namespace: "product_details", key: "timeline_json") { value }
    faq_json: metafield(namespace: "product_details", key: "faq_json") { value }
    nutrition_json: metafield(namespace: "product_details", key: "nutrition_json") { value }

    variants(first: 20) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          availableForSale
        }
      }
    }
  }
`;

/**
 * Mapeia um produto do GraphQL da Shopify para a interface Product do projeto
 */
export function mapShopifyProduct(node: any): Product {
  const firstVariant = node.variants.edges[0]?.node;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const originalPrice = firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice.amount) : price;
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Processa Metafields Complexos (JSON)
  const safeParse = (val: string | undefined) => {
    try {
      return val ? JSON.parse(val) : undefined;
    } catch {
      return undefined;
    }
  };

  const benefits = safeParse(node.benefits_json?.value);
  const timeline = safeParse(node.timeline_json?.value);
  const faq = safeParse(node.faq_json?.value);
  const nutrition = safeParse(node.nutrition_json?.value);
  const steps = safeParse(node.how_to_use_steps?.value);

  // Mapeia todas as variantes
  const variations: ProductVariation[] = node.variants.edges.map((vEdge: any) => ({
    id: vEdge.node.id,
    product_id: node.id,
    name: vEdge.node.title,
    price: parseFloat(vEdge.node.price.amount)
  }));

  return {
    id: node.handle, // Usamos o handle como ID para compatibilidade com as rotas /product/:id
    category_id: node.collections?.edges[0]?.node.handle || 'geral',
    name: node.title,
    description: node.description,
    price: price,
    original_price: originalPrice > price ? originalPrice : undefined,
    discount_percentage: discount > 0 ? discount : undefined,
    thumbnail_url: node.images.edges[0]?.node.url || 'https://placehold.co/600x600?text=Sem+Imagem',
    images: node.images.edges.map((imgEdge: any) => imgEdge.node.url),
    is_popular: node.collections?.edges.some((c: any) => c.node.handle === 'mais-vendidos'),
    is_kit: node.title.toLowerCase().includes('kit'),
    is_available: firstVariant ? firstVariant.availableForSale : false,
    tags: node.tags || [],
    handle: node.handle,
    variations,
    details: {
      subtitle: node.subtitle?.value,
      reviews: {
        rating: node.reviews_rating?.value ? parseFloat(node.reviews_rating.value) : 4.9,
        count: node.reviews_count?.value ? parseInt(node.reviews_count.value) : 124
      },
      benefits: benefits,
      timeline: timeline,
      faq: faq,
      nutrition_facts: nutrition,
      how_to_use: node.how_to_use_desc?.value || steps ? {
        title: "Como Usar",
        description: node.how_to_use_desc?.value || "",
        steps: steps || []
      } : undefined
    }
  };
}

// --- Cart Mutations ---

export const CREATE_CART_MUTATION = `
  mutation createCart($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
    }
  }
`;

export const ADD_TO_CART_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function createCart(variantId?: string): Promise<{ id: string, checkoutUrl: string } | null> {
  const variables = variantId ? { input: { lines: [{ merchandiseId: variantId, quantity: 1 }] } } : {};
  const data = await shopifyFetch({ query: CREATE_CART_MUTATION, variables });
  return data?.data?.cartCreate?.cart || null;
}

export async function addToCart(cartId: string, variantId: string, quantity = 1) {
  const data = await shopifyFetch({
    query: ADD_TO_CART_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }]
    }
  });
  return data?.data?.cartLinesAdd?.cart || null;
}

// --- Customer Mutations ---

export const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function registerCustomer(input: any) {
  const data = await shopifyFetch({
    query: CUSTOMER_CREATE_MUTATION,
    variables: { input }
  });
  return data?.data?.customerCreate;
}

export async function loginCustomer(input: any) {
  const data = await shopifyFetch({
    query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    variables: { input }
  });
  return data?.data?.customerAccessTokenCreate;
}

export const GET_CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      email
      phone
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            processedAt
            totalPriceV2 {
              amount
              currencyCode
            }
            financialStatus
            fulfillmentStatus
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCustomer(customerAccessToken: string) {
  const data = await shopifyFetch({
    query: GET_CUSTOMER_QUERY,
    variables: { customerAccessToken }
  });
  return data?.data?.customer;
}


export const GET_ALL_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query getAllProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

export const GET_COLLECTION_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query getCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            ...ProductFields
            tags
          }
        }
      }
    }
  }
`;

export async function getAllProducts(limit = 20): Promise<Product[]> {
  const data = await shopifyFetch({
    query: GET_ALL_PRODUCTS_QUERY,
    variables: { first: limit }
  });

  return data?.data?.products?.edges.map((edge: any) => mapShopifyProduct(edge.node)) || [];
}

// Mapeamento de Slugs do Site para Handles da Shopify
const HANDLE_MAPPING: Record<string, string> = {
  'kits': 'kits-promocionais',
  'kits-promocionais': 'kits-promocionais',
  'creatina': 'creatina',
  'coenzima': 'coenzima',
  'celluli-burn': 'celluli',
  'omega-3': 'omega-3',
  'colageno-verisol': 'colageno',
  'colageno-po': 'colageno'
};

export async function getProductsByCollection(handle: string, limit = 20): Promise<Product[]> {
  const shopifyHandle = HANDLE_MAPPING[handle] || handle;

  console.log(`[Shopify] Buscando coleção: ${handle} -> ${shopifyHandle}`);

  const data = await shopifyFetch({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle: shopifyHandle, first: limit }
  });

  if (!data?.data?.collection) {
    console.warn(`[Shopify] Coleção não encontrada: ${shopifyHandle}`);
    return [];
  }

  return data.data.collection.products.edges.map((edge: any) => mapShopifyProduct(edge.node));
}

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const data = await shopifyFetch({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle }
  });

  return data?.data?.product ? mapShopifyProduct(data.data.product) : null;
}
