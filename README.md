# Colab Web

Frontend da plataforma **Colab** — sistema de relatos urbanos para cidadãos e gestores públicos.

Construído com **Next.js 16**, **React 19**, **Tailwind CSS 4** e **shadcn/ui**.

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
