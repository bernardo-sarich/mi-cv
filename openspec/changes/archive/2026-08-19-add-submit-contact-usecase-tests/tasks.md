## 1. Setup del archivo de tests

- [x] 1.1 Eliminar `api/Application.Tests/UnitTest1.cs` (placeholder generado por `dotnet new xunit`)
- [x] 1.2 Crear `api/Application.Tests/UseCases/SubmitContactUseCaseTests.cs` con namespace `Application.Tests.UseCases`, using de `Application.Errors`, `Application.Ports`, `Application.UseCases`, `Domain`, `Microsoft.Extensions.Logging`, `Microsoft.Extensions.Options`, `NSubstitute`
- [x] 1.3 Agregar un helper privado (`CreateSut` o similar) que arme el `SubmitContactUseCase` con los cuatro mocks (`IContactRepository`, `IContactAttemptStore`, `IContactNotifier` vía `Substitute.For<T>()`, `ILogger<SubmitContactUseCase>` vía `Substitute.For<ILogger<SubmitContactUseCase>>()`) y un `IOptions<RateLimitOptions>` vía `Options.Create(...)`, para no repetir el arranque en cada test

## 2. Honeypot

- [x] 2.1 `[Fact]`: `request.Website` no vacío → `ExecuteAsync` retorna sin lanzar y `contactRepository`/`contactAttemptStore`/`contactNotifier` no reciben ninguna llamada (`DidNotReceive()` sobre los tres)

## 3. Validación de campos individuales

- [x] 3.1 `[Theory]` con `null`, `""`, `"   "` para `Name` vacío/whitespace → `ValidationException` con key `"name"` en `Errors`
- [x] 3.2 `[Theory]` análogo para `Email` vacío/whitespace → key `"email"`
- [x] 3.3 `[Theory]` análogo para `Message` vacío/whitespace → key `"message"`
- [x] 3.4 `[Fact]`: `Name` de 201+ caracteres → `ValidationException` con error de longitud en `"name"`
- [x] 3.5 `[Theory]` con `"sin-arroba"`, `"falta@dominio"` (y algún otro formato inválido) → `ValidationException` con error en `"email"`
- [x] 3.6 `[Fact]`: `Email` de 321+ caracteres → `ValidationException` con error de longitud en `"email"`
- [x] 3.7 `[Fact]`: `Message` de menos de 10 caracteres → `ValidationException` con error de longitud mínima en `"message"`
- [x] 3.8 `[Fact]`: `Message` de 5001+ caracteres → `ValidationException` con error de longitud máxima en `"message"`

## 4. Validación combinada

- [x] 4.1 `[Fact]`: `Name` y `Email` vacíos simultáneamente (con `Message` válido) → `Errors` contiene ambas keys `"name"` y `"email"`

## 5. Rate limiting

- [x] 5.1 `[Fact]`: `contactAttemptStore.CountRecentAsync(...)` devuelve un valor `>= options.MaxAttempts` → `ExecuteAsync` lanza `RateLimitExceededException` y `contactRepository.SaveAsync` nunca se llama

## 6. Camino feliz

- [x] 6.1 `[Fact]`: request válido con espacios al inicio/fin en `Name`/`Email`/`Message` → `contactRepository.SaveAsync` es llamado con un `ContactMessage` cuyos tres campos están trimeados

  Nota de implementación: el padding con espacios se aplicó solo a `Name` y `Message`. El regex de validación de email (`^[^@\s]+@[^@\s]+\.[^@\s]+$`) rechaza cualquier espacio al borde del email *antes* de que se ejecute el `.Trim()`, así que un email con padding nunca llega a guardarse — no es un comportamiento a testear, es una rama inalcanzable del código actual.
- [x] 6.2 Mismo test o uno adicional: `contactAttemptStore.RecordAsync` es llamado y `contactNotifier.NotifyAsync` es llamado

## 7. Notificación best-effort

- [x] 7.1 `[Fact]`: `contactNotifier.NotifyAsync` configurado con `.ThrowsAsync(new Exception(...))` → `ExecuteAsync` no propaga esa excepción, y `contactRepository.SaveAsync` fue llamado antes de que `NotifyAsync` fallara

## 8. Verificación

- [x] 8.1 Correr `dotnet test api/Application.Tests/Application.Tests.csproj` y confirmar que los 11+ casos pasan

  Resultado: 21/21 tests pasan (`dotnet test Application.Tests/Application.Tests.csproj` desde `api/`).
