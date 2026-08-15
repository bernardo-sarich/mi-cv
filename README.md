# mi-cv

CV interactivo full-stack: SPA en React 19 + API en .NET 9 sobre Azure Functions, con Neon Postgres serverless como base de datos, todo desplegado como un único Azure Static Web App. Repo público, pensado tanto como sitio personal como como muestra de código para procesos de selección.

## Demo y stack

- **Frontend**: React 19 (JSX puro, sin TypeScript) + Vite 8 + Tailwind CSS v4 + framer-motion + i18next (es/en).
- **Backend**: Azure Functions, .NET 9 isolated worker, Clean/Hexagonal Architecture, EF Core 9 contra Neon Postgres (serverless, fuera de la red de Azure), notificación por email vía SMTP/MailKit, OpenTelemetry hacia Azure Monitor.
- **Infra**: Azure Static Web Apps (free tier) sirviendo el build de Vite y proxyeando `/api/*` a la Function App; CI/CD con GitHub Actions (`azure-static-web-apps-*.yml`) — cada push a `main` builda y despliega ambos proyectos.
- **Planificación**: [OpenSpec](https://github.com/Fission-AI/OpenSpec) para specs vivas y change proposals, en `openspec/`.

No hay test runner configurado en ninguno de los dos proyectos — es la principal deuda técnica pendiente (ver [Estado y deuda técnica](#estado-y-deuda-técnica)).

## Por qué existe este README

Esto no es solo "cómo correr el proyecto" — es la justificación de las decisiones de arquitectura y las veces que elegí la opción más compleja (o más simple) a propósito, y por qué. La parte "cómo correr esto" está en [Cómo correrlo localmente](#cómo-correrlo-localmente) y, con más detalle sobre el setup de la base de datos, en `api/README.md`.

## Decisiones de arquitectura

### 1. Clean/Hexagonal Architecture en el backend, para un CV

El backend tiene cinco proyectos — `Api` → `Application` → `Domain` → `Infrastructure`, más `Seed` como consola aparte — para un dominio que, en los hechos, es "leer un CV y guardar mensajes de contacto". Es objetivamente más estructura de la que ese dominio necesita.

La eligo a propósito, no por defecto: quería mostrar cómo organizo un backend cuando el dominio *sí* lo justifica (reglas de negocio no triviales, múltiples fuentes de datos, necesidad real de testear la lógica sin una base de datos), y este proyecto era la superficie disponible para demostrarlo sin exponer código de un empleador. La capa `Domain` no depende de nada hacia afuera; `Application` orquesta casos de uso (`GetCvUseCase`, `SubmitContactUseCase`) contra puertos (`Application/Ports/`) que `Infrastructure` implementa (EF Core, SMTP); `Api` es una traducción delgada de HTTP a casos de uso — cada `Function` delega y traduce excepciones de dominio (`ValidationException`, `RateLimitExceededException`) a `ProblemDetails`.

**Trade-off asumido**: más archivos e indirección de la que un CRUD de este tamaño pediría. Lo pagué a propósito por legibilidad y por dejar cada capa testeable de forma aislada (aunque los tests en sí todavía no existen — ver deuda técnica).

### 2. Azure Static Web Apps + Functions + Neon Postgres, todo en el tier gratuito

Elegí Azure SWA en vez de, por ejemplo, Vercel/Netlify + un backend separado, porque SWA integra en un solo recurso el hosting estático, el proxy a `/api/*`, y el ciclo de vida de una Function App — sin CORS real entre front y back (mismo origen desde la perspectiva del browser) y sin pagar por infraestructura mientras el proyecto no tenga tráfico.

**Consecuencia que tuve que diseñar alrededor**: las Functions en el plan Consumption tienen cold start. La primera visita de un dispositivo puede tardar varios segundos en traer el CV si la Function (y la base de datos serverless) estaban dormidas. Encaré esto en el cliente, no escalando infraestructura: un `LoadingScreen` con estética de terminal que se muestra solo si el fetch tarda más de 250ms (evita el flash en cargas ya calientes) — ver `openspec/specs/cv-loading-indicator/spec.md` y `client/src/App.jsx`. Es una solución de UX a un problema de infraestructura, elegida porque el costo cero pesaba más que eliminar el cold start con un plan pago.

**De Azure SQL a Neon Postgres, forzado por un incidente real.** La base arrancó en Azure SQL serverless (*free offer*, `autoPauseDelay=60`), con el mismo criterio de costo cero de arriba. En producción esa base tarda ~45s en resumir desde el auto-pausado, y ese tiempo excede el timeout duro de 45s que tiene la Function App en el plan gratuito de Static Web Apps: confirmé una request real que llegó con la base pausada y que SWA cortó en el mismo segundo en que la base terminaba de resumir, devolviendo `500 Backend call failure` en vez de datos. Subir `autoPauseDelay` o mantener la base despierta con un keep-alive hubiese agotado el presupuesto de cómputo gratuito de Azure SQL (100.000 vCore-segundos/mes, ≈55h de uptime) en un par de días. Neon Postgres también se auto-suspende en su free tier (a los 5 minutos de inactividad), pero resume en menos de un segundo (medido: 300ms–1.8s) — bien por debajo del techo de 45s, sin resignar el tier gratuito ni mover las lecturas fuera de la base al momento del request.

La migración cambió el proveedor de EF Core (`Npgsql.EntityFrameworkCore.PostgreSQL` en vez de `Microsoft.EntityFrameworkCore.SqlServer`), obligó a regenerar las migraciones desde cero (los tipos de columna de SQL Server no son portables a Postgres) y permitió reemplazar un retry custom de 40 intentos a 500ms fijo (dimensionado para los 45s de resume de Azure SQL) por el retry estándar de Npgsql, mucho más simple, ya que Neon resume en menos de un segundo. Como efecto colateral de quedar fuera de la red de Azure, la latencia de red pesa más: `EfCvRepository.GetCvAsync` pasó de cuatro consultas secuenciales a cuatro en paralelo (`IDbContextFactory<CvDbContext>` + `Task.WhenAll`, una por cada entidad del CV). El detalle completo — alternativas consideradas, riesgos asumidos, plan de rollback — quedó documentado en `openspec/changes/archive/2026-08-15-migrate-db-to-neon-postgres/`.

### 3. Modelo relacional con EF Core, no un JSON servido tal cual

El endpoint `GET /api/cv` podría haber sido, literalmente, "leer un archivo JSON y devolverlo" — de hecho el cliente tiene ese JSON como fallback (`client/src/data/cv-data.json`, usado si la API falla). Elegí en cambio un modelo relacional real: una tabla por tipo de entidad (`Profile`, `Experience`, `Project`, `SkillCategory`, `Stat`), migrada con EF Core, en vez de un blob de JSON en una columna.

**Por qué**: quería demostrar manejo de EF Core migrations, un repositorio por entidad, y una herramienta de seed (`Seed/`) que puebla la base desde el mismo JSON que el cliente usa como mock — separando "la forma en la que edito mi contenido" (un JSON a mano) de "la forma en la que se sirve" (filas relacionales, versionadas con migraciones). El `Seed` es deliberadamente destructivo por locale en cada corrida (borra e inserta de nuevo); es una herramienta de desarrollo, no algo que corra en producción.

**Trade-off asumido**: un JSON-blob hubiese sido más simple y, para este volumen de datos, igual de "correcto". La complejidad extra es una elección didáctica, no una necesidad del dominio.

## Otras decisiones que vale la pena mencionar

- **Rate limiting del formulario de contacto por IP**, con ventana configurable (`ContactRateLimit:MaxAttempts` / `:Window`, default 5 intentos / 15 min) contra una tabla propia (`ContactAttempt`), más un honeypot que descarta envíos de bots en silencio. Encontré y arreglé un bypass real: `GetClientIpAddress` confiaba en el primer hop de `X-Forwarded-For` (controlable por quien hace la request), permitiendo spoofear una IP distinta por request; ahora usa el último hop, el que agrega el edge de Azure y el llamador no puede falsificar.
- **Notificación por email best-effort**: tras persistir un mensaje de contacto, la API intenta notificar por SMTP (Gmail vía MailKit); si falla, el fallo solo se loguea — el visitante igual recibe `201 Created` y el mensaje queda guardado. La notificación es un extra, no una garantía que el flujo dependa de cumplir.
- **Colores como tokens explícitos, no la paleta default de Tailwind**: cada color themeado (`bg`, `surface`, `accent`, etc.) tiene su par `dark-` explícito en `tailwind.config.js`, en vez de depender de la clase `dark:` genérica de Tailwind sobre colores arbitrarios — hace que el sistema de diseño esté versionado y documentado (`openspec/specs/design-system/spec.md`) en vez de disperso en clases sueltas.
- **Caching de assets**: Azure SWA servía los archivos con hash de Vite (`/assets/*.js`, `.css`) con el mismo `Cache-Control` corto que `index.html`, forzando una revalidación en cada visita repetida pasados 30s. Le agregué un `Cache-Control` inmutable de larga duración específico para `/assets/*` en `staticwebapp.config.json`, ya que esos archivos cambian de nombre en cada build (son inmutables por diseño de Vite).

## Estado y deuda técnica

Voy a ser directo con esto porque prefiero que se note que sé dónde están los huecos, no que parezca que no los vi:

- **No hay test runner configurado**, ni en `client/` ni en `api/`. La arquitectura en capas del backend está pensada para ser testeable (puertos mockeables, `Domain` sin dependencias), pero los tests en sí todavía no están escritos.
- **No hay ambiente de staging** — el único ambiente es producción, desplegado en cada push a `main`.
- El contenido del CV (`client/src/data/cv-data.json`) es la fuente de verdad editorial; sincronizarlo con la base de datos requiere correr `Seed` a mano.

## Cómo correrlo localmente

```bash
# frontend (desde client/)
npm install
npm run dev              # servidor de Vite en :5173

# backend (desde api/) — ver api/README.md para el setup completo (DB local, migraciones, seed)
dotnet build
dotnet run --project Api

# full stack, desde la raíz (requiere la Azure Static Web Apps CLI)
swa start mi-cv
```

Sin una base de datos configurada, el cliente sigue funcionando: `getCVData` cae en silencio al JSON local (`client/src/data/cv-data.json`) si la API no responde.

## Sobre el proceso de desarrollo

Una parte del código de este repo se escribió con asistencia de [Claude Code](https://claude.com/claude-code) — lo uso como herramienta de productividad de la misma forma que usaría un linter o un pair programmer, revisando y decidiendo cada cambio, no delegando el criterio de diseño. Las decisiones de arquitectura y los trade-offs de este README son míos; el historial de commits de este repo (varios explican el *por qué*, no solo el *qué*) es el registro real de cómo se construyó.
