## 1. Solución y proyectos nuevos

- [x] 1.1 Crear `api/api.sln` (`dotnet new sln -n api -o api`). Nota: el SDK instalado generó `api.slnx` (formato XML de solución, equivalente funcional al `.sln` clásico).
- [x] 1.2 Crear `api/Domain/Domain.csproj` como class library `net9.0` plana (`Microsoft.NET.Sdk`, `ImplicitUsings`/`Nullable` enable, sin `PackageReference`), namespace raíz `Domain`.
- [x] 1.3 Crear `api/Application/Application.csproj` igual que `Domain` (sin `PackageReference`), namespace raíz `Application`.
- [x] 1.4 Crear `api/Infrastructure/Infrastructure.csproj` igual que `Domain` (sin `PackageReference`), namespace raíz `Infrastructure`.
- [x] 1.5 Agregar los 4 proyectos a `api/api.slnx` (`dotnet sln add`).

## 2. Referencias entre proyectos

- [x] 2.1 `Application.csproj` → `ProjectReference` a `Domain.csproj`.
- [x] 2.2 `Infrastructure.csproj` → `ProjectReference` a `Domain.csproj`.
- [x] 2.3 Confirmar que `Domain.csproj` no tiene ningún `ProjectReference` ni `PackageReference`.

## 3. Mover el proyecto `Api`

- [x] 3.1 Crear `api/Api/Api.csproj` con el contenido exacto de `api/api.csproj` actual (mismo `TargetFramework`, `AzureFunctionsVersion`, `OutputType`, `ImplicitUsings`, `Nullable`, y los 6 `PackageReference` existentes).
- [x] 3.2 Mover `api/Program.cs` → `api/Api/Program.cs` (sin cambios de lógica todavía).
- [x] 3.3 Mover `api/ProfileFunction.cs` → `api/Api/ProfileFunction.cs`, actualizando su namespace de `api` a `Api`.
- [x] 3.4 Mover `api/host.json` → `api/Api/host.json`.
- [x] 3.5 Mover `api/local.settings.json` → `api/Api/local.settings.json` (si existe localmente; está gitignored, puede no estar trackeado).
- [x] 3.6 Mover `api/Properties/launchSettings.json` → `api/Api/Properties/launchSettings.json`.
- [x] 3.7 Eliminar `api/api.csproj` original (ya migrado a `api/Api/Api.csproj`).
- [x] 3.8 Agregar a `Api.csproj` los `ProjectReference` a `Application.csproj` e `Infrastructure.csproj`.
- [x] 3.9 Agregar `Api.csproj` a `api/api.slnx`.

## 4. Wiring de DI

- [x] 4.1 En `Application`, crear `ServiceCollectionExtensions.cs` con un método de extensión `AddApplication(this IServiceCollection services)` vacío (sin registros todavía, `return services;`). Nota: requirió agregar `PackageReference` a `Microsoft.Extensions.DependencyInjection.Abstractions` (pineado en `9.0.9` para alinear con `net9.0`), no contemplado en el design original que decía "sin PackageReference" para las 3 capas nuevas — necesario para que `IServiceCollection` compile.
- [x] 4.2 En `Infrastructure`, crear `ServiceCollectionExtensions.cs` con un método de extensión `AddInfrastructure(this IServiceCollection services)` vacío (mismo patrón, misma nota sobre el paquete).
- [x] 4.3 En `api/Api/Program.cs`, invocar `builder.Services.AddApplication();` y `builder.Services.AddInfrastructure();` antes de `builder.Build().Run();`.

## 5. Verificación

- [x] 5.1 `dotnet build api/api.slnx` compila sin errores ni warnings nuevos.
- [x] 5.2 **Blocker encontrado y resuelto** (con confirmación del usuario, fuera del alcance original de la propuesta): con `apiLocation`/`api_location` apuntando a `api` (carpeta con 4 `.csproj`), tanto `swa start` (Azure Functions Core Tools) como Oryx (deploy real vía `Azure/static-web-apps-deploy@v1`) fallan al detectar el proyecto de Functions — ambos escanean esa carpeta buscando un único proyecto + `host.json`. Fix aplicado: `swa-cli.config.json` (`apiLocation`) y `.github/workflows/azure-static-web-apps-icy-river-0fd990410.yml` (`api_location`) ahora apuntan a `api/Api` en vez de `api`. Las `ProjectReference` relativas (`../Domain`, `../Application`, `../Infrastructure`) siguen resolviendo bien porque el build no está sandboxeado a esa carpeta. Verificado con `swa build mi-cv` (publica solo `Api`, con sus referencias) y `swa start mi-cv` (el host de Functions arranca y expone `ProfileFunction` en `http://localhost:7071/api/ProfileFunction`, emulador SWA en `http://localhost:4280`).
- [x] 5.3 Confirmado: no quedan archivos sueltos en la raíz de `api/` salvo `api.slnx` y las 4 carpetas de proyecto (`bin/`/`obj/` del build viejo se regeneraron limpios durante la verificación).
