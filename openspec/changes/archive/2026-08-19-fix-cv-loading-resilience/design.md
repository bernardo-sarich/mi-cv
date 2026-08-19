## Context

`getCVData(lang)` (`client/src/lib/api.js`) does a plain `fetch` with no timeout. `AppProvider`'s CV-fetch `useEffect` (`client/src/context/AppContext.jsx`) sets a local `cancelled` flag in its cleanup and checks it before applying the result, but never aborts the underlying `fetch` — the HTTP request (and the Postgres connections it holds open across `GetCvUseCase`'s four parallel repository calls) keeps running to completion or failure regardless. See `proposal.md - Why` for the cold-start scenario this produces.

## Goals / Non-Goals

**Goals:**
- Bound how long a single `/api/cv` request can stay pending before the client gives up and falls back to local mock content.
- Stop leaving superseded requests running when the visitor changes language again before the previous request settles.

**Non-Goals:**
- Changing `GetCvUseCase` or the API's connection-per-repository pattern — this change is client-only.
- Retrying or de-duplicating requests, request queuing, or any loading-UI change (the loading placeholder itself is covered by the existing `cv-loading-indicator` capability and is unaffected).

## Decisions

**Timeout implementation: `AbortController` + `setTimeout` inside `getCVData`, not a wrapper/race utility.**
`fetch` has no native timeout option. The standard, dependency-free pattern is creating an `AbortController`, passing `controller.signal` to `fetch`, and calling `controller.abort()` from a `setTimeout`. Clearing that timeout in a `finally` avoids leaking a timer once the request settles normally. Chosen over a `Promise.race([fetch(...), timeoutPromise])` helper because `Promise.race` alone doesn't cancel the losing `fetch` — the request (and DB connection) would keep running in the background even after the race "times out," which is exactly the leak this change is fixing.

Timeout value: 18 seconds — inside the proposed 15-20s range, comfortably under the loading-indicator copy's "up to a minute" cold-start disclosure while still being long enough not to abort a legitimately slow-but-succeeding cold start too eagerly.

An aborted request already flows into `getCVData`'s existing `catch` block (an abort rejects the `fetch` promise), so it falls back to the local mock through the same path as a network error or non-2xx response — no new branch needed there.

**Cancellation on language change: lift the `AbortController` into `AppContext`'s effect, pass its `signal` through `getCVData`.**
`getCVData(lang)` gains an optional second parameter, `signal`, forwarded to `fetch`. The `useEffect` in `AppContext.jsx` creates one `AbortController` per effect run and calls `controller.abort()` in the cleanup function (which already runs when `lang` changes or the component unmounts), replacing the existing `cancelled` boolean. This reuses the effect's existing cleanup lifecycle instead of adding new state.

One subtlety: aborting the previous request still resolves `getCVData`'s own `try/catch` by falling back to the mock value for the *old* language, and that promise's `.then` will still fire. The cleanup's `abort()` alone doesn't prevent that stale `.then` from calling `setCvData`. So the existing pattern of checking a per-run "is this still current" guard inside the effect is kept — but as a variable captured at effect-run time, checked in `.then`/`.catch`/`.finally`, rather than being the mechanism relied on to stop the network request (that job now belongs to `abort()`). The two mechanisms address different problems: `abort()` stops the outstanding request/connection; the run-guard stops a late resolution from overwriting fresher state.

## Risks / Trade-offs

- **Aborting near the 18s mark could cut off a request that would have succeeded a moment later on a slow cold start** → acceptable: the user already sees the loading placeholder's "can take up to a minute" hint, and falling back to mock content (rather than hanging forever) is strictly better than the current behavior. The user can still get live data on the next language toggle or reload once the DB is warm.
- **`AbortController` support**: available in all browsers this site targets (no IE11 requirement anywhere else in the codebase) — no polyfill needed.
