# Colab.ia — Visão Geral do Projeto

## O que é

**Colab.ia** (Zeladoria Inteligente) é uma aplicação web de relatos urbanos onde cidadãos podem reportar problemas da cidade (buracos, iluminação, lixo, etc.) e acompanhar a resolução. A triagem dos relatos é feita automaticamente por IA no backend (categoria, prioridade, resumo técnico).

## Público-alvo

- **Cidadãos (USER):** criam relatos, acompanham status.
- **Administradores (ADMIN):** gerenciam todos os relatos, alteram status.

## Funcionalidades

### Cidadão

- Criar relatos com título, descrição, localização e foto opcional
- Entrada por voz (Web Speech API pt-BR) para preenchimento rápido
- Geolocalização automática com reverse geocoding (Nominatim/OpenStreetMap)
- Acompanhar status dos seus relatos (Na Fila → Em Triagem → Em Progresso → Concluído/Negado)
- Visualizar categoria, prioridade e resumo técnico gerados pela IA

### Administrador

- Visualizar todos os relatos em tabela
- Alterar status de qualquer relato via dropdown

## Tech Stack

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Component Library | shadcn/ui (style: base-nova) | 4.0.6 |
| Base Components | @base-ui/react | 1.3.0 |
| Ícones | Lucide React | 0.577.0 |
| Estilização | Tailwind CSS | 4.x |
| Animações CSS | tw-animate-css | 1.4.0 |
| Validação | Zod | 4.3.6 |
| Toasts | Sonner | 2.0.7 |
| Utilitários CSS | clsx + tailwind-merge | - |
| Runtime | Node.js | 20 (Alpine) |
| Deploy | Docker + docker-compose | - |

## Idioma

Toda a interface é em **português brasileiro (pt-BR)** hardcoded. Não há setup de i18n.

## Backend

O frontend **não possui API routes**. Todas as chamadas vão para uma API REST externa configurada via `NEXT_PUBLIC_API_URL` (padrão: `http://localhost:3001`).

## Testes

O projeto não possui testes configurados atualmente.
