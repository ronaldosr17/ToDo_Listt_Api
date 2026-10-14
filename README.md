# ToDo List API

API REST de tareas hecha con **Node.js, Express 5 y Supabase (Postgres)**. Tiene arquitectura en capas (router, controller, service, repository), validación con **zod**, errores en JSON y autenticación con **JWT**. Cada usuario ve solo sus propias tareas.

## Requisitos

- Node.js 20.6 o superior (`node -v`)
- Un proyecto de Supabase

## Instalación

```bash
git clone https://github.com/ronaldosr17/ToDo_Listt_Api.git
cd ToDo_Listt_Api
npm install
```

## 1. Base de datos (Supabase)

En el **SQL Editor** de tu proyecto, ejecuta en este orden:

```sql
create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    password_hash text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.tasks (
    id bigint generated always as identity primary key,
    title text not null check (char_length(title) between 1 and 200),
    description text not null default '',
    done boolean not null default false,
    created_at timestamptz not null default now(),
    user_id uuid references public.users(id) on delete cascade
);

create index if not exists tasks_user_id_idx on public.tasks(user_id);

alter table public.users enable row level security;
alter table public.tasks enable row level security;

grant all on public.users to service_role;
grant all on public.tasks to service_role;
```

RLS queda activado sin políticas: las tablas solo son accesibles desde esta API con la secret key.

## 2. Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (3000 por defecto) |
| `SUPABASE_URL` | Project URL (Supabase → Settings → API) |
| `SUPABASE_SECRET_KEY` | Secret key `sb_secret_...` (Settings → API Keys). Nunca se sube a git |
| `JWT_SECRET` | Cadena aleatoria de 32 caracteres o más |
| `JWT_EXPIRES_IN` | Duración del token, por ejemplo `1h` |

Para generar un `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## 3. Arrancar

```bash
npm run dev     # con reinicio automático
npm start       # sin reinicio
```

Debe aparecer `Server is running on port 3000`.

## Endpoints

Base: `http://localhost:3000/api`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/health` | No | Estado del servidor |
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Obtener token JWT |
| GET | `/auth/me` | Sí | Usuario dueño del token |
| GET | `/tasks` | Sí | Listar mis tareas |
| GET | `/tasks/:id` | Sí | Ver una tarea |
| POST | `/tasks` | Sí | Crear tarea |
| PATCH | `/tasks/:id` | Sí | Editar tarea |
| DELETE | `/tasks/:id` | Sí | Borrar tarea |

Las rutas protegidas necesitan el header `Authorization: Bearer <token>`.

### Cuerpos de ejemplo

Registro y login:

```json
{ "email": "ana@test.com", "password": "supersecreta" }
```

Crear tarea (`description` y `done` son opcionales):

```json
{ "title": "Preparar la demo", "description": "Opcional", "done": false }
```

Editar tarea (al menos un campo):

```json
{ "done": true }
```

### Códigos de respuesta

- `200` OK, `201` creado, `204` borrado sin contenido
- `400` datos inválidos
- `401` token faltante, inválido o expirado, o credenciales incorrectas
- `404` tarea no encontrada (también si pertenece a otro usuario)
- `409` el email ya está registrado

## Probar en PowerShell

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/register -ContentType "application/json" -Body '{"email":"ana@test.com","password":"supersecreta"}'

$r = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login -ContentType "application/json" -Body '{"email":"ana@test.com","password":"supersecreta"}'
$token = $r.accessToken

Invoke-RestMethod -Uri http://localhost:3000/api/tasks -Headers @{ Authorization = "Bearer $token" }
```

Sin el token, `GET /api/tasks` responde `401`.

## Estructura

```
src/
├── config/env.js          variables validadas con zod
├── lib/                   cliente de Supabase y helper JWT
├── middlewares/           validate y auth
├── modules/
│   ├── auth/              registro, login, /me
│   ├── task/              CRUD de tareas
│   └── health/
├── Utils/httpError.js
├── app.js
├── routes.js
└── server.js
```

## Nota sobre la base de datos de demo

Si usas la base de datos del autor, las claves se entregan por un canal privado. Con una base propia solo hay que registrar un usuario, porque `ana@test.com` existe únicamente en la base del autor.