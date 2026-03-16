# Arquitetura do Projeto

## Estrutura de Diretórios

```
colab-web/
├── public/                          # Arquivos estáticos
├── docs/                            # Documentação do projeto
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout (AuthProvider, Toaster, fontes)
│   │   ├── page.tsx                 # Home — redireciona para /reports ou /login
│   │   ├── globals.css              # Tailwind + tema shadcn (CSS variables oklch)
│   │   │
│   │   ├── (auth)/                  # Route group — rotas públicas (sem layout próprio)
│   │   │   ├── login/page.tsx       # Página de login
│   │   │   └── register/page.tsx    # Página de cadastro
│   │   │
│   │   └── (dashboard)/             # Route group — rotas protegidas
│   │       ├── layout.tsx           # Auth guard + Navbar + container principal
│   │       ├── reports/
│   │       │   ├── page.tsx         # Minhas Solicitações (lista de relatos do usuário)
│   │       │   └── new/page.tsx     # Novo Relato (formulário de criação)
│   │       └── admin/
│   │           └── reports/page.tsx  # Painel Admin (tabela de todos os relatos)
│   │
│   ├── components/
│   │   ├── ui/                      # Primitivos shadcn/ui (Button, Card, Input, etc.)
│   │   ├── layout/
│   │   │   └── navbar.tsx           # Navbar principal (responsiva, com menu mobile)
│   │   └── reports/
│   │       ├── status-badge.tsx     # Badge colorido para status do relato
│   │       ├── priority-badge.tsx   # Badge colorido para prioridade
│   │       └── voice-input-button.tsx # Botão de entrada por voz
│   │
│   ├── lib/
│   │   ├── api.ts                   # Cliente HTTP (ApiClient) com Bearer token
│   │   ├── auth.tsx                 # AuthProvider + useAuth() hook
│   │   ├── utils.ts                 # cn() — clsx + tailwind-merge
│   │   └── validations.ts          # Schemas Zod, tipos e constantes
│   │
│   ├── hooks/
│   │   ├── use-voice-input.ts       # Hook para Web Speech API (pt-BR)
│   │   └── use-geolocation.ts       # Hook para geolocation + reverse geocoding
│   │
│   └── types/
│       └── speech.d.ts              # Type declarations para Web Speech API
│
├── package.json
├── tsconfig.json                    # TypeScript strict, path alias @/* → ./src/*
├── next.config.ts                   # Configuração Next.js (padrão)
├── postcss.config.mjs               # Tailwind via @tailwindcss/postcss
├── components.json                  # shadcn/ui config (base-nova, neutral, CSS vars)
├── eslint.config.mjs                # ESLint + Next.js
├── Dockerfile                       # Multi-stage build (Node 20 Alpine)
├── docker-compose.yml               # Container web na porta 3000
├── .env                             # Variáveis de ambiente locais
└── .env.example                     # Template: NEXT_PUBLIC_API_URL
```

## Hierarquia de Layouts

```
Root Layout (src/app/layout.tsx)
│  → html lang="pt-BR"
│  → Fontes: Geist Sans + Geist Mono
│  → AuthProvider (envolve toda a app)
│  → Toaster (Sonner, richColors, top-right)
│
├── / (page.tsx)
│   → Redirect: user ? /reports : /login
│
├── (auth)/ — SEM layout próprio
│   ├── /login
│   └── /register
│
└── (dashboard)/ (layout.tsx)
    → Auth guard: !user → redirect /login
    → Loading spinner enquanto isLoading
    → Navbar (sticky top, responsiva)
    → <main> com max-w-5xl px-4 py-8
    │
    ├── /reports
    ├── /reports/new
    └── /admin/reports
```

## Rotas e Proteção

| Rota | Acesso | Proteção |
|------|--------|----------|
| `/` | Público | Redirect automático |
| `/login` | Público | Nenhuma |
| `/register` | Público | Nenhuma |
| `/reports` | Autenticado | Dashboard layout guard |
| `/reports/new` | Autenticado | Dashboard layout guard |
| `/admin/reports` | Admin | Dashboard guard + role check (`user.role === 'ADMIN'`) |

**Importante:** não existe `middleware.ts`. Toda a proteção de rotas é **client-side** via `useAuth()` + `useEffect` + `router.replace()`.

## Fluxo de Autenticação

1. `AuthProvider` monta e verifica se existe `token` no `localStorage`
2. Se existe token → chama `GET /auth/me` para carregar o `User`
3. Se token inválido → remove do `localStorage`, user fica `null`
4. **Login:** `POST /auth/login` → salva `access_token` no `localStorage` → seta `user` → redirect `/reports`
5. **Register:** `POST /auth/register` → mesmo fluxo do login
6. **Logout:** remove `token` do `localStorage` → seta `user = null` → redirect `/login`

## Modelos de Dados

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
```

### Report

```typescript
interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string | null;
  category: string | null;       // Preenchido pela IA
  priority: Priority | null;     // Preenchido pela IA
  technicalSummary: string | null; // Preenchido pela IA
  status: ReportStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Enums

```typescript
type ReportStatus = 'NA_FILA' | 'EM_TRIAGEM' | 'EM_PROGRESSO' | 'CONCLUIDO' | 'NEGADO';
type Priority = 'BAIXA' | 'MEDIA' | 'ALTA';
```

## Schemas Zod (Validação Client-Side)

- `loginSchema`: email (válido) + password (min 6)
- `registerSchema`: name (min 2) + email (válido) + password (min 6)
- `reportSchema`: title (min 3) + description (min 10) + location (min 3) + imageUrl (opcional)

Todos os formulários usam `safeParse` e exibem erros via `toast.error()`.
