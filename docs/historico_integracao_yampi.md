# Histórico de Integração: Age Solution x Yampi
**Data da Implementação:** 01 de Abril de 2026

Este documento registra todas as alterações, discussões e implementações realizadas para sincronizar a loja Age Solution com o gateway e o painel de gerenciamento da Yampi (Dooki v2).

## 1. Objetivo Principal
A loja estava implementada estaticamente ou atrelada a mocks baseados na Shopify. O objetivo foi plugar todo o sistema visual dinâmico com a conta da Yampi da Age Solution, resolvendo especificamente problemas como:
*   Redirecionamento com Erro 404 na finalização da compra.
*   Erros de autenticação ou falta de integração no painel de clientes.

---

## 2. Implementações Técnicas Realizadas

### A. Integração Nativa da API Yampi (`src/lib/yampi.ts`)
*   Foi reescrita a estrutura de comunicação via REST conectando com o endpoint `api.dooki.com.br/v2`.
*   As chaves de acesso foram parametrizadas usando o arquivo `.env` (exigência das credenciais `VITE_YAMPI_ALIAS`, `VITE_YAMPI_TOKEN`, `VITE_YAMPI_SECRET_KEY`).
*   Configurada a função `mapYampiProduct` para organizar variáveis de Produtos, Preços, Descontos, Skus e Imagens.

### B. Correção Definitiva do Erro 404 (Link de Pagamento)
**O Problema Documentado:**
Quando os produtos eram adicionados ao carrinho, os botões enviavam o usuário para uma página inexistente na Yampi (`/r/ID-INTERNO`). Isso ocorria porque a Yampi exige Códigos Reais de Venda (Checkout Tokens) em formato de hash (ex: `RMAGUPCGHB`).

**A Solução Implementada:**
1.  **Script Extrator Universal:** Criamos o utilitário `scripts/generate_tokens_json.cjs`. Ele bate na API da Yampi e puxa todos os Links de Venda das SKUs atualizadas, compilando tudo no arquivo `src/data/yampi_tokens.json`.
2.  **Conversão para Vanilla JS:** Enfrentamos pequenos problemas de suporte a TypeScript e sintaxe import/require em módulos nativos. Resolvemos adaptando o script inteiramente para extensões CommonJS (`.cjs`) rodando com `node --env-file`.
3.  **Mapa de Tradução (Token Resolver):** Injetado um mapa estático (`INTERNAL_TOKEN_MAP`) no arquivo `yampi.ts`. Ele atua como um tradutor, transformando códigos do site (como `cell-kit-5`) no link de checkout real da Yampi (`KDNJ1WEHC3`).
4.  **Integração do Carrinho Inteligente:** Atualização em `src/store/cart.ts` para capturar os nomes originais e IDs estendidos dos produtos para garantir que o algoritmo em `yampi.ts` sempre ache o pagamento real por fuzzy match (busca de palavras chaves).

### C. Acesso Completo e Cadastro de Clientes (`Auth.tsx` & `Header.tsx`)
**O Problema Documentado:**
A tela de tentativa de criação de senhas e autenticação local não se vinculava nativamente com os padrões da Yampi, exigindo a inclusão repentina de CPF e causando problemas de comunicação da API (Erro interno no painel).

**A Solução Implementada:**
1.  O arquivo original foi modernizado no começo, incluindo suporte direto a formatações em máscara para CPF e telefone.
2.  **Decisão de Negócio Final (Redirecionamento de Ambientes):** Visando 100% de consistência técnica com a política de cookies da Yampi, refatorou-se radicalmente as interações do Header (no ícone de Login/Usuário) e na página `/auth`.
3.  Todo acesso a dados pessoais passou a fazer Redirecionamento Direto. Todo cliente que decide efetuar login cai na página autêntica da Plataforma: `https://seguro.agesolution.com.br/auth/login`.

---

## 3. Comandos Úteis e Manutenções

*   **Atualizar Novos Preços e Links:**
    Se surgir um produto novo na Yampi amanhã:
    `node --env-file=.env scripts/generate_tokens_json.cjs`

*   **Deploy e Ajustes Futuros:**
    Assegurar de todo commit no Git subir as novas listagens de tokens salvas, para que a Vercel replique corretamente os carrinhos.

## 4. Conclusão da Jornada
Foram realizados cinco grandes blocos de commits focados em consertar progressivamente:
1.  A geração básica de Tokens JSON;
2.  Conversão do script gerador de `.ts` para utilitário puro `.cjs`;
3.  Instalação robusta das rotas de cart sem dependências em faltas (como o pacote fs).
4.  O sistema de correspondência dinâmica do checkout.
5.  A segurança do Auth Flow Oficial pela plataforma.

*O Sistema atual atende organicamente e sem pontos obscuros os requisitos do Checkout Yampi.*
