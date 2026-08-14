# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Reglas de comunicación

- **Escribir al usuario en español.** Todo lo prosa — explicaciones, resúmenes, preguntas, reportes de tareas — va en español. El código, los identificadores, los mensajes de commit y los artefactos de OpenSpec mantienen las convenciones del repo (inglés para código, español para contenido visible del sitio).
- **El usuario no viene de frontend.** En `client/` — React, Tailwind, el ecosistema de tooling de JS, convenciones web — no asumir familiaridad: nombrar la herramienta o el concepto antes de apoyarse en él, y preferir lenguaje llano sobre jerga. En trabajo de backend (`api/`, .NET, Azure Functions) está cómodo, ahí se puede ser breve y saltear las explicaciones.
- **Nunca pedirle al usuario que decida algo sin explicar las consecuencias de cada opción.** Una pregunta tipo "¿cambio esta config?" no sirve sola: hay que detallar qué cambia visiblemente, qué se rompe o no, y qué opción se recomienda y por qué. Si la respuesta no importa demasiado, no preguntar: elegir el default sensato y decir qué se eligió.

## Reglas de tooling

- **No llamar a Playwright / herramientas de browser salvo que el usuario lo pida explícitamente.** Verificar un cambio visualmente no es motivo para abrir un browser por cuenta propia — describir el cambio y dejar que el usuario lo mire.

## Qué es este repo

Proyecto de Azure Static Web Apps con dos builds independientes, conectadas por `swa-cli.config.json`:

- `client/` — SPA con Vite 8 + React 19 (JSX puro, sin TypeScript).
- `api/` — Azure Functions, .NET isolated worker (net9.0), con arquitectura en capas (Clean/Hexagonal).
- `openspec/` — artefactos de planificación spec-driven (specs vigentes en `openspec/specs/`, cambios propuestos/archivados en `openspec/changes/`).

No hay test runner configurado en ninguno de los dos proyectos — "correr los tests" no tiene destino.

## Comandos

```bash
# client (desde client/)
npm run dev            # servidor de Vite; swa-cli lo espera en :5173
npm run build           # build de producción a client/dist
npm run lint             # oxlint
npm run format           # prettier --write .
npm run format:check     # prettier --check . (para CI)
npm run preview          # sirve el build de producción localmente

# api (desde api/)
dotnet build
dotnet publish -c Release
dotnet run --project Api                                              # corre solo la Function App
dotnet ef database update --project Infrastructure --startup-project Infrastructure   # aplica migraciones
dotnet run --project Seed                                             # puebla la DB desde client/src/data/cv-data.json

# full stack, desde la raíz del repo (requiere la SWA CLI)
swa start mi-cv
```

Setup local de la Api (ver `api/README.md` para el detalle completo): copiar `Api/local.settings.json.example` a `Api/local.settings.json`, completar `ConnectionStrings:CvDatabase` con una base propia, aplicar migraciones y correr el seed. `local.settings.json` está en `.gitignore` y nunca debe llevar secretos reales el `.example`.

## Arquitectura del backend (`api/`)

Cinco proyectos en Clean/Hexagonal Architecture:

- **`Api`** — Azure Functions, delgado. `CvFunction.cs` expone `GET /api/cv`, `ContactFunction.cs` expone `POST /api/contact` (con CORS y honeypot). Ambas funciones delegan a un caso de uso y traducen sus excepciones (`ValidationException`, `RateLimitExceededException`) a `ProblemDetailsResult`.
- **`Application`** — casos de uso (`GetCvUseCase`, `SubmitContactUseCase`) que orquestan los puertos, más las opciones (`RateLimitOptions`, `EmailNotificationOptions`) y los puertos (`Ports/`) que Infrastructure implementa.
- **`Domain`** — entidades de negocio (`Profile`, `Experience`, `Project`, `SkillCategory`, `Stat`, `ContactMessage`, `ContactAttempt`, `CvContent`, `Language`), sin dependencias hacia afuera.
- **`Infrastructure`** — implementa los puertos: `Persistence/` (EF Core contra Azure SQL vía `CvDbContext`, un repositorio por entidad) y `Email/SmtpContactNotifier.cs` (notificación por SMTP/Gmail vía MailKit). Las migraciones EF viven en `Infrastructure/Migrations/`.
- **`Seed`** — consola standalone que lee `client/src/data/cv-data.json` y puebla `Profile`/`Stat`/`Experience`/`Project`/`SkillCategory` por locale. Es destructivo por locale en cada corrida (borra e inserta de nuevo) — apuntarlo siempre a una base local/dev.

**Modelo de datos**: relacional, no JSON-blob — una tabla por tipo de entidad, cada una migrada con EF Core.

**Contacto**: `POST /api/contact` valida (`name`/`email`/`message`), aplica un rate limit por IP (`ContactAttemptStore`/`ContactAttemptEntity`, ventana configurable vía `ContactRateLimit:*`) y descarta en silencio los envíos con honeypot no vacío. Tras persistir el mensaje, intenta mandar un email de notificación al dueño del sitio (best-effort: si falla, solo se loguea, la respuesta sigue siendo `201`). La contraseña de aplicación de Gmail (`EmailNotification:AppPassword`) es el único secreto real del proyecto — nunca va en `local.settings.json.example`, se inyecta como variable de entorno (`EmailNotification__AppPassword` en el Function App desplegado).

La connection string (`ConnectionStrings:CvDatabase`) sigue la misma convención: nunca en el repo, se inyecta vía configuración/variables de entorno (`ConnectionStrings__CvDatabase` en el Function App desplegado).

## Arquitectura del cliente (`client/`)

**Composición.** `App.jsx` renderiza las secciones en orden fijo dentro de `AppProvider`. Los ids de sección (`sobre-mi`, `experience`, `stack`, `projects`, `contacto`) son un contrato con `Nav.jsx` (lista `SECTIONS`) y con `openspec/specs/site-layout` — cambiar uno implica actualizar los otros dos.

**Datos del CV.** `context/AppContext.jsx` expone `useCVData()`, que dispara `lib/api.js#getCVData(lang)` cada vez que cambia el idioma. Esa función pega a `${VITE_API_BASE_URL || '/api'}/cv?lang=...` y, si falla (red caída, API abajo), cae en silencio al JSON local `data/cv-data.json` como mock. Todas las secciones (`Hero`, `Experience`, `Skills`, `Projects`) leen del hook, no de constantes hardcodeadas — el único contenido que sigue fijo en el cliente son los links de contacto (`data/contact-info.js`), que no tienen tabla en la DB.

**Loading de primera visita.** `App.jsx` solo muestra `LoadingScreen` (estética terminal) cuando `useCVData().loading` es `true` **y** es la primera vez que ese navegador visita el sitio (flag en `localStorage`, ver `cv-loading-indicator` spec) — cubre el cold start de Azure + la descarga de assets sin cachear que solo ocurre en esa primera carga por dispositivo; en visitas repetidas no se muestra.

**Theme y language** viven en `context/AppContext.jsx`, expuestos solo vía `useTheme()` / `useLang()`. El theme alterna la clase `dark` en `<html>`; el language llama a `i18n.changeLanguage`. Ambos arrancan en dark/es y no persisten entre sesiones.

**Colores como tokens explícitos, no la paleta de Tailwind.** `tailwind.config.js` define tokens planos (`bg`, `surface`, `border`, `text`, `textDim`, `accent`, `accentDim`, `onAccent`, `navBg`) más su gemelo con prefijo `dark-`. Todo elemento themeado debe declarar ambos: `bg-surface dark:bg-dark-surface`. Los valores están fijados en `openspec/specs/design-system/spec.md`.

**Tailwind v4 con config partida**: `src/styles/tailwind.css` hace `@import 'tailwindcss'` + `@config '../../tailwind.config.js'`, y también contiene los estilos base de `body` y los keyframes/clases `animate-*`.

**Trampa de cascade layers en `src/index.css`.** Es CSS remanente del template de Vite, importado *antes* de `tailwind.css` en `main.jsx`, y no está en ningún `@layer` — Tailwind v4 emite todo dentro de `@layer`, y las reglas sin layer le ganan a cualquier layer sin importar especificidad ni orden. No agregar selectores de elemento ahí; preferir clases utility o un componente en `components/ui/`. Sus variables `:root` (`--accent: #aa3bff`, etc.) son paleta muerta del template, no relacionada con el verde del sitio — nunca leer colores de tema desde ahí.

**`MatrixRain`** pinta dos canvases en los márgenes del viewport a los costados de la columna central, solo por encima de 1280px y con reduced-motion apagado. Duplica a propósito dos valores — el ancho de `#root` de `index.css` y el hex del accent de `tailwind.config.js` — con comentarios que lo explican; cambiarlos juntos.

**Animación** es framer-motion más dos hooks de IntersectionObserver: `useScrollReveal` (dispara una vez y se desconecta) y `useScrollProgress` (mueve el riel de la timeline de Experience).

**i18n** vía `locales/{es,en}.json` + `useTranslation()`. La UI de navegación y los títulos de sección usan `t()`.

**UI reutilizable** en `components/ui/` (`Button`, `Badge`, `Card`, `SectionLabel`, `SectionTitle`, toggles, `LoadingScreen`). Reciben `className` y spread de `...rest`, sin lógica de negocio.

## Flujo de OpenSpec

`openspec/specs/<capability>/spec.md` tiene los requirements vigentes; el trabajo propuesto va a `openspec/changes/<name>/` (proposal, design, specs delta, tasks) y pasa a `openspec/changes/archive/` una vez aplicado. Usar las skills `/opsx:*` para ese flujo — `propose` es solo planificación y no debe tocar código del proyecto en el mismo turno. Cuando un cambio altera comportamiento que las specs describen, actualizar la spec correspondiente bajo `openspec/specs/` en vez de dejarla desactualizada.
