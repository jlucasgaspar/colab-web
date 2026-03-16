# Componentes, Hooks e UI

## Componentes de UI (shadcn/ui)

Localizados em `src/components/ui/`. São primitivos do shadcn/ui v4 com estilo **base-nova**, cor base **neutral** e CSS variables.

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Button | `button.tsx` | Botão com variantes: default, destructive, outline, secondary, ghost, link. Tamanhos: default, sm, lg, icon |
| Card | `card.tsx` | Card com CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction |
| Input | `input.tsx` | Input de texto |
| Textarea | `textarea.tsx` | Área de texto |
| Label | `label.tsx` | Label para formulários |
| Badge | `badge.tsx` | Badge com variantes: default, secondary, destructive, outline |
| Select | `select.tsx` | Select dropdown (SelectTrigger, SelectContent, SelectItem, SelectValue) |
| Table | `table.tsx` | Tabela (Table, TableHeader, TableBody, TableRow, TableHead, TableCell) |
| Dialog | `dialog.tsx` | Modal dialog |
| DropdownMenu | `dropdown-menu.tsx` | Menu dropdown |
| Avatar | `avatar.tsx` | Avatar com imagem e fallback |
| Separator | `separator.tsx` | Separador horizontal/vertical |
| Skeleton | `skeleton.tsx` | Loading skeleton |
| Sonner | `sonner.tsx` | Wrapper do Sonner para toasts |

**Regra:** componentes em `ui/` são gerados pelo shadcn CLI. Não devem ser editados manualmente (exceto ajustes mínimos).

## Componentes de Feature

### Navbar (`src/components/layout/navbar.tsx`)

- Header sticky com backdrop blur
- Logo "Colab.ia" linkando para `/reports`
- Links de navegação: Minhas Solicitações, Novo Relato, Painel Admin (condicional: `user.role === 'ADMIN'`)
- Nome do usuário e botão Sair
- Menu mobile com hamburger (toggle `mobileOpen`)
- Usa `usePathname()` para highlight do link ativo (`variant="secondary"` vs `"ghost"`)

### StatusBadge (`src/components/reports/status-badge.tsx`)

- Recebe `status: ReportStatus`
- Renderiza `Badge` com cor mapeada de `REPORT_STATUSES` (validations.ts)
- Cores: cinza (Na Fila), amarelo (Em Triagem), azul (Em Progresso), verde (Concluído), vermelho (Negado)

### PriorityBadge (`src/components/reports/priority-badge.tsx`)

- Recebe `priority: Priority | null`
- Retorna `null` se `priority` for null
- Renderiza `Badge` com cor mapeada de `PRIORITIES` (validations.ts)
- Cores: verde (Baixa), amarelo (Média), vermelho (Alta)

### VoiceInputButton (`src/components/reports/voice-input-button.tsx`)

- Recebe `onResult: (text: string) => void`
- Usa hook `useVoiceInput` internamente
- Renderiza ícone `Mic` (parado) ou `MicOff` vermelho (gravando)
- Retorna `null` se Web Speech API não for suportada pelo browser

## Hooks Customizados

### `useVoiceInput` (`src/hooks/use-voice-input.ts`)

- **Input:** `onResult: (text: string) => void`
- **Output:** `{ isListening, isSupported, startListening, stopListening }`
- Usa `SpeechRecognition` (ou `webkitSpeechRecognition`) com `lang = 'pt-BR'`
- Modo não contínuo, sem resultados parciais
- Types definidos em `src/types/speech.d.ts`

### `useGeolocation` (`src/hooks/use-geolocation.ts`)

- **Output:** `{ loading, error, address, getLocation }`
- `getLocation()` retorna `Promise<string | null>`
- Usa `navigator.geolocation.getCurrentPosition` com alta precisão (timeout 10s)
- Faz reverse geocoding via Nominatim: `https://nominatim.openstreetmap.org/reverse`
- Retorna `display_name` ou `lat, lon` como fallback

### `useAuth` (`src/lib/auth.tsx`)

- **Output:** `{ user, isLoading, login, register, logout }`
- Deve ser usado dentro de `AuthProvider`
- Lança erro se usado fora do provider

## Utilitários

### `cn()` (`src/lib/utils.ts`)

- Combina `clsx` + `twMerge` para classes CSS condicionais
- Uso: `cn('base-class', condition && 'conditional-class', className)`

### Validations (`src/lib/validations.ts`)

- Schemas Zod: `loginSchema`, `registerSchema`, `reportSchema`
- Types inferidos: `LoginInput`, `RegisterInput`, `ReportInput`
- Constantes com label e cor: `REPORT_STATUSES`, `PRIORITIES`
- Interfaces: `User`, `Report`
- Enums como types: `ReportStatus`, `Priority`

## Ícones

O projeto usa **Lucide React** (`lucide-react`). Ícones são importados individualmente:

```typescript
import { PlusCircle, MapPin, Calendar, Loader2, Camera, Mic, MicOff, ... } from 'lucide-react';
```

Tamanho padrão usado: `h-4 w-4` (com `h-3 w-3` para ícones menores em textos).
