## Why

`SubmitContactUseCase` (api/Application/UseCases/SubmitContactUseCase.cs) concentra toda la lógica de negocio del formulario de contacto — validación de campos, honeypot anti-spam, rate limiting por IP y notificación por email best-effort — sin ningún test automatizado que la respalde. Los cinco proyectos de `api/` no tienen cobertura de tests; esta es la primera suite y cubre el caso de uso con más ramas de lógica y más riesgo de regresión silenciosa.

## What Changes

- Reemplazar el placeholder `UnitTest1.cs` del proyecto `api/Application.Tests` (ya scaffoldeado con xUnit + NSubstitute) por `UseCases/SubmitContactUseCaseTests.cs`.
- Cubrir con `[Fact]`/`[Theory]` independientes: honeypot, validación de cada campo (vacío/whitespace, límites de longitud, formato de email), acumulación de múltiples errores en una sola `ValidationException`, rate limiting, camino feliz (trim de campos, orden de llamadas a los puertos) y que una falla de `IContactNotifier.NotifyAsync` no se propague (best-effort).
- No se modifica `SubmitContactUseCase` ni ningún otro código de producción.

## Capabilities

### New Capabilities

_Ninguna._ Este cambio no introduce ni modifica comportamiento observable del sistema — agrega cobertura de tests sobre lógica ya existente. Ver `skip_specs: true` en `.openspec.yaml`.

### Modified Capabilities

_Ninguna._

## Impact

- **Código afectado**: `api/Application.Tests/UseCases/SubmitContactUseCaseTests.cs` (nuevo), `api/Application.Tests/UnitTest1.cs` (eliminado).
- **Dependencias**: ninguna nueva — el proyecto ya referencia `xunit`, `xunit.runner.visualstudio`, `NSubstitute`, `coverlet.collector` y `Microsoft.NET.Test.Sdk`.
- **Sin impacto** en `Api`, `Domain`, `Infrastructure`, `Seed`, ni en el cliente.
