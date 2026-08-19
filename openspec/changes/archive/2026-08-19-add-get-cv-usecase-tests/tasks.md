## 1. Setup del archivo de tests

- [x] 1.1 Crear `api/Application.Tests/UseCases/GetCvUseCaseTests.cs` con namespace `Application.Tests.UseCases`, using de `Application.Ports`, `Application.UseCases`, `Domain`, `NSubstitute`, `NSubstitute.ExceptionExtensions`
- [x] 1.2 Agregar un helper privado (`CreateSut` o similar) que arme el `GetCvUseCase` con los cuatro mocks (`IProfileRepository`, `IExperienceRepository`, `IProjectRepository`, `ISkillCategoryRepository` vía `Substitute.For<T>()` como campos readonly), para no repetir el arranque en cada test
- [x] 1.3 Agregar helpers/constantes privados para construir valores de `Domain` conocidos (`Profile`, `Experience`, `Project`, `SkillCategory`) usados como retorno de los mocks

## 2. Camino feliz

- [x] 2.1 `[Fact]`: configurar los cuatro repositorios mockeados para devolver un `Profile`, una `IReadOnlyList<Experience>`, una `IReadOnlyList<Project>` y una `IReadOnlyList<SkillCategory>` conocidos al invocarse con un `Language` dado (p. ej. `Language.Es`); ejecutar `ExecuteAsync(language)` y verificar (`Assert.Equal`/`Assert.Same`) que el `CvContent` devuelto tiene `Language` igual al pedido y `Profile`/`Experience`/`Projects`/`Skills` iguales a los valores configurados en los mocks

## 3. Verificación de invocación a los puertos

- [x] 3.1 En el mismo test del punto 2 o en uno adicional, verificar con `Received(1)` que cada uno de los cuatro repositorios fue invocado exactamente una vez, cada uno con el mismo `Language` pasado a `ExecuteAsync` (`Arg.Is<Language>(l => l == language)` o el valor literal)

## 4. Propagación de errores

- [x] 4.1 `[Fact]`: configurar `IProjectRepository.GetProjectsAsync` (vía `NSubstitute.ExceptionExtensions.ThrowsAsync`) para lanzar una excepción conocida (p. ej. `InvalidOperationException`); verificar que `ExecuteAsync` propaga esa misma excepción (`await Assert.ThrowsAsync<InvalidOperationException>(...)`) en vez de tragarla — a diferencia de `SubmitContactUseCase`, acá no hay manejo best-effort

## 5. Verificación

- [x] 5.1 Correr `dotnet test api/Application.Tests/Application.Tests.csproj` y confirmar que los nuevos casos pasan junto con los ya existentes de `SubmitContactUseCaseTests`

  Resultado: 24/24 tests pasan (`dotnet test Application.Tests/Application.Tests.csproj` desde `api/`).
