# Colab Web

Frontend da plataforma **Colab** — sistema de relatos urbanos para cidadãos e gestores públicos.

Construído com **Next.js 16**, **React 19**, **Tailwind CSS 4** e **shadcn/ui**.

## Arquitetura

O frontend é uma **SPA client-side pura** construída sobre o App Router do Next.js 16 — sem API routes, sem server actions e sem middleware. Toda a lógica de negócio e triagem por IA residem em uma API REST externa (`NEXT_PUBLIC_API_URL`), e o frontend atua como um thin client que consome esses endpoints através de um `ApiClient` singleton com injeção automática de token JWT via `localStorage`. A autenticação e proteção de rotas são inteiramente client-side: um `AuthProvider` (React Context) gerencia o estado do usuário, enquanto **route groups** do Next.js separam rotas públicas `(auth)` das protegidas `(dashboard)`, cujo layout faz o guard de acesso. A camada de UI utiliza componentes **shadcn/ui** (estilo base-nova) como primitivos, complementados por componentes de feature organizados por domínio (`layout/`, `reports/`). Validação de formulários é feita com **Zod** (sem react-hook-form), e o feedback ao usuário usa toasts via **Sonner**. O projeto também integra APIs do navegador — Web Speech API para entrada por voz e Geolocation + Nominatim para geocodificação reversa.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  (auth)     │  │ (dashboard)  │  │  Components   │  │
│  │  /login     │  │ /reports     │  │  shadcn/ui    │  │
│  │  /register  │  │ /reports/new │  │  + features   │  │
│  │             │  │ /admin       │  │               │  │
│  └──────┬──────┘  └──────┬───────┘  └───────────────┘  │
│         │                │                              │
│         ▼                ▼                              │
│  ┌────────────────────────────────┐  ┌──────────────┐  │
│  │  AuthProvider (React Context)  │  │  Hooks       │  │
│  │  login / register / logout     │  │  useVoice    │  │
│  │  JWT em localStorage           │  │  useGeo      │  │
│  └───────────────┬────────────────┘  └──────────────┘  │
│                  │                                      │
│                  ▼                                      │
│  ┌────────────────────────────────┐                     │
│  │  ApiClient (singleton)         │                     │
│  │  Bearer token automático       │                     │
│  │  GET / POST / PATCH            │                     │
│  └───────────────┬────────────────┘                     │
└──────────────────┼──────────────────────────────────────┘
                   │ HTTP
                   ▼
          ┌────────────────┐
          │  API Backend   │
          │  REST externa  │
          │  (porta 3001)  │
          │  + triagem IA  │
          └────────────────┘
```

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)
- A API backend rodando (por padrão em `http://localhost:3001`)

## Início rápido

```bash
# 1. Clone o repositório
git clone https://github.com/jlucasgaspar/colab-web.git
cd colab-web

# 2. Copie o arquivo de variáveis de ambiente
cp .env.example .env

# 3. (Opcional) Edite o .env se a API estiver em outro endereço
# NEXT_PUBLIC_API_URL=http://localhost:3001

# 4. Suba o container
docker compose up --build
```

A aplicação estará disponível em **http://localhost:3000**.

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `http://localhost:3001` |

## Desenvolvimento local (sem Docker)

```bash
# Instale as dependências
npm install

# Copie o .env
cp .env.example .env

# Rode o servidor de desenvolvimento
npm run dev
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint |

## Estrutura do projeto

```
src/
├── app/                # Rotas (App Router)
│   ├── (auth)/         # Login e registro
│   └── (dashboard)/    # Área logada (relatos, admin)
├── components/
│   ├── ui/             # Componentes shadcn/ui
│   ├── layout/         # Navbar
│   └── reports/        # Componentes de relatos
├── hooks/              # Hooks customizados
└── lib/                # API client, auth, validações, utilitários
```
