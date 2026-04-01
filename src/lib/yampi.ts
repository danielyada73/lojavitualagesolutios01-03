import { Product, ProductVariation } from '../types';

// ── Configuração Yampi ──
const alias = import.meta.env.VITE_YAMPI_ALIAS;
const userToken = import.meta.env.VITE_YAMPI_TOKEN;
const userSecretKey = import.meta.env.VITE_YAMPI_SECRET_KEY;
const BASE_URL = `https://api.dooki.com.br/v2/${alias}`;

/**
 * Função base para chamadas à API REST da Yampi.
 */
export async function yampiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!alias || !userToken || !userSecretKey) {
        console.error('❌ Yampi config missing', { alias, token: !!userToken, secret: !!userSecretKey });
        return null;
    }

    const url = `${BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'User-Token': userToken,
                'User-Secret-Key': userSecretKey,
                ...options.headers,
            },
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(`Yampi API error: ${response.status} ${JSON.stringify(body)}`);
        }

        return body;
    } catch (error) {
        console.error('Error fetching from Yampi:', error);
        return null;
    }
}

/**
 * Mapeia um produto da API Yampi para a interface Product do projeto.
 * Estrutura da Yampi:
 * - product.name, product.slug, product.description
 * - product.skus.data[].prices.data (price, price_compare)
 * - product.images.data[].url
 * - product.categories.data[].slug
 */
export function mapYampiProduct(item: any): Product {
    // SKUs e preço
    const skus = item.skus?.data || [];
    const firstSku = skus[0] || {};
    const priceData = firstSku.prices?.data?.[0] || firstSku.price_data || {};

    const price = parseFloat(priceData.price_sale || priceData.price || firstSku.price_sale || firstSku.price || '0');
    const originalPrice = parseFloat(priceData.price_compare || priceData.price || firstSku.price_compare || firstSku.price || '0');
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    // Imagens
    const images: string[] = [];
    
    // 1. Imagens do Produto
    if (item.images?.data) {
        item.images.data.forEach((img: any) => {
            const url = img.url || img.image_url;
            if (url && !images.includes(url)) images.push(url);
        });
    }

    // 2. Imagens das SKUs (Variações) - Muitas vezes as fotos reais estão aqui
    if (skus.length > 0) {
        skus.forEach((sku: any) => {
            if (sku.images?.data) {
                sku.images.data.forEach((img: any) => {
                    const url = img.url || img.image_url;
                    if (url && !images.includes(url)) images.push(url);
                });
            }
        });
    }

    // Se ainda não tiver imagens, tenta a thumbnail direta
    if (images.length === 0 && item.thumbnail_url) {
        images.push(item.thumbnail_url);
    }

    // Thumbnail final para o card
    const thumbnail = images[0] || 'https://placehold.co/600x600?text=Sem+Imagem';

    // Categoria
    const categorySlug = item.categories?.data?.[0]?.slug || item.category?.slug || 'geral';

    // Variantes
    const variations: ProductVariation[] = skus.map((sku: any) => ({
        id: String(sku.id),
        product_id: String(item.id),
        name: sku.title || sku.name || item.name,
        price: parseFloat(sku.prices?.data?.[0]?.price_sale || sku.price_sale || sku.price || '0'),
        sku_token: sku.token || sku.sku || String(sku.id) || '', // Fallbacks robustos para garantir o checkout
    }));

    // Metadados extras
    const safeParse = (val: string | any) => {
        if (typeof val === 'object') return val;
        try { return val ? JSON.parse(val) : undefined; }
        catch { return undefined; }
    };

    const customFields = item.custom_fields || item.metadata || {};
    const benefits = safeParse(customFields.benefits_json || item.benefits);
    const timeline = safeParse(customFields.timeline_json || item.timeline);
    const faq = safeParse(customFields.faq_json || item.faq);
    const nutrition = safeParse(customFields.nutrition_json || item.nutrition);
    const howToUseSteps = safeParse(customFields.how_to_use_steps || item.how_to_use_steps);
    const howToUseDesc = customFields.how_to_use_description || item.how_to_use_description;

    return {
        id: item.slug || String(item.id),
        category_id: categorySlug,
        name: item.name || item.title || '',
        description: item.description || item.short_description || '',
        price: price,
        original_price: originalPrice > price ? originalPrice : undefined,
        discount_percentage: discount > 0 ? discount : undefined,
        thumbnail_url: thumbnail,
        images: images,
        is_popular: item.is_featured || false,
        is_kit: (item.name || '').toLowerCase().includes('kit'),
        is_available: item.active !== false && (firstSku.available !== false),
        tags: item.tags || [],
        handle: item.slug || String(item.id),
        variations,
        details: {
            subtitle: customFields.subtitle || item.subtitle,
            reviews: {
                rating: customFields.reviews_rating ? parseFloat(customFields.reviews_rating) : 4.9,
                count: customFields.reviews_count ? parseInt(customFields.reviews_count) : 124,
            },
            benefits,
            timeline,
            faq,
            nutrition_facts: nutrition,
            how_to_use: howToUseDesc || howToUseSteps ? {
                title: "Como Usar",
                description: howToUseDesc || "",
                steps: howToUseSteps || [],
            } : undefined,
        },
    };
}

// ── Produtos ──

/**
 * Busca todos os produtos da loja com limite aumentado.
 */
export async function getAllProducts(limit = 100): Promise<Product[]> {
    const data = await yampiFetch(`/catalog/products?include=skus.prices,images,categories&limit=${limit}`);
    if (!data?.data) return [];
    return data.data.map((item: any) => mapYampiProduct(item));
}

/**
 * Busca produto por slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    // Tenta buscar por slug
    const data = await yampiFetch(`/catalog/products?include=skus.prices,images,categories&search[slug]=${slug}&limit=1`);
    if (data?.data?.[0]) {
        return mapYampiProduct(data.data[0]);
    }

    // Fallback: busca por ID se o slug for numérico
    if (/^\d+$/.test(slug)) {
        const byId = await yampiFetch(`/catalog/products/${slug}?include=skus.prices,images,categories`);
        if (byId?.data) {
            return mapYampiProduct(byId.data);
        }
    }

    return null;
}

// ── Categorias ──

// Cache de categorias para evitar chamadas repetidas
let categoriesCache: any[] | null = null;

async function getCategoriesFromApi(): Promise<any[]> {
    if (categoriesCache) return categoriesCache;
    const data = await yampiFetch('/catalog/categories?limit=50');
    categoriesCache = data?.data || [];
    return categoriesCache;
}

/**
 * Mapeamento de slugs do site para slugs/IDs da Yampi.
 * Mesma lógica do HANDLE_MAPPING que tínhamos na Shopify.
 */
const CATEGORY_MAPPING: Record<string, string> = {
    'kits': 'kits-promocionais',
    'kits-promocionais': 'kits-promocionais',
    'creatina': 'creatina',
    'coenzima': 'coenzima-q10',
    'celluli-burn': 'celuli-burn',
    'celluli': 'celuli-burn',
    'omega-3': 'omega-3',
    'colageno-verisol': 'colageno',
    'colageno-po': 'colageno',
    'eye-care': 'eye-care',
};

/**
 * Busca produtos de uma categoria por slug com limite aumentado.
 */
export async function getProductsByCategory(slug: string, limit = 100): Promise<Product[]> {
    const yampiSlug = CATEGORY_MAPPING[slug] || slug;

    console.log(`[Yampi] Buscando categoria: ${slug} -> ${yampiSlug}`);

    // Primeiro, encontra o ID da categoria pelo slug
    const categories = await getCategoriesFromApi();
    const category = categories.find(
        (cat: any) => cat.slug === yampiSlug || cat.name?.toLowerCase() === yampiSlug.toLowerCase()
    );

    if (!category) {
        console.warn(`[Yampi] Categoria não encontrada: ${yampiSlug}`);
        // Fallback: busca por texto no nome dos produtos
        const fallback = await yampiFetch(
            `/catalog/products?include=skus.prices,images,categories&search[name]=${yampiSlug}&limit=${limit}`
        );
        return fallback?.data?.map((item: any) => mapYampiProduct(item)) || [];
    }

    // Busca produtos da categoria
    const data = await yampiFetch(
        `/catalog/categories/${category.id}/products?include=skus.prices,images&limit=${limit}`
    );

    if (!data?.data) {
        console.warn(`[Yampi] Sem produtos na categoria: ${yampiSlug}`);
        return [];
    }

    return data.data.map((item: any) => mapYampiProduct(item));
}

// ── Checkout (Link de Pagamento) ──

/**
 * Gera uma URL de checkout da Yampi para os itens do carrinho.
 * A Yampi suporta links de pagamento diretos no formato:
 * https://{alias}.checkout.yampi.com.br/r/{skuToken}:{quantity},{skuToken}:{quantity}
 */
export function generateCheckoutUrl(items: { skuToken: string; quantity: number }[]): string {
    // Formato: sku_token:quantidade,sku_token:quantidade
    const itemsStr = items
        .filter(item => !!item.skuToken)
        .map(item => `${item.skuToken}:${item.quantity}`)
        .join(',');
    
    // Para domínio customizado, o padrão é seguro.agesolution.com.br
    return `https://seguro.agesolution.com.br/r/${itemsStr}`;
}

/**
 * Cria/retorna uma URL de checkout.
 * Equivalente ao createCart da Shopify.
 */
export async function createCheckout(
    skuToken?: string,
    quantity = 1
): Promise<{ id: string; checkoutUrl: string } | null> {
    if (!skuToken) return null;

    const checkoutUrl = generateCheckoutUrl([{ skuToken, quantity }]);
    return {
        id: `yampi-checkout-${Date.now()}`,
        checkoutUrl,
    };
}

/**
 * Adiciona item ao checkout (atualiza a URL com todos os itens).
 * Equivalente ao addToCart da Shopify.
 */
export async function addToCheckout(
    _currentCheckoutId: string,
    skuToken: string,
    quantity = 1,
    existingItems: { skuToken: string; quantity: number }[] = []
): Promise<{ id: string; checkoutUrl: string } | null> {
    // Verifica se o item já existe na lista
    const updatedItems = [...existingItems];
    const existing = updatedItems.find(item => item.skuToken === skuToken);
    if (existing) {
        existing.quantity += quantity;
    } else {
        updatedItems.push({ skuToken, quantity });
    }

    const checkoutUrl = generateCheckoutUrl(updatedItems);
    return {
        id: `yampi-checkout-${Date.now()}`,
        checkoutUrl,
    };
}

// ── Clientes (Autenticação) ──
// A Yampi não tem uma Storefront API de login/registro como a Shopify.
// O gerenciamento de clientes é feito pelo painel admin.
// Para compatibilidade, mantemos as funções mas simplificadas.

// ── Pedidos (Orders) ──

/**
 * Busca todos os pedidos da loja.
 */
export async function getAllOrders(limit = 50): Promise<any[]> {
    const data = await yampiFetch(`/orders?limit=${limit}&include=customer,items`);
    return data?.data || [];
}

/**
 * Busca pedido por ID.
 */
export async function getOrderById(id: string): Promise<any> {
    const data = await yampiFetch(`/orders/${id}?include=customer,items,transactions`);
    return data?.data || null;
}

// ── Clientes (Customers) ──

/**
 * Busca todos os clientes.
 */
export async function getAllCustomers(limit = 50): Promise<any[]> {
    const data = await yampiFetch(`/customers?limit=${limit}`);
    return data?.data || [];
}

export async function registerCustomer(input: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password?: string;
    acceptsMarketing?: boolean;
}): Promise<any> {
    const data = await yampiFetch('/customers', {
        method: 'POST',
        body: JSON.stringify({
            first_name: input.firstName,
            last_name: input.lastName,
            email: input.email,
            phone: input.phone,
        }),
    });

    return {
        customer: data?.data || null,
        customerUserErrors: data?.errors || [],
    };
}

export async function loginCustomer(_input: {
    email: string;
    password: string;
}): Promise<any> {
    // Yampi não tem login via API pública do mesmo jeito que Shopify.
    console.warn('[Yampi] Login de clientes não suportado via API pública da Yampi.');
    return {
        customerAccessToken: null,
        customerUserErrors: [{
            code: 'NOT_SUPPORTED',
            field: ['email'],
            message: 'Login não disponível. Use o checkout da Yampi para comprar.',
        }],
    };
}

export async function getCustomer(customerAccessToken: string): Promise<any> {
    // Busca cliente por ID (usando o "token" como ID para fins de mockup)
    const data = await yampiFetch(`/customers/${customerAccessToken}`);
    return data?.data || null;
}
