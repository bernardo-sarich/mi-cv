## 1. Timeout in the CV content accessor

- [x] 1.1 In `client/src/lib/api.js`, add an optional `signal` parameter to `getCVData(lang, signal)` and forward it to `fetch`.
- [x] 1.2 Inside `getCVData`, create an `AbortController`, start an 18s `setTimeout` that calls `controller.abort()`, pass `controller.signal` to `fetch`, and clear the timeout once the request settles (success or failure) so no timer leaks.
- [x] 1.3 If a caller-provided `signal` aborts, propagate that abort to the internal `fetch` call as well (e.g. forward external aborts into the internal controller, or pass the caller's signal straight through when there is no separate timeout controller in play) so both the timeout and an external cancellation lead to the same fallback path.
- [x] 1.4 Confirm the existing `catch` block's fallback to `cvData[lang]` already covers an aborted fetch (no new branch needed) — verify by reading the resulting code, not by running the (nonexistent) test suite.

## 2. Cancel superseded requests on language change

- [x] 2.1 In `client/src/context/AppContext.jsx`, replace the `cancelled` boolean in the CV-fetch `useEffect` with an `AbortController` created at the top of the effect.
- [x] 2.2 Pass `controller.signal` into `getCVData(lang, controller.signal)`.
- [x] 2.3 Call `controller.abort()` in the effect's cleanup function (runs on `lang` change and on unmount), replacing the old `cancelled = true` assignment.
- [x] 2.4 Keep a per-run guard (e.g. a local variable closed over by the effect) checked in the `.then`/`.catch`/`.finally` handlers, so a request that resolves after being superseded still cannot overwrite state for the newer language — this is a separate concern from aborting the request itself (see design.md - Decisions).

## 3. Spec-only correction

- [x] 3.1 No code change: `client/src/components/sections/Hero.jsx` already implements the functional download button correctly.

## 4. Verification

- [x] 4.1 From `client/`, run `npm run lint` and confirm it passes.
- [x] 4.2 From `client/`, run `npm run build` and confirm it succeeds.
- [x] 4.3 Read through the modified `getCVData` and `AppContext.jsx` once more to confirm rapid language toggling aborts the previous request rather than leaving it to resolve in the background (code inspection — no test runner available to automate this).
