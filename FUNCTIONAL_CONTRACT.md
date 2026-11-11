# Contrato funcional — Instituna «Cartaz & Palmarés»

> Documento de não-regressão escrito **antes** do redesign visual.
> Data de referência: 2026-11-11 · branch `redesign` · baseline `bedbe1f`.
> O objetivo do redesign é mudar apenas apresentação. Tudo o que aqui está descrito
> deve manter-se idêntico em comportamento, dados, autenticação e rotas.

## 1. Stack e estrutura

| Área | Decisão atual |
| --- | --- |
| Bundler | Vite 8 (`@vitejs/plugin-react`) |
| Linguagem | TypeScript (React 19, TS 6) |
| Router | **Não existe router**. A vista é escolhida por estado em `App.tsx`. |
| Estado | `useState` local + hooks `useFestivals` e `useAuth`; sem Redux/Zustand. |
| Estilos | Tailwind CSS v4 via `@tailwindcss/vite`, com `@theme` em `src/index.css`. |
| Animação | Nenhuma biblioteca. Apenas classes CSS (`animate-pulse`) no skeleton. |
| Testes | **Não há test runner, script `test` nem ficheiros de teste** no repositório. |
| Estrutura | `src/api`, `src/auth`, `src/hooks`, `src/components`, `src/utils`, `src/types.ts`. |

Baseline executada:

- `npm run build` — passa (`tsc -b && vite build`, 600 módulos).
- `npm run lint` (`oxlint`) — passa sem avisos.
- `npm test` — não existe script; não há suíte de testes para executar.
- Não existem snapshots.

## 2. Rotas / vistas públicas e protegidas

Não há URL routing. Existem três vistas e dois modais, todos controlados por estado:

| Vista | Condição | Acesso |
| --- | --- | --- |
| Arquivo público | `isLoginOpen === false` | Público |
| Página de login | `isLoginOpen === true` | Público (substitui a app inteira) |
| Modal «Novo festival» | `isAuthenticated && isCreateOpen` | Protegida |
| Modal «Editar festival» | `isAuthenticated && editingFestival` | Protegida |
| Estados de erro / loading / arquivo vazio | derivados de `useFestivals` | Público |

«Protegida» é aplicada na renderização: os modais só são montados com
`isAuthenticated`, e `handleDelete` faz `if (!isAuthenticated) return;`.
Os controlos «Editar»/«Eliminar» só recebem handlers quando autenticado.

## 3. Autenticação (comportamento exato)

### 3.1 ENTRAR

1. O botão «Entrar» (`type="button"`) do cabeçalho faz `setIsLoginOpen(true)`.
2. `App` deixa de renderizar o arquivo e renderiza `<LoginPage />` na mesma página
   (não há navegação de URL nem modal).
3. «Voltar ao site» e o sucesso do login fazem `setIsLoginOpen(false)`.

### 3.2 Formulário

- Campos controlados, por esta ordem de tabulação:
  1. `input#login-username`, `autoComplete="username"`, `autoFocus`, sem `name`.
  2. `input#login-password`, `type="password"`, `autoComplete="current-password"`, sem `name`.
- Labels associados: `label[for="login-username"]` e `label[for="login-password"]`.
- Não têm atributo `required`; a validação é feita em JavaScript.
- Enter submete porque o botão é `type="submit"` dentro do `<form onSubmit>`.

### 3.3 Validação e mensagens

- `username.trim()` vazio ou `password` vazio →
  **«Preenche o utilizador e a palavra-passe.»**
- Erro de `ApiError` → usa `err.message` devolvida pela API
  (ex.: «Credenciais inválidas.» ou «Autenticação não configurada no servidor.»).
- Qualquer outro erro → **«Não foi possível iniciar sessão. Tenta novamente.»**
- Não há mensagem de sucesso: o sucesso fecha a página de login e regressa ao arquivo.

### 3.4 Loading

- `isSubmitting` desativa o botão submit e muda o texto de «Entrar» para **«A entrar…»**.
- O botão tem `disabled={isSubmitting}`; a classe visual reduz opacidade e cursor.
- Nenhuma animação pode bloquear ou atrasar a interação.

### 3.5 Sessão e token

- `login()` chama `POST {VITE_API_BASE_URL}/auth/login` com `{ username, password }`.
- Resposta: `{ data: { token, user: { username } } }`.
- Token guardado em `localStorage` na chave `instituna.auth.token`
  (`src/auth/token.ts`).
- Ao arrancar, se existir token, `GET /auth/me` valida-o. Se falhar, o token é apagado.
- Qualquer resposta `401` com token existente limpa o token e emite o evento
  `instituna:auth-unauthorized`; `useAuth` passa `user` a `null`.
- O token vai em `Authorization: Bearer <token>` nos pedidos de escrita.
- Logout = «Sair» → `clearAuthToken()` + `setUser(null)`. Não há chamada ao servidor.

### 3.6 Pós-login e guards

- Após login válido, `onSuccess` fecha o login; o utilizador vê o mesmo arquivo,
  agora com:
  - nome do utilizador (`user.username`) no cabeçalho;
  - botão «Novo festival»;
  - botão «Sair»;
  - «Editar» e «Eliminar» em cada cartão;
  - botão «Novo festival» no estado de arquivo vazio.
- Não há redirecionamento para outra URL.
- Escrita na API é protegida no backend por `requireAuth`; no frontend a proteção é
  a renderização condicional descrita acima.

## 4. Origem e carregamento dos dados

- `useFestivals` chama `GET {VITE_API_BASE_URL}/festival` no mount e em cada `refetch`.
- Base URL: `VITE_API_BASE_URL` (fallback `http://localhost:4000`), sem barras finais.
- Resposta: `{ data: Festival[] }`; `normalizeFestival` extrai `id` de `_id`,
  corta a data a `YYYY-MM-DD` e garante arrays vazios para `premios`,
  `tunasConcurso` e `tunasExtra`.
- `cartazUrl` relativo é prefixado com a base URL.
- Estados: `isLoading` inicial; `error` com mensagem de `ApiError` ou
  «Ocorreu um erro inesperado.»; `festivals` vazio; lista carregada.
- `refetch` incrementa `reloadToken`, repetindo o efeito.
- Criação/edição usam `POST`/`PUT` (JSON ou `multipart/form-data` quando há cartaz)
  e depois `refetch`. Eliminação usa `DELETE` e depois `refetch`.
- `isSubmitting` e `deletingId` controlam loading de escrita/eliminação.

## 5. Totais do palmarés acumulado

Implementado em `StatsDashboard` com `useMemo`; **não alterar**:

- Percorre todas as categorias de `AWARD_CATEGORIES` e inicializa cada contagem a 0.
- Para cada festival, para cada `premio.name`, chama `categorizePremio(name)` e
  incrementa a categoria devolvida.
- `categorizePremio` (case-insensitive, por substring):
  - «2ª melhor tuna», «2a melhor tuna» ou «segunda melhor tuna» → **Outros Prémios**
  - «melhor tuna» → **Melhor Tuna**
  - «pandeireta»/«pandeiret» → **Melhor Pandeireta**
  - «estandarte» → **Melhor Estandarte**
  - «instrumental» → **Melhor Instrumental**
  - «original» → **Melhor Original**
  - «solista» → **Melhor Solista**
  - «serenata» → **Melhor Serenata**
  - «tuna mais tuna», «tuna+» ou «+tuna» → **Tuna Mais Tuna**
  - restantes → **Outros Prémios**
- A ordem das 9 categorias é a de `AWARD_CATEGORIES`:
  Melhor Tuna, Melhor Pandeireta, Melhor Estandarte, Melhor Instrumental,
  Melhor Original, Melhor Solista, Melhor Serenata, Tuna Mais Tuna, Outros Prémios.
- Os rótulos visuais são `categoryLabel`: remove «Melhor » e mostra «Outros»
  para «Outros Prémios». Os números são `awardCounts[cat.key] ?? 0`.

## 6. Mapa de festivais

Implementado em `PortugalMap` com D3; **não alterar paths, dados, ids, chaves ou handlers**:

- GeoJSON remoto:
  `https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/portugal.geojson`.
- Ilhas dos Açores e Madeira são polígonos locais (`geoIdentity`) e recebem o nome
  da região (`Açores`/`Madeira`).
- Associação festival → distrito: `getDistrict(festival.location)` em
  `src/utils/districts.ts` (mapa cidade→distrito, tolerante a acentos, e fallback
  para o próprio nome do distrito). Sem distrito resolvido, o festival não entra
  no mapa.
- `districtFestivals`: `Record<distrito, nomes de festivais>`.
- `districtCounts`: `Record<distrito, número de festivais>`.
- Escala de cor quantizada entre `minCount` e `max(maxCount, 1)`. Sem festivais =
  cor clara; com festivais, a cor sobe com a contagem.
- Interações atuais:
  - `mouseenter`: após 50 ms muda o `fill` para a cor de hover; após 1000 ms mostra
    tooltip fixo junto ao rato com `Distrito:\nlista` ou `Distrito:\nsem festivais`.
  - `mousemove`: atualiza a posição do tooltip enquanto visível.
  - `mouseleave`: cancela timers, repõe `data-base-fill` e esconde o tooltip.
  - Os paths têm `cursor: pointer`.
- Não há clique nem seleção persistente no código atual. Não introduzir nova lógica.
- Legenda atual: apenas as etiquetas «Açores» e «Madeira» dentro do SVG.
- Estados: «A carregar mapa…» enquanto o GeoJSON não chega; erro
  «Erro ao carregar mapa: {mensagem}».
- O SVG tem `viewBox="0 0 900 750"`, `preserveAspectRatio="xMidYMid meet"`.
- O tooltip é `fixed`, `pointer-events-none`, `hidden` por defeito.

## 7. Arquivo por ano

Implementado em `App` + `YearSection` + `FestivalCard`; **não alterar**:

- Agrupamento: `yearOf(festival.date)`; `Map<ano, Festival[]>`.
- Dentro de cada ano, ordenação por `date` descendente (`localeCompare`).
- Anos ordenados descendente.
- Cabeçalho do ano: número do ano + contagem
  `{n} registo` / `{n} registos`.
- Cabeçalho do arquivo: `{n} festival` / `{n} festivais`.
- Cada entrada mostra, por esta ordem:
  - data em `DD/MM/AAAA` (`formatDatePT`);
  - localidade;
  - nome do festival;
  - tuna organizadora;
  - prémios (lista) ou «Sem prémios atribuídos»;
  - «Tunas a concurso» (só se houver);
  - «Extra concurso» (só se houver);
  - cartaz carregado ou `PosterPlaceholder` (fallback também em erro de imagem).
- Não existem filtros, pesquisa nem links externos no código atual.
- Editar/Eliminar só aparecem com handlers (autenticado).
- Eliminar usa `window.confirm` com o texto:
  `Eliminar "{nome}" ({tuna})? Esta ação não pode ser desfeita.`
- Durante a eliminação o botão fica desativado e mostra «A eliminar…».
- Não há paginação.

## 8. Contrato de markup usado por testes/lógica

Não existem `data-testid`. Os atributos e classes com significado atual são:

| Elemento | Atributo / texto |
| --- | --- |
| Login utilizador | `id="login-username"`, `autoComplete="username"`, `autoFocus` |
| Login palavra-passe | `id="login-password"`, `type="password"`, `autoComplete="current-password"` |
| Labels login | `htmlFor="login-username"`, `htmlFor="login-password"` |
| Botão submit login | `type="submit"`, texto «Entrar» / «A entrar…» |
| Botões de ação | `type="button"` (Entrar, Sair, Novo festival, Voltar, Cancelar, Fechar, Editar, Eliminar, Remover, Tentar novamente) |
| Editar cartão | `aria-label="Editar {nome}"` |
| Eliminar cartão | `aria-label="Eliminar {nome}"` |
| Fechar modal | `aria-label="Fechar"` |
| Remover chip | `aria-label="Remover {valor}"` |
| Imagem do cartaz | `alt="Cartaz de {nome}"` |
| Fallback do cartaz | classe `cartaz-fallback`, classe `hidden` quando há imagem |
| Mapa | `<svg>` + `<path data-name data-base-fill data-hover-fill>`; grupos `.mainland`, `.azores`, `.madeira`; tooltip `whitespace-pre-line` |
| Formulário festival | inputs sem `name`/`id`, labels sem `htmlFor` (associação implícita não existe); `type="date"`, `type="file"`, `accept="image/*"` |
| ChipListInput | input de rascunho; Enter ou vírgula adiciona; Backspace com rascunho vazio remove o último |
| Landmarks | `<header>`, `<main>`, `<footer>`, `<section>`; um `<h1>` no hero/login |

Regras: manter todos estes atributos, textos funcionais, ordem de tabulação e
tipos de botão. Melhorias puramente acessíveis (ex.: `role="alert"`/`aria-live`
em mensagens que antes não os tinham) são permitidas e não alteram a lógica.

## 9. Inventário de ecrãs e estados a reestilizar

1. **Arquivo público** — cabeçalho, hero, palmarés, mapa, arquivo por ano, rodapé.
2. **Login** — página inteira, painel lateral, formulário, estado vazio.
3. **Login com erro de validação** — «Preenche o utilizador e a palavra-passe.».
4. **Login com erro da API** — mensagem devolvida pelo serviço.
5. **Login em curso** — botão desativado «A entrar…» + indicador visual.
6. **Loading do arquivo** — 4 `SkeletonCard`.
7. **Erro de ligação** — «Erro de ligação», «Não foi possível carregar os festivais»,
   detalhe e «Tentar novamente».
8. **Arquivo vazio** — «Arquivo vazio», «Ainda não há festivais registados»,
   CTA «Entrar para adicionar» ou «Novo festival».
9. **Autenticado** — nome, «Novo festival», «Sair», editar/eliminar nos cartões.
10. **Modal novo festival** — todos os campos e estados.
11. **Modal editar festival** — pré-preenchido, botão «Guardar alterações».
12. **Modal em submissão** — «A guardar…», botão desativado.
13. **Modal com erro de validação** — mensagem de campos em falta.
14. **Modal com erro de submissão** — criar/editar falhou.
15. **Cartão em eliminação** — «A eliminar…», botão desativado.
16. **Mapa a carregar** — «A carregar mapa…».
17. **Mapa com erro** — «Erro ao carregar mapa: …».
18. **Cartaz em falta / erro de imagem** — placeholder «CARTAZ / ARQUIVO».

Todos estes estados recebem o novo sistema visual, sem alterar condições,
mensagens, handlers ou dados.
