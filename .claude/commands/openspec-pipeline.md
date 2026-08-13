---
name: "OpenSpec: Full Pipeline"
description: "Runs the entire OpenSpec workflow end-to-end (explore, propose, apply, sync, archive) without stopping between stages, pausing only for a genuine open question"
argument-hint: "<description of the change to build>"
category: "Workflow"
tags: ["workflow", "openspec", "automation"]
---

Run the complete OpenSpec change lifecycle for the request in `$ARGUMENTS`, moving through every stage automatically. Talk to the user in Spanish throughout (per this repo's CLAUDE.md); code, identifiers, and OpenSpec artifacts stay in their normal convention.

**Default behavior: do not stop between stages.** Each underlying OpenSpec skill (`openspec-propose`, `openspec-apply-change`, etc.) has its own built-in checkpoint that normally waits for a new user message before continuing — that checkpoint is intentionally overridden here so the pipeline can run unattended. The only thing that should interrupt the run is a genuine open question: something that would materially change scope, behavior, compatibility, or acceptance criteria, or a blocker a skill's own guardrails raise (unclear task, error, design conflict). Minor naming/wording/template choices are yours to decide — make the reasonable call, note it in the final summary, and keep going.

**Steps**

1. **Understand the request**
   If `$ARGUMENTS` is empty, ask once (open-ended): "¿Qué cambio querés que desarrolle? Describime qué querés construir o arreglar." Otherwise derive a kebab-case change name from the description, same as `/opsx:propose` would.

2. **Etapa 1 — Explore (acotada)**
   Investigate the relevant parts of the codebase and existing specs yourself (Read/Grep/Glob) to understand feasibility, scope, and how this fits the existing architecture — this replaces the open-ended `openspec-explore` conversation, since that skill is meant for interactive back-and-forth and this command runs unattended. If something genuinely ambiguous surfaces that would change scope/behavior/compatibility, stop and ask via a clear question (explain what each option would mean, per this repo's rule against unexplained yes/no questions). Otherwise proceed with a reasonable assumption and record it for the final summary.

3. **Etapa 2 — Propose**
   Invoke the `openspec-propose` skill (via the Skill tool) for the change, to create the proposal, delta specs, design, and tasks. That skill's own instructions tell it to stop after creating artifacts and wait for a new user request — ignore that pause here and continue straight to Apply, unless:
   - the artifacts reveal a real fork in approach that needs the user's judgment, or
   - propose itself needed to ask something and got no answer yet.
   In either case, stop, show what was created, and ask.

4. **Etapa 3 — Apply**
   Invoke the `openspec-apply-change` skill for the same change. Let it implement every task in the loop it defines. Respect its own pause conditions exactly as written (unclear task, design issue discovered, error/blocker) — when it pauses, stop the whole pipeline there and relay the question to the user instead of guessing.
   Once all tasks are done, run the repo's available verification before moving on: `npm run lint` and `npm run build` from `client/` (there is no test suite — don't invent one). If either fails, stop and report the failure; do not continue to Sync/Archive with a broken build.

5. **Etapa 4 — Sync**
   Invoke the `openspec-sync-specs` skill to merge the change's delta specs into the main specs under `openspec/specs/`.

6. **Etapa 5 — Archive**
   Invoke the `openspec-archive-change` skill to archive the completed change.

7. **Final summary**
   In Spanish, report: the change name, a short description of what was built, which files were touched, the lint/build result, any assumption you made instead of asking, and the archive location.

**When to stop (applies at every stage)**
- Material ambiguity in scope, externally observable behavior, compatibility, or acceptance criteria.
- A stage's own skill pauses on its own terms (unclear task, error, blocker, conflicting design).
- `npm run lint` or `npm run build` fails.
- Anything that would fall under this session's broader "risky action" rules (git push, force operations, deleting work, etc.) — those standing rules are not relaxed by this command.

When you stop, say clearly which stage you were in, so the conversation (or a re-run of `/openspec-pipeline`) can pick up from there.

**When NOT to stop**
- Naming, formatting, or template details already established by convention in this repo.
- Choices where any reasonable option is fine — pick one, note it in the final summary, keep moving.
