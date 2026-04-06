import { Product, ProductVariation } from '../types';
import yampiTokens from '../data/yampi_tokens.json';

// ── Configuração Yampi (Via Server-Side) ──
const BASE_URL = `/api/yampi`;

/**
 * Função base para chamadas à API da Yampi via proxy backend.
 */
export async function yampiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: JSON.stringify({
                endpoint,
                method: options.method || 'GET',
                body: options.body ? JSON.parse(options.body as string) : undefined
            })
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(`Yampi API error: ${response.status} ${JSON.stringify(body)}`);
        }

        return body;
    } catch (error) {
        console.error('Error fetching from Yampi proxy:', error);
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
        // Prioriza o token de venda real (RMAG...), depois o SKU técnico, depois o ID
        sku_token: sku.token || item.token || (sku.purchase_url ? sku.purchase_url.split('/r/')[1] : '') || 
                  (sku.checkout_url ? sku.checkout_url.split('/r/')[1] : '') ||
                  (yampiTokens as any)[item.slug] || (yampiTokens as any)[String(sku.id)] ||
                  sku.sku || String(sku.id) || '',
    }));

    console.log(`[Yampi] Mapeado: ${item.name} | Token Checkout: ${variations[0]?.sku_token}`);

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
 * Tradução de IDs internos do site para Tokens de Checkout da Yampi.
 * Isso garante que mesmo produtos de mock funcionem no checkout.
 */
const INTERNAL_TOKEN_MAP: Record<string, string> = {
    // Creatina
    'cre-ind': '9K68OGYB34',
    'cre-kit-2': '3LGTLLJT9Q',
    'cre-kit-3': 'CAZ37JJ91W',
    
    // Celluli Burn
    'cell-ind': 'RMAGUPCGHB',
    'cell-kit-2': 'PCF9HY50IY',
    'cell-kit-3': '78HF7WJF4F',
    'cell-kit-5': 'KDNJ1WEHC3',
    'cell-kit-6': 'KDNJ1WEHC3', // Fallback se mapeado errado
    
    // Coenzima Q10
    'coenz-ind': 'JD0TPQXRRP',
    'coenz-kit-2': 'ARHY9PYKB4',
    'coenz-kit-3': 'KSO4RI8XF0',
    'coenz-kit-5': 'C1EJM7X0EW',
    
    // Colágeno com Ácido Hialurônico
    'col-cran': '3U1Y8DTZH9',
    'col-lim': '3U1Y8DTZH9', 
    'col-kit-2': 'HOYDA7TYT0',
    'col-kit-3': 'RZI9L4LENR',
    'col-kit-6': 'OICN88HJC2',
    
    // Colágeno Verisol
    'verisol-ind': '8G95KP981S',
    'verisol-kit-2': 'E6DOV587F3',
    'verisol-kit-3': '3AUV0QPTH3',
    'verisol-kit-6': 'S5LJPNV5AG',
    
    // Outros
    // Outros
    'eye-care-ind': 'M3031LYEM6',
    'eye-care-kit-2': 'AJGJNNIH77',
    'eye-care-kit-3': 'GIJO9RSP81',
};

/**
 * Verifica se o produto tem algum token Yampi válido.
 */
export function hasValidYampiToken(skuToken: string, name?: string): boolean {
    let realToken = INTERNAL_TOKEN_MAP[skuToken];
    if (!realToken) realToken = (yampiTokens as any)[skuToken];
    if (!realToken && name) {
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const foundKey = Object.keys(yampiTokens).find(key => {
            const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanName.includes(cleanKey) || cleanKey.includes(cleanName);
        });
        if (foundKey) realToken = (yampiTokens as any)[foundKey];
    }
    // Consideramos válido se mapenou para um Token da Yampi (que costuma ser alfa-numérico grande ou os especificados)
    if (realToken) return true;
    
    // Se o skuToken original for um token Yampi válido nativo (geralmente > 8 chars letras e números maiúsculos)
    if (skuToken && skuToken.length >= 8 && /^[A-Z0-9]+$/.test(skuToken)) return true;
    
    return false;
}

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
export function generateCheckoutUrl(items: { skuToken: string; quantity: number; name?: string }[]): string {
    // Formato: sku_token:quantidade,sku_token:quantidade
    const itemsStr = items
        .filter(item => !!item.skuToken || !!item.name)
        .map(item => {
            // 1. Tenta pelo Mapa de IDs Internos
            let realToken = INTERNAL_TOKEN_MAP[item.skuToken];
            
            // 2. Tenta pelo Mapa de Segurança (JSON gerado)
            if (!realToken) {
                realToken = (yampiTokens as any)[item.skuToken];
            }
            
            // 3. Tenta pelo NOME do produto (Fuzzy match) - Último recurso
            if (!realToken && item.name) {
                const cleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                // Tenta achar qualquer chave no JSON que contenha as palavras principais
                const foundKey = Object.keys(yampiTokens).find(key => {
                    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return cleanName.includes(cleanKey) || cleanKey.includes(cleanName);
                });
                if (foundKey) {
                    realToken = (yampiTokens as any)[foundKey];
                }
            }

            // 4. Se ainda não achou, usa o que tiver como token original
            const finalToken = realToken || item.skuToken;
            
            console.log(`[Yampi] Resolvendo Token para ${item.name || item.skuToken}: ${finalToken}`);
            return `${finalToken}:${item.quantity}`;
        })
        .filter(str => !str.startsWith(':')) // Remove itens sem token
        .join(',');
    
    if (!itemsStr || itemsStr === '') {
        console.warn('[Yampi] Checkout URL gerada sem tokens de SKU!');
        return '';
    }

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
    document?: string;
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
            document: input.document,
        }),
    });

    if (data?.errors) {
        // Formata os erros da Yampi para exibição amigável
        const errorMsg = Object.values(data.errors).flat().join(' ');
        return {
            customer: null,
            customerUserErrors: [{ message: errorMsg || 'Erro ao registrar cliente.' }]
        };
    }

    return {
        customer: data?.data || null,
        customerUserErrors: [],
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

// ── Métodos de Escrita (Sincronização) ──

/**
 * Cria um produto na Yampi.
 */
export async function createProduct(data: any): Promise<any> {
    return yampiFetch('/catalog/products', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Atualiza um produto na Yampi.
 */
export async function updateProduct(id: string | number, data: any): Promise<any> {
    return yampiFetch(`/catalog/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Faz upload de uma imagem para um produto.
 */
export async function uploadProductImage(productId: string | number, imageUrl: string): Promise<any> {
    return yampiFetch(`/catalog/products/${productId}/images`, {
        method: 'POST',
        body: JSON.stringify({
            image_url: imageUrl,
            is_main: true,
        }),
    });
}

/**
 * Garante que uma categoria exista, criando-a se necessário.
 */
export async function ensureCategory(name: string): Promise<any> {
    const categories = await getCategoriesFromApi();
    const existing = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    
    if (existing) return existing;

    const created = await yampiFetch('/catalog/categories', {
        method: 'POST',
        body: JSON.stringify({ name, active: true }),
    });

    // Limpa cache para forçar recarregamento
    categoriesCache = null;
    return created?.data || null;
}

export async function getCustomer(customerAccessToken: string): Promise<any> {
    // Busca cliente por ID (usando o "token" como ID para fins de mockup)
    const data = await yampiFetch(`/customers/${customerAccessToken}`);
    return data?.data || null;
}
