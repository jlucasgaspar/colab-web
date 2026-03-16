# Regras e Padrões do Projeto

Este documento define as convenções que **devem ser seguidas** ao gerar ou modificar código neste projeto.

---

## 1. Idioma

- **Toda a UI é em português brasileiro (pt-BR).** Textos de interface, mensagens de erro, labels, placeholders, toasts — tudo em pt-BR.
- **Código (nomes de variáveis, funções, tipos, componentes) é em inglês.** Exceção: constantes de domínio como `REPORT_STATUSES` usam valores em português (ex: `NA_FILA`, `CONCLUIDO`).
- Mensagens de validação Zod são em português.
- O HTML root tem `lang="pt-BR"`.

## 2. Framework e Roteamento

- **Next.js 16 com App Router.** Não usar Pages Router.
- **Route groups** com parênteses: `(auth)` para rotas públicas, `(dashboard)` para protegidas.
- Route groups não afetam a URL final.
- **Não há middleware.ts.** Proteção de rotas é 100% client-side.
- **Não há server actions.** Todas as chamadas são client-side via `api` client.
- **Não há API routes do Next.js.** O backend é externo.

## 3. Componentes

- **`'use client'`** é obrigatório em toda página/componente que usa hooks, state, ou interatividade. Neste projeto, todas as pages usam `'use client'`.
- **shadcn/ui** para primitivos de UI. Estilo: `base-nova`, cor base: `neutral`.
  - Componentes do shadcn ficam em `src/components/ui/` e **não devem ser editados manualmente**.
  - Para adicionar novos componentes shadcn, usar o CLI: `npx shadcn@latest add <component>`.
- **Componentes de feature** ficam organizados por domínio:
  - `src/components/layout/` — layout (Navbar)
  - `src/components/reports/` — relacionados a relatos
- **Export nomeado** para componentes de feature: `export function Navbar() { ... }`
- **Export default** apenas para pages: `export default function LoginPage() { ... }`

## 4. Estilização

- **Tailwind CSS 4** com CSS variables (oklch) para temas.
- Usar `cn()` (de `@/lib/utils`) para classes condicionais.
- **Não usar CSS inline (`style={{ }}`)** nem CSS modules. Tudo via Tailwind.
- Padrão de cores: usar tokens do tema (`text-primary`, `bg-muted`, `text-muted-foreground`, `text-destructive`, etc.) em vez de cores hardcoded.
- Exceção: badges de status/prioridade usam cores Tailwind diretamente (`bg-green-100 text-green-700`), definidas em `REPORT_STATUSES` e `PRIORITIES`.
- Tamanho padrão de ícones: `h-4 w-4`. Para textos menores: `h-3 w-3`.
- Container principal do dashboard: `max-w-5xl`, `px-4`, `py-8`.
- Loading spinner padrão: `<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />` ou `<Loader2 className="h-4 w-4 animate-spin" />` dentro de botões.
- Adicionar `cursor-pointer` em todos os `<Button>` e `<SelectTrigger>` clicáveis.

## 5. Validação e Formulários

- **Zod** para validação. Schemas ficam em `src/lib/validations.ts`.
- Usar `safeParse()` nos formulários. Exibir erro via `toast.error(result.error.issues[0].message)`.
- Formulários usam `onSubmit` no `<form>`, não em botão.
- Pattern de estado: campos controlados com `useState` individual ou `FormData` do evento.
- **Não usar react-hook-form.** Validação é manual com Zod.

## 6. Estado e Dados

- **React Context** apenas para autenticação (`AuthProvider`/`useAuth()`).
- **Sem state management library** (sem Zustand, Redux, etc.).
- Estado local com `useState` nas pages.
- Fetch de dados em `useEffect` com pattern `.then().catch().finally()`.
- **Não usar `useSWR`, `React Query`, ou similar.** Fetch direto via `api` client.

## 7. Cliente HTTP

- Usar `api` (importar de `@/lib/api`) para todas as chamadas.
- Métodos: `api.get<T>()`, `api.post<T>()`, `api.patch<T>()`.
- Token JWT é gerenciado automaticamente pelo `ApiClient` via `localStorage`.
- Para upload de imagem, enviar `FormData` (o `api.post` detecta e não seta `Content-Type`).

## 8. Tipos

- Tipos de domínio ficam em `src/lib/validations.ts` (junto com schemas Zod).
- Types auxiliares (como Web Speech API) ficam em `src/types/`.
- Usar `interface` para objetos e `type` para unions/aliases.
- Path alias: `@/*` mapeia para `./src/*`.

## 9. Toasts e Feedback

- Usar `toast` de `sonner` (importar direto: `import { toast } from 'sonner'`).
- `toast.success()` para ações bem-sucedidas.
- `toast.error()` para erros, com a mensagem do erro: `toast.error(err instanceof Error ? err.message : 'Mensagem padrão')`.
- Toaster está configurado com `richColors` e `position="top-right"`.

## 10. Hooks Customizados

- Hooks ficam em `src/hooks/`.
- Convenção de nome: `use-kebab-case.ts` para arquivo, `useHookName` para a função.
- Devem ter `'use client'` no topo.
- Retornar objeto com estado e funções: `{ state, action }`.

## 11. Imports

- Usar path alias `@/` para todos os imports internos.
- Ordem de imports (convenção natural, sem ferramenta de sort):
  1. React/Next.js
  2. Bibliotecas externas (sonner, lucide-react, zod)
  3. Componentes internos (`@/components/...`)
  4. Lib/hooks/types (`@/lib/...`, `@/hooks/...`)

## 12. Proteção de Rotas e Roles

- Dashboard layout (`(dashboard)/layout.tsx`) faz o guard principal: redireciona para `/login` se `!user`.
- Páginas admin fazem guard adicional: redireciona para `/reports` se `user.role !== 'ADMIN'`.
- Links de admin na Navbar são renderizados condicionalmente: `user.role === 'ADMIN'`.
- Enquanto `isLoading` é true, exibir spinner de loading (não conteúdo parcial).

## 13. Formatação de Dados

- Datas: `new Date(dateString).toLocaleDateString('pt-BR')`.
- Status e prioridade: usar as constantes `REPORT_STATUSES` e `PRIORITIES` para labels e cores.
- Campos que podem ser null (category, priority, technicalSummary, imageUrl) devem ter tratamento condicional.

## 14. Convenções de Arquivo

- **Pages:** `page.tsx` com export default, nomeadas como `NomeDescricaoPage`.
- **Layouts:** `layout.tsx` com export default, nomeadas como `NomeLayout`.
- **Componentes:** arquivo kebab-case (`status-badge.tsx`), export nomeado PascalCase (`StatusBadge`).
- **Hooks:** arquivo `use-kebab-case.ts`, export nomeado `useHookName`.
- **Lib:** arquivo kebab-case, exports nomeados.

## 15. Docker

- Dockerfile usa multi-stage build com Node 20 Alpine.
- Porta exposta: 3000.
- Comando de produção: `npm start`.

---

## Resumo Rápido para Novas Features

Ao criar uma nova feature:

1. Definir tipos/schemas em `src/lib/validations.ts`
2. Criar a page em `src/app/(dashboard)/` ou `src/app/(auth)/` com `'use client'`
3. Extrair componentes reutilizáveis para `src/components/<domínio>/`
4. Extrair lógica complexa para hooks em `src/hooks/`
5. Usar `api` client para chamadas HTTP
6. Validar com Zod + `safeParse`
7. Feedback com `toast.success()` / `toast.error()`
8. UI com componentes shadcn + Tailwind + ícones Lucide
9. Manter textos de interface em pt-BR
10. Testar loading states e empty states
