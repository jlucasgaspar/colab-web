# API e Comunicação com Backend

## Visão Geral

O frontend **não possui API routes do Next.js**. Toda a comunicação é feita via um cliente HTTP customizado (`src/lib/api.ts`) que faz chamadas para uma API REST externa.

## Variável de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Se não definida, o fallback é `http://localhost:3001`.

## Cliente HTTP — `ApiClient`

Localizado em `src/lib/api.ts`. É uma classe singleton exportada como `api`.

### Funcionalidades

- **Token automático:** lê `localStorage.getItem('token')` e adiciona header `Authorization: Bearer <token>` em todas as requisições
- **Content-Type automático:** `application/json` por padrão; omitido quando o body é `FormData` (upload de imagem)
- **Tratamento de erros:** se `!res.ok`, faz parse do JSON do erro e lança `Error` com a mensagem

### Métodos

```typescript
api.get<T>(path: string): Promise<T>
api.post<T>(path: string, body?: unknown): Promise<T>
api.patch<T>(path: string, body?: unknown): Promise<T>
```

- `post` aceita tanto JSON (serializado com `JSON.stringify`) quanto `FormData` (enviado direto)
- `patch` sempre serializa o body como JSON

## Endpoints Utilizados

### Autenticação

| Endpoint | Método | Body | Resposta | Usado em |
|----------|--------|------|----------|----------|
| `/auth/login` | POST | `{ email, password }` | `{ access_token, user }` | `AuthProvider.login()` |
| `/auth/register` | POST | `{ name, email, password }` | `{ access_token, user }` | `AuthProvider.register()` |
| `/auth/me` | GET | — | `User` | `AuthProvider.loadUser()` |

### Relatos

| Endpoint | Método | Body | Resposta | Usado em |
|----------|--------|------|----------|----------|
| `/reports/my` | GET | — | `Report[]` | `MyReportsPage` |
| `/reports` | GET | — | `Report[]` | `AdminReportsPage` |
| `/reports` | POST | `{ title, description, location, imageUrl? }` | `Report` | `NewReportPage` |
| `/reports/:id/status` | PATCH | `{ status }` | `Report` | `AdminReportsPage` |

### Upload

| Endpoint | Método | Body | Resposta | Usado em |
|----------|--------|------|----------|----------|
| `/upload/image` | POST | `FormData` (campo `file`) | `{ url }` | `NewReportPage` |

## Padrão de Uso nas Páginas

Todas as páginas seguem o mesmo padrão de chamada:

```typescript
// Fetch em useEffect
useEffect(() => {
  api
    .get<Report[]>('/reports/my')
    .then(setReports)
    .catch((err) => toast.error(err.message))
    .finally(() => setLoading(false));
}, []);

// Submit de formulário
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const result = schema.safeParse(data);
  if (!result.success) {
    toast.error(result.error.issues[0].message);
    return;
  }
  setLoading(true);
  try {
    await api.post('/endpoint', result.data);
    toast.success('Mensagem de sucesso');
    router.push('/redirect');
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Mensagem padrão');
  } finally {
    setLoading(false);
  }
}
```

## Serviços Externos

| Serviço | URL | Uso |
|---------|-----|-----|
| Nominatim (OpenStreetMap) | `https://nominatim.openstreetmap.org/reverse` | Reverse geocoding no hook `useGeolocation` |
