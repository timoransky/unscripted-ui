# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Distributable skill stays in sync

`skills/unscripted-ui/references/` is generated from `src/demos/`,
`src/content/components/` and `src/data/features.ts`. After changing any of those,
run `npm run build:skill` and commit the regenerated files. Never hand-edit files
under `references/`; `skills/unscripted-ui/SKILL.md` is hand-written and safe to edit.

## Dependencies / lockfile

- **Do not commit `package-lock.json` unless you intentionally changed dependencies**
  (i.e. you edited `package.json`). Incidental lockfile churn — for example a local
  npm version pruning optional platform packages such as `@emnapi/core` /
  `@emnapi/runtime` — must be left out of commits and PRs.
- CI runs `npm ci`, which fails hard when `package-lock.json` is out of sync with
  `package.json`. Committing spurious lockfile changes breaks the `build` check.
- If `package-lock.json` shows as modified but you did not touch `package.json`,
  restore it before committing:

  ```sh
  git checkout origin/main -- package-lock.json
  ```
