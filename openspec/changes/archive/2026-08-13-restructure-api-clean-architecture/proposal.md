## Why

`api/` es hoy un único proyecto de Azure Functions con un solo trigger placeholder. El plan de backend ya definido (ver `backend-plan-tareas.md` en la raíz del repo) requiere separar responsabilidades en capas — Functions delgadas, casos de uso, entidades de dominio, e implementaciones de infraestructura (EF Core, etc.) — antes de agregar contenido real de negocio (Tareas 2 en adelante). Este cambio hace ese scaffolding primero, sin tocar comportamiento.

## What Changes

- Convertir `api/` de proyecto único a solución multi-proyecto (`api.sln`) con 4 proyectos: `Api`, `Application`, `Domain`, `Infrastructure`.
- Referencias entre proyectos: `Api` → `Application` + `Infrastructure`; `Application` → `Domain`; `Infrastructure` → `Domain`; `Domain` sin referencias.
- Mover `ProfileFunction.cs` y `Program.cs` (con todos los paquetes NuGet actuales: Functions Worker, OpenTelemetry, Azure Monitor Exporter) al proyecto `Api`.
- Configurar el wiring de DI en `Program.cs` de `Api` para registrar servicios de `Application` e `Infrastructure` (el wiring queda preparado; no hay servicios concretos que registrar todavía porque las tres capas nuevas quedan vacías de contenido de negocio en este cambio).
- Mantener `net9.0`, `AzureFunctionsVersion v4`, isolated worker.
- **Ajuste durante la implementación** (no contemplado en el plan original): `swa-cli.config.json` (`apiLocation`) y `.github/workflows/azure-static-web-apps-icy-river-0fd990410.yml` (`api_location`) sí se modificaron, de `"api"` a `"api/Api"`. La detección automática de Azure Functions Core Tools (`swa start` local) y de Oryx (deploy real) no se basa solo en la propiedad `AzureFunctionsVersion`: escanean la carpeta `apiLocation` buscando un único proyecto de Functions con su `host.json` al lado, y con 4 `.csproj` en `api/` esa detección falla (confirmado localmente con `swa start`, que no podía determinar el runtime). Apuntar `apiLocation` directamente a `api/Api` — el proyecto deployable — resuelve la detección; las `ProjectReference` a `../Domain`, `../Application`, `../Infrastructure` siguen resolviendo bien porque el build no está limitado a esa carpeta.

Comportamiento externo (el endpoint `ProfileFunction` y su respuesta) no cambia — es puro refactor estructural.

## Capabilities

Ninguna — este cambio es un refactor de estructura interna sin impacto en comportamiento observable por specs existentes. `skip_specs: true` está declarado en `.openspec.yaml`.

## Impact

- **Código afectado**: todo `api/` — se reemplaza `api.csproj` + archivos sueltos por `api.sln` + 4 subcarpetas de proyecto.
- **Config no afectada**: `swa-cli.config.json`, workflow de GitHub Actions (`.github/workflows/azure-static-web-apps-*.yml`) — ambos apuntan a la carpeta `api` como un todo y no necesitan cambios.
- **Dependencias**: los paquetes NuGet actuales (`Microsoft.Azure.Functions.Worker`, `Microsoft.Azure.Functions.Worker.OpenTelemetry`, `OpenTelemetry.Extensions.Hosting`, `Azure.Monitor.OpenTelemetry.Exporter`, `Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore`, `Microsoft.Azure.Functions.Worker.Sdk`) se mueven íntegros al proyecto `Api`; `Application`, `Domain`, `Infrastructure` no llevan paquetes en este cambio.
- **Habilita** el trabajo futuro ya planificado en `backend-plan-tareas.md` (Tareas 2-5: entidades de Domain, casos de uso de Application, adapters de Infrastructure, endpoints reales de Api).
