# 🔍 Auditoria Completa — Loja Age Solutions
**Data:** 2026-03-30 22:00 (BRT)  
**Versão Local:** `localhost:3000` (com `.env` corrigido)  
**Versão Produção:** `lojashopifyagesolutios.vercel.app`

---

## 📊 Resumo Executivo

| Ambiente | Status Geral |
|----------|-------------|
| **Localhost** (com .env) | ⚠️ Parcial — API Shopify funciona, mas página de produto tem problemas graves |
| **Vercel (Produção)** | ❌ Crítico — Sem conexão Shopify, rotas quebradas, encoding corrompido |

---

## 🟢 O QUE FUNCIONA

### No Localhost (com .env corrigido)
| Funcionalidade | Status |
|----------------|--------|
| Homepage — carregamento de produtos Shopify | ✅ |
| Categorias — listagem real via API | ✅ |
| Imagens do CDN Shopify | ✅ |
| Preços e descontos reais | ✅ |
| Navegação entre páginas (SPA) | ✅ |
| Banner cookies | ✅ |
| Páginas institucionais (About, Privacy, Terms) | ✅ |
| Busca de produtos (Header) | ✅ |
| Seções da Home (Hero, BestSellers, Celluli, Coenzima, Verisol) | ✅ |
| Carrinho (sidebar abre, adiciona itens via card "Comprar Agora") | ✅ |
| Dashboard admin (/admin) — estrutura visual | ✅ |

### No Vercel (Produção)
| Funcionalidade | Status |
|----------------|--------|
| Homepage — estrutura visual geral | ✅ |
| Navegação interna (via clique em links) | ✅ |
| Páginas institucionais (About, Privacy, Terms, Shipping) | ✅ |
| Banner cookies | ✅ |
| Auth (/auth) — renderiza via navegação interna | ✅ |

---

## 🔴 O QUE NÃO FUNCIONA

### 1. 🚨 CRÍTICO — Deploy Vercel: Sem Conexão Shopify
- **Problema:** O console do navegador exibe `❌ Shopify config missing {domain: undefined, token: false}`
- **Causa:** As variáveis de ambiente `VITE_SHOPIFY_DOMAIN` e `VITE_SHOPIFY_STOREFRONT_TOKEN` **NÃO estão configuradas na Vercel**
- **Impacto:** Sem produto real. A loja inteira opera com dados mockados/fallback
- **Correção:** Adicionar as variáveis no painel da Vercel → Settings → Environment Variables

### 2. 🚨 CRÍTICO — Deploy Vercel: Rotas Diretas Retornam 404
- **Problema:** Acessar diretamente `/checkout`, `/admin`, `/auth` retorna erro 404 da Vercel
- **Causa:** Não existe arquivo `vercel.json` com rewrite para SPA
- **Correção:** Criar `vercel.json` com:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### 3. 🚨 CRÍTICO — Página de Produto: HTML de Site Concorrente
- **Problema:** `rawProductHtml.ts` (320KB!) contém o HTML completo copiado do site **renovabe.com.br** (produto "Botox Firmador Instantâneo - FaceLifting PRO")
- **Impacto em Produção:**
  - Schema JSON-LD aponta para `renovabe.com.br` (péssimo para SEO)
  - Scripts JS apontam para `//renovabe.com.br/cdn/shop/...` (dependem do CDN deles)
  - Textos com encoding corrompido: `at├®` em vez de `até`, `m├¬s` em vez de `mês`
  - Imagens hardcoded do CDN da Renova Be
- **No Localhost:** O `ProductDetails.tsx` tenta substituir via regex, mas:
  - Regex só pega o nome "Botox Firmador..." — qualquer texto diferente não é substituído
  - Imagens da galeria (srcset com múltiplas resoluções) nem sempre são substituídas corretamente
  - A marca "Renova Be" pode vazar em locais não cobertos pelo regex

### 4. 🚨 CRÍTICO — Botão "Comprar agora" na Página de Produto (Vercel)
- **Problema:** O botão não adiciona produto ao carrinho
- **Causa:** O `ProductDetails.tsx` tenta capturar cliques via `document.querySelectorAll` no HTML raw injetado, mas os seletores CSS (`form[action="/cart/add"]`, `.product-form__submit`) dependem da estrutura exata do HTML da Renova Be, que pode não funcionar corretamente no contexto React
- **Impacto:** Impossível comprar qualquer produto pela página de detalhes

### 5. ⚠️ MODERADO — Checkout depende de `checkoutUrl` do Shopify
- **Problema:** O checkout redireciona para `checkoutUrl` obtido via `createCart` da Shopify. Se o carrinho não sincronizar (API falhando silenciosamente), o `checkoutUrl` fica `null` e o checkout exibe alerta genérico
- **Impacto:** No Vercel (sem .env), o checkout **NUNCA funciona**. No localhost, funciona mas pode falhar se a API da Shopify tiver problemas

### 6. ⚠️ MODERADO — Encoding de Caracteres no HTML Raw
- **Problema:** Dentro de `rawProductHtml.ts`, todos os caracteres acentuados estão corrompidos (mojibake): `├® → é`, `├│ → ó`, `├║ → ú`, `├║├╡es → ções`
- **Impacto:** Textos ilegíveis na página de produto. Exemplos visíveis na Vercel:
  - "Envio imediato em at├® 24h"
  - "Comprando dentro das pr├│ximas"
  - "Promo ├╡├╖o Carro" (em vez de "Promoção Carro")

### 7. ⚠️ MODERADO — Galeria de Imagens na Página de Produto
- **Problema:** As imagens da galeria (em `rawProductHtml.ts`) usam `srcset` com múltiplas URLs do CDN `renovabe.com.br`. O regex de substituição em `ProductDetails.tsx` pode não pegar todas as variações de srcset
- **Impacto:** Algumas imagens da galeria podem mostrar fotos do produto concorrente ou não carregar

### 8. ⚠️ MODERADO — Ordenação de Produtos nas Categorias
- **Problema:** O dropdown "Ordenar por" (Mais Populares, Menor Preço, etc.) não tem lógica implementada — é apenas visual
- **Impacto:** Clicar em "Menor Preço" ou "Maior Preço" não muda a ordem

### 9. ⚡ SEGURANÇA — Backdoor Admin Hardcoded
- **Problema:** Em `Auth.tsx` (linha 69), existe um login admin hardcoded:
  ```
  if (formData.email === 'admin' && formData.password === '123@') {
    navigate('/admin');
  }
  ```
- **Impacto:** Qualquer pessoa pode acessar o dashboard admin digitando essas credenciais

### 10. ⚡ SEGURANÇA — Token Shopify Exposto no Frontend
- **Problema:** O Storefront Access Token está em `(1).env` e agora no `.env`, ambos expostos no bundle JS compilado via `import.meta.env`
- **Nota:** Isso é esperado para Storefront API tokens (são públicos por design), mas o token não deve ter permissões administrativas

### 11. 💡 MENOR — Arquivo Yampi Não Utilizado
- **Problema:** `src/lib/yampi.ts` (349 linhas) existe mas **nenhum componente o importa**
- **Impacto:** Código morto ocupando espaço

### 12. 💡 MENOR — Arquivos Duplicados
- **Problema:** Múltiplos arquivos com `(1)` no nome: `(1).env`, `index(1).html`, `package(1).json`, `vite.config(1).ts`, etc.
- **Impacto:** Confusão e poluição no repositório

---

## 📋 Prioridade de Correção Sugerida

| # | Prioridade | Problema | Ação Necessária |
|---|-----------|----------|-----------------|
| 1 | 🔴 Urgente | Vercel sem variáveis Shopify | Configurar env vars na Vercel |
| 2 | 🔴 Urgente | Rotas 404 na Vercel | Criar `vercel.json` com rewrites |
| 3 | 🔴 Urgente | Encoding corrompido na página de produto | Recodificar `rawProductHtml.ts` ou reescrever a página |
| 4 | 🔴 Urgente | Botão Comprar não funciona na PDP | Revisar lógica de captura de eventos no HTML raw |
| 5 | 🟡 Alto | HTML de concorrente (Renova Be) | Substituir integralmente por template próprio |
| 6 | 🟡 Alto | Backdoor admin | Remover login hardcoded |
| 7 | 🟢 Médio | Ordenação não funcional | Implementar lógica de sort |
| 8 | 🟢 Baixo | Código morto (yampi.ts) | Remover ou manter para uso futuro |
| 9 | 🟢 Baixo | Arquivos duplicados | Limpar arquivos `(1)` |
