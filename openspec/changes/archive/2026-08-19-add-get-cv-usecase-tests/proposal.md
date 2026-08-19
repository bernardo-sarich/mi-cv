## Why

`GetCvUseCase` (api/Application/UseCases/GetCvUseCase.cs) orquesta las cuatro lecturas paralelas (`Task.WhenAll`) que arman el `CvContent` servido por `GET /api/cv`, sin ningún test automatizado que respalde ese fan-out ni la propagación de errores de los puertos. `SubmitContactUseCase` ya tiene su suite (`api/Application.Tests/UseCases/SubmitContactUseCaseTests.cs`); este cambio extiende esa misma cobertura al otro caso de uso de `Application`.

## What Changes

- Agregar `api/Application.Tests/UseCases/GetCvUseCaseTests.cs`, cubriendo con `[Fact]` independientes:
  - Camino feliz: los cuatro repositorios mockeados devuelven valores de `Domain` conocidos y `ExecuteAsync` arma un `CvContent` con `Language`/`Profile`/`Experience`/`Projects`/`Skills` iguales a esos valores.
  - Verificación de invocación: los cuatro repositorios son invocados exactamente una vez, cada uno con el mismo `Language` recibido por `ExecuteAsync`.
  - Propagación de errores: una excepción lanzada por uno de los puertos (`IProjectRepository.GetProjectsAsync`) se propaga sin capturar — a diferencia de `SubmitContactUseCase`, `GetCvUseCase` no tiene manejo best-effort.
- No se modifica `GetCvUseCase` ni ningún otro código de producción.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

_Ninguna._ Este cambio no altera comportamiento observable del sistema — agrega cobertura de tests sobre lógica ya existente. Ver `skip_specs: true` en `.openspec.yaml`.

## Impact

- **Código afectado**: `api/Application.Tests/UseCases/GetCvUseCaseTests.cs` (nuevo).
- **Dependencias**: ninguna nueva — el proyecto `Application.Tests` ya referencia `xunit`, `xunit.runner.visualstudio`, `NSubstitute`, `coverlet.collector` y `Microsoft.NET.Test.Sdk`.
- **Sin impacto** en `Api`, `Domain`, `Infrastructure`, `Seed`, ni en el cliente.
