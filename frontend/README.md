# Festivais de Tunas — Cartaz & Palmarés

Frontend em React + TypeScript + Tailwind CSS para listar festivais de tunas por ano, com cartaz, prémios e tunas participantes — e um formulário para criar novos festivais.

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
- `POST   {VITE_API_BASE_URL}/festival` → cria um festival, corpo igual ao exemplo abaixo
- `PUT    {VITE_API_BASE_URL}/festival/:id` → atualiza um festival, mesmo corpo
- `DELETE {VITE_API_BASE_URL}/festival/:id` → elimina um festival

Cada cartão de festival mostra (ao passar o rato) um botão de editar (✎) e eliminar (🗑). Editar reutiliza o mesmo formulário do "Novo Festival", pré-preenchido. Eliminar pede confirmação antes de chamar o `DELETE`.

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

Um campo opcional `posterUrl` (string, URL da imagem do cartaz) é suportado mas não é obrigatório — sem ele, a app mostra um cartaz placeholder gerado a partir do nome da tuna.

## Estrutura

```
src/
  api/client.ts          fetch wrapper + chamadas GET/POST
  hooks/useFestivals.ts  carregamento, erro, refetch, criação
  components/            FestivalCard, YearSection, AddFestivalModal, ...
  utils/                 formatação de datas, cor do placeholder de cartaz
  types.ts               Festival, Premio, TunaRef, CreateFestivalInput
```

## Build de produção

```bash
npm run build
npm run preview
```
