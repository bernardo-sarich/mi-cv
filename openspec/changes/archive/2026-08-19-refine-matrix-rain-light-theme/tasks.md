## 1. Component

- [x] 1.1 In `client/src/components/ui/MatrixRain.jsx`, change `ACCENT_BY_THEME.light` from `#19804b` to `#E2E8F0`, keeping `dark: '#3ddc84'` unchanged.
- [x] 1.2 Update the comment above `ACCENT_BY_THEME` (currently describing both values as mirroring the `accent`/`dark-accent` tailwind tokens) to state that only `dark` mirrors `dark-accent`; `light` is a deliberately distinct decorative gray, not the `accent` token.
- [x] 1.3 Add a short comment on the `destination-out` fade step in `draw()` noting it erases by alpha channel only (the `0, 0, 0` RGB in `fillStyle` is never painted), so it is already color/theme-agnostic and needs no per-theme handling.

## 2. Spec sync

- [x] 2.1 Confirm the delta in `specs/matrix-rain-background/spec.md` matches the implemented value before sync/archive.

## 3. Verification

- [x] 3.1 From `client/`, run `npm run lint` and `npm run build`; both must pass before archiving.
