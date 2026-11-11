# Festivais de Tunas — Cartaz & Palmarés

Frontend em React + TypeScript + Tailwind CSS para listar festivais de tunas por ano, com cartaz, prémios e tunas participantes — e um formulário para criar novos festivais.

## Direção de arte

A interface segue uma estética de **cartaz de papel kraft pintado à mão**: papel texturado,
manchas de aguarela, tinta preta, fita de pintura e cartões tipo polaroid.

### Cores

Definidas em `src/styles/tokens.css` e expostas ao Tailwind em `src/index.css`:

| Token | Valor | Uso |
| --- | --- | --- |
| `--paper` | `#D9CBA2` | fundo de papel |
| `--paper-light` | `#E6DBB8` | cartões e superfícies |
| `--ink` | `#111111` | texto principal e tinta |
| `--green` | `#3F7D5B` | aguarela e acentos |
| `--ochre` | `#E2A94A` | aguarela e destaques |
| `--blue` | `#5B93CE` | aguarela e hover do mapa |
| `--gold` | `#D4A90A` | foco e pormenores |
| `--navy` | `#061A5C` | títulos e etiquetas escuras |
| `--deep-green` | `#0B5A12` | etiquetas verdes |

### Tipografia

- **Permanent Marker** — títulos display e números manuscritos.
- **Fraunces** — títulos de secção e nomes.
- **Newsreader** — corpo de texto, etiquetas, botões e campos.

As fontes são carregadas do Google Fonts com `display=swap` em `index.html`.
Os campos usam pelo menos `16px` para evitar zoom automático em iOS.

### Componentes de interface

Presentes em `src/components/ui/` e apenas visuais — não guardam estado nem alteram
handlers, dados ou autenticação:

`PaperBackground`, `SvgDefs`, `Watercolor`, `BrushStripes`, `ArchFrame`,
`PolaroidCard`, `Button`, `InkDivider`, `Field` e `Reveal`.

### Responsividade e acessibilidade

- Abordagem mobile-first, verificada a 360 px, 768 px e 1280 px sem overflow horizontal.
- Contraste AA para texto e controlos; foco visível em botões e campos.
- `prefers-reduced-motion` desativa as animações de entrada.
- Mensagens de erro usam `role="alert"` e `aria-live`; formulários têm `label`/`id` associados.
- Todos os `data-testid`, `aria-*`, `id` e `role` funcionais foram preservados.

### Imagens

- `public/logo-instituna.png` — brasão oficial usado no cabeçalho, login e rodapé.
- `public/apple-touch-icon.png` — ícone de instalação iOS.
- `public/favicon.png` — favicon gerado a partir do brasão.
- `public/fitumis-capa.png` — imagem Open Graph/Twitter (1200 × 630).

## Arrancar

```bash
npm install
cp .env.example .env.local   # e ajusta VITE_API_BASE_URL para o teu backend
npm run dev
```

## Configurar a API

O URL base é lido de `VITE_API_BASE_URL` (ver `.env.example`). Por omissão aponta para `http://localhost:4000`.

A app espera as seguintes rotas:

- `GET    {VITE_API_BASE_URL}/festival` → `Festival[]`
- `GET    {VITE_API_BASE_URL}/festival/:id` → `Festival` (disponível no client, não usada na listagem)
- `POST   {VITE_API_BASE_URL}/auth/login` → troca credenciais por um token JWT
- `GET    {VITE_API_BASE_URL}/auth/me` → valida o token e devolve o utilizador
- `POST   {VITE_API_BASE_URL}/festival` → cria um festival (requer autenticação)
- `PUT    {VITE_API_BASE_URL}/festival/:id` → atualiza um festival (requer autenticação)
- `DELETE {VITE_API_BASE_URL}/festival/:id` → elimina um festival (requer autenticação)

## Autenticação

A listagem é pública. O botão **Entrar** abre a página de login; após autenticar,
o token é guardado em `localStorage` e enviado como `Authorization: Bearer <token>`
nos pedidos de escrita. Só com sessão iniciada aparecem o botão **Novo festival**
e os controlos **Editar** e **Eliminar** em cada cartão.

Cada cartão de festival mostra (ao passar o rato ou ao receber foco) os botões
**Editar** e **Eliminar**. Editar reutiliza o mesmo formulário do **Novo festival**,
pré-preenchido. Eliminar pede confirmação antes de chamar o `DELETE`.

```json
{
  "name": "XIII Viriatus",
  "tuna": { "name": "Viriatuna" },
  "location": "Viseu",
  "date": "2026-04-18",
  "premios": [
    { "name": "Melhor Original" },
    { "name": "Melhor Passacalles" },
    { "name": "Tuna Mais Tuna" }
  ],
  "tunasConcurso": [
    { "name": "Instituna" },
    { "name": "Vitistuna" },
    { "name": "K&Batuna" },
    { "name": "Tuna Económicas" }
  ],
  "tunasExtra": [
    { "name": "Estudantina Académica de Lamego" },
    { "name": "Grupo 6 Cordas APPACDM" }
  ]
}
```

`premios` e `tunasExtra` podem vir vazios ou omitidos — a app trata isso automaticamente (mostra "Sem prémios atribuídos" quando não há prémios, e esconde a secção de tunas extra quando não há nenhuma).

Um campo opcional `cartazUrl` (string, URL da imagem do cartaz) é suportado mas não é obrigatório — sem ele, a app mostra um cartaz placeholder gerado a partir do nome da tuna.

## Estrutura

```
src/
  api/client.ts          fetch wrapper, autenticação e chamadas à API
  auth/token.ts          persistência do token JWT em localStorage
  hooks/useFestivals.ts  carregamento, erro, refetch, criação
  hooks/useAuth.ts       sessão, login e logout
  hooks/useInView.ts     revelação de elementos ao entrar no viewport
  components/            LoginPage, FestivalCard, YearSection, ...
  components/ui/         primitivas visuais (papel, aguarela, botões, campos)
  styles/tokens.css      tokens de cor e tipografia
  index.css              estilos globais e classes dos componentes
  utils/                 formatação de datas, cor do placeholder de cartaz
  types.ts               Festival, Premio, TunaRef, CreateFestivalInput
```

## Build de produção

```bash
npm run build
npm run preview
```
