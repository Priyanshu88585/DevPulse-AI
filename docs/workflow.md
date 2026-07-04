# Workflow

> How the documentation generation pipeline works, from trigger to commit.

---

## Execution Flow

```
 ┌──────────────┐
 │   Trigger    │  (cron / manual / CLI)
 └──────┬───────┘
        │
        ▼
 ┌──────────────┐
 │  Bootstrap   │  Ensure dirs, validate config, log startup
 └──────┬───────┘
        │
        ▼
 ┌──────────────┐
 │  Scheduler   │  Check interval / force flag
 └──────┬───────┘
        │
    ┌───┴───┐
    │ Run?  │
    └───┬───┘
    No  │  Yes
    │   │
    ▼   ▼
  Exit  ┌──────────────┐
        │  Generators  │  Run enabled generators
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │   Compare    │  Hash check: content changed?
        └──────┬───────┘
               │
           ┌───┴───┐
           │ Changed│
           └───┬───┘
          No   │  Yes
          │    │
          ▼    ▼
        Exit  ┌──────────────┐
              │   Commit     │  Stage, commit, push
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │    Log       │  Record execution history
              └──────────────┘
```

## Trigger Methods

| Method | Command | When |
| :--- | :--- | :--- |
| GitHub Actions Cron | Automatic | Every 6 hours |
| Manual Dispatch | GitHub UI → "Run workflow" | On demand |
| CLI — Full | `npm start` | Local development |
| CLI — Force | `npm start -- --force` | Skip schedule check |
| CLI — Dry Run | `npm run generate` | Preview without commit |
| CLI — Update | `npm run update` | Force all generators |

## Generator Rotation

The system runs all enabled generators on each execution, but only commits files that actually changed. This means:

- Some runs may update 1–2 files
- Other runs may update all 6+ files
- No unnecessary commits are created

## Commit Messages

Commit messages are contextually selected based on which files changed:

| File Changed | Example Message |
| :--- | :--- |
| `PROGRESS.md` | `docs: update development progress` |
| `ROADMAP.md` | `chore: synchronize roadmap` |
| `CHANGELOG.md` | `docs: update changelog entries` |
| `METRICS.md` | `docs: refresh project metrics` |
| `TODO.md` | `chore: refresh task tracker` |
| Multiple files | Random selection from curated pool |

---

*DevPulse AI — Automated Documentation Engine*
