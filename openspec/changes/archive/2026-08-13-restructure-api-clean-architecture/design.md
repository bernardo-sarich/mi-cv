## Context

`api/` hoy es un único proyecto SDK-style (`api.csproj`) con `Program.cs`, `ProfileFunction.cs`, `host.json`, `local.settings.json` y `Properties/launchSettings.json` todos en la raíz de `api/`. Azure Static Web Apps (`swa-cli.config.json` y el workflow de GitHub Actions) apunta a la carpeta `api` completa como `apiLocation`/`api_location` y espera encontrar ahí el proyecto de Functions publicable. Ver `proposal.md` para la motivación.

## Goals / Non-Goals

**Goals:**
- Cuatro proyectos físicamente separados bajo `api/` con las referencias de dependencia descritas en la propuesta.
- El proyecto `Api` sigue siendo lo único que Azure SWA necesita para build/publish, sin cambiar `swa-cli.config.json` ni el workflow.
- El wiring de DI en `Api/Program.cs` queda en un estado real y extensible (no un comentario "TODO"), aunque `Application`/`Infrastructure` no tengan servicios concretos todavía.

**Non-Goals:**
- No se agregan entidades, casos de uso, ni implementaciones de infraestructura (eso es `backend-plan-tareas.md`, Tareas 2+).
- No se agrega ningún paquete NuGet nuevo a `Application`, `Domain` o `Infrastructure`.
- No se toca `swa-cli.config.json`, el workflow de GitHub Actions, ni `client/`.

## Decisions

**Layout de carpetas**: `api/Api/`, `api/Application/`, `api/Domain/`, `api/Infrastructure/`, cada una con su `.csproj` nombrado igual que la carpeta, más `api/api.sln` en la raíz de `api/` referenciando los 4. `host.json` y `local.settings.json` se mueven dentro de `api/Api/` (el host de Functions los busca junto al proyecto que arranca), junto con `Properties/launchSettings.json`. `ProfileFunction.cs` y `Program.cs` se mueven a `api/Api/` sin cambios de lógica.
- Alternativa descartada: dejar `host.json`/`local.settings.json` en la raíz de `api/`. Se descarta porque el host de Functions isolated worker los resuelve relativos al directorio de ejecución del proyecto `Api`, no de la carpeta contenedora.

**Namespaces**: cada proyecto usa su propio nombre como namespace raíz (`Api`, `Application`, `Domain`, `Infrastructure`), reemplazando el namespace `api` (minúscula) actual de `ProfileFunction.cs`. Es el default de `dotnet new` para el nombre de proyecto y evita namespaces vacíos en las 3 capas nuevas.

**Proyectos `Application`, `Domain`, `Infrastructure`**: SDK-style plano (`Microsoft.NET.Sdk`), `net9.0`, `ImplicitUsings`/`Nullable` enable, sin ningún `PackageReference`. Sin archivos `.cs` propios todavía (una class library vacía compila a un ensamblado vacío sin error) — quedan listos para las Tareas 2-4 del plan. `Infrastructure` referencia `Domain`; `Application` referencia `Domain`; `Domain` no referencia nada.
- Alternativa descartada: agregar una clase marcador vacía (`Class1.cs`) por proyecto nuevo. Se descarta por ser ruido sin propósito — un proyecto vacío es válido y más limpio que un placeholder que alguien tiene que acordarse de borrar.

**Proyecto `Api`**: conserva exactamente el contenido de `api.csproj` actual (mismo `TargetFramework`, `AzureFunctionsVersion`, `OutputType`, y los 6 `PackageReference` existentes), y agrega `ProjectReference` a `Application` e `Infrastructure`. Es el único proyecto con `AzureFunctionsVersion` — el marcador que Azure SWA/Oryx usa para localizar el proyecto de Functions a publicar dentro de `apiLocation`.

**DI wiring en `Api/Program.cs`**: se agregan dos métodos de extensión sobre `IServiceCollection` — `AddApplication()` en el proyecto `Application` (namespace `Application`, archivo `ServiceCollectionExtensions.cs`) y `AddInfrastructure()` en `Infrastructure` (mismo patrón) — cada uno vacío por ahora (sin `services.AddScoped<...>` porque no hay interfaces/implementaciones aún), y `Program.cs` los invoca: `builder.Services.AddApplication(); builder.Services.AddInfrastructure();`. Esto deja el punto de extensión real y descubrible para las Tareas 2-5, en vez de un comentario o un archivo vacío que alguien tiene que recordar crear.
- Alternativa descartada: no tocar `Program.cs` en este cambio y dejar el wiring para cuando existan servicios reales. Se descarta porque la propuesta pide explícitamente dejarlo "listo/preparado", y el patrón de extensión es el que van a usar las tareas siguientes sin volver a tocar `Program.cs` más que para agregar la línea de invocación.

**Solución (`api.sln`)**: generada con `dotnet new sln` + `dotnet sln add` para los 4 proyectos, no escrita a mano. No cambia cómo se buildea `Api` individualmente (`dotnet build`/`publish` sobre el `.csproj` sigue funcionando igual), solo facilita abrir la solución completa en un IDE.

## Risks / Trade-offs

- [Riesgo] Azure SWA/Oryx no encuentra el proyecto de Functions correcto ahora que `api/` tiene 4 `.csproj`. → Mitigación: `AzureFunctionsVersion` queda únicamente en `Api.csproj`, que es el marcador documentado que usa la detección de Oryx; los otros 3 proyectos son class libraries planas sin esa propiedad. Se valida corriendo `dotnet publish -c Release` desde `api/Api/` (el mismo comando que ejecuta `apiBuildCommand`/el workflow, adaptado a la nueva ruta si hace falta) como parte de las tareas.
- [Riesgo] `swa-cli.config.json` y el workflow no se tocan, pero ambos asumen implícitamente que hay un solo proyecto en `api/`. → Mitigación: mismo argumento que arriba — la detección es por proyecto marcado, no por "único `.csproj` en la carpeta". Si al verificar el build local esto no se sostiene, es un blocker a reportar antes de seguir (ver tasks.md).
- [Trade-off] Tres proyectos completamente vacíos de contenido de negocio por un tiempo (hasta las tareas siguientes del plan). Aceptado: es exactamente el alcance de este cambio (scaffolding), documentado como Non-Goal.
