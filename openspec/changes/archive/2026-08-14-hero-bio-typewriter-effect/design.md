## Context

`Hero.jsx` already types out `who-am-i` via `useTypingEffect(text, speedMs)` (`client/src/hooks/useTypingEffect.js`), a hook that resets and re-runs a `setInterval` whenever `text` changes. The bio (`data.bio`) currently renders as a plain `motion.p` inside the staggered entrance animation, with `useReducedMotion()` already imported in the file for other Hero animations. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Type out the bio using the existing `useTypingEffect` hook, keeping the Hero's animation approach consistent (no second typing implementation).
- Restart the typing animation whenever `data.bio` changes (language switch).
- Skip the animation entirely under reduced motion, per the Hero's existing reduced-motion pattern.

**Non-Goals:**
- Changing the terminal block's `who-am-i` typing behavior.
- Adding a blinking cursor to the bio (that's specific to the terminal block per the `hero-section` spec).

## Decisions

- **Reuse `useTypingEffect` as-is.** The hook already resets on `text` change, which gives language-switch retyping for free. No hook changes needed.
- **Reduced motion via a ternary at the call site**, matching how the rest of `Hero.jsx` branches on `reduced` (e.g. `getBlockVariants`, `scrollToProjects`): render `reduced ? data.bio : typedBio`, where `typedBio = useTypingEffect(data.bio, 20)`. The hook still runs under reduced motion (cheap, harmless) but its output is simply not used, avoiding conditional-hook-call issues.
- **Speed**: use a faster interval than the terminal line (e.g. ~20ms/char) since the bio is a full sentence/paragraph, not a short identifier — 70ms/char (the terminal's speed) would make a multi-sentence bio take several seconds. Exact ms is an implementation-time tuning call, not a spec-level constraint.

## Risks / Trade-offs

- [Typed bio height changes as characters appear, could cause layout shift in the two-column grid] → Bio sits in its own block below the name/status/role header with no siblings below it competing for space; acceptable, consistent with how the terminal block already reveals text without reserving space.
- [Screen readers may announce partial text as it types] → Same accessibility profile as the existing terminal typing effect already shipped in this section; not a regression.
