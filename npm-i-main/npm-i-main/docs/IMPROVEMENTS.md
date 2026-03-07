# Improvements

Este documento lista melhorias priorizadas por impacto, esforco e risco.

Escalas:

- Impacto: Alto, Medio, Baixo
- Esforco: Alto, Medio, Baixo
- Risco: Alto, Medio, Baixo (risco de mudanca)

## Prioridades

| Prioridade | Tema | Impacto | Esforco | Risco |
|---|---|---|---|---|
| P0 | Corrigir fluxo de autenticacao front/back | Alto | Medio | Medio |
| P0 | Introduzir testes automatizados minimos | Alto | Medio | Baixo |
| P0 | Endurecer seguranca de secrets e envs | Alto | Baixo | Baixo |
| P1 | Migrar persistencia JSON para DB | Alto | Alto | Medio |
| P1 | Padronizar tratamento de erros e contratos | Medio | Medio | Baixo |
| P1 | Implementar Ads automatico (hoje parcial) | Medio | Medio | Medio |
| P2 | Melhorar observabilidade (logs/metricas) | Medio | Medio | Baixo |
| P2 | Consolidar scripts de qualidade no backend | Medio | Baixo | Baixo |
| P2 | Revisar rotas stubs de providers | Medio | Medio | Baixo |
| P3 | Otimizar UX de carregamento e estados vazios | Baixo | Medio | Baixo |

## Detalhamento e passos sugeridos

## P0.1 - Corrigir fluxo de autenticacao front/back

Contexto:

- Front usa `POST /auth/login` em auth provider.
- Backend expoe login local em `/auth/local/login` e OAuth ML em `/auth/ml`.
- Router frontend esta com protecao desativada.

Passos:

1. Definir estrategia oficial de auth (JWT local, OAuth ML, ou ambos).
2. Alinhar endpoints consumidos no frontend com rotas reais do backend.
3. Reativar `ProtectedRoute` somente apos fluxo principal estar consistente.
4. Adicionar smoke tests de login/logout/session.

## P0.2 - Introduzir testes automatizados minimos

Contexto:

- Nao ha scripts `test` nem arquivos de teste.

Passos:

1. Backend: adicionar `vitest` + `supertest` para `/health`, `/auth/local/login`, `/catalog/:provider`.
2. Frontend: adicionar `vitest` + `@testing-library/react` para rotas e render basico.
3. Adicionar pipeline CI para executar testes.

## P0.3 - Endurecer seguranca de secrets e envs

Contexto:

- Uso de `.env` local e credenciais mock em auth local.

Passos:

1. Garantir `.env` fora de versionamento e criar `.env.example` sem valores sensiveis.
2. Remover credenciais hardcoded de login mock.
3. Validar envs obrigatorias na inicializacao do backend com mensagens claras.

## P1.1 - Migrar persistencia JSON para DB

Contexto:

- Tokens, custos, movimentos e ads spend estao em arquivos JSON.

Passos:

1. Definir schema e repositorios (Postgres recomendado).
2. Migrar `tokenStore`, `costStore`, movimentos e ads spend para camada de persistencia transacional.
3. Criar migracoes e scripts de bootstrap.
4. Planejar migracao de dados legados de JSON para DB.

## P1.2 - Padronizar tratamento de erros e contratos

Contexto:

- Rotas retornam formatos diferentes de erro/sucesso.

Passos:

1. Definir envelope padrao (`ok`, `error`, `message`, `details`, `traceId`).
2. Aplicar helper unico de erro nas rotas.
3. Gerar documento de contratos por rota para frontend.

## P1.3 - Implementar Ads automatico

Contexto:

- `ads/weeks` possui modo misto/manual e trecho automatico nao implementado.

Passos:

1. Conectar endpoint oficial de Ads suportado pela conta/token.
2. Agregar spend por semana no backend.
3. Manter fallback manual para indisponibilidade externa.

## P2.1 - Observabilidade

Passos:

1. Adicionar `requestId` por requisicao.
2. Estruturar logs em JSON com nivel e contexto.
3. Expor metricas basicas (latencia, erros por rota).

## P2.2 - Scripts de qualidade no backend

Passos:

1. Adicionar `lint` e `format` no backend.
2. Incluir `dev` com autoreload real (ex.: `nodemon`).
3. Criar comando `check` para CI local (`lint + test`).

## P2.3 - Revisao de providers stubs

Passos:

1. Explicitar quais providers sao stubs no contrato de API.
2. Evitar fallback silencioso para provider errado quando isso mascarar erro.
3. Adicionar feature flags por provider.

## P3.1 - UX e desempenho

Passos:

1. Uniformizar loading/error/empty states nas paginas.
2. Usar melhor cache/invalidation com React Query (onde aplicavel).
3. Evitar chamadas redundantes em montagens iniciais.

## Sequencia recomendada (90 dias)

1. Semana 1-2: P0.1, P0.3.
2. Semana 3-4: P0.2.
3. Semana 5-8: P1.1 e P1.2.
4. Semana 9-10: P1.3.
5. Semana 11-12: P2.x e P3.1.
