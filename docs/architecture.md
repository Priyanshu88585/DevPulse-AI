# Architecture

> Technical architecture of the DevPulse AI documentation engine.

---

## Overview

DevPulse AI follows **Clean Architecture** principles with clear separation of concerns across distinct layers:

```
┌─────────────────────────────────────────────┐
│                 Scripts Layer                │
│         (start, generate, update, ...)       │
├─────────────────────────────────────────────┤
│               Application Layer              │
│        (main, bootstrap, scheduler)          │
├─────────────────────────────────────────────┤
│               Generator Layer                │
│   (progress, roadmap, changelog, metrics,    │
│         todo, release, orchestrator)         │
├─────────────────────────────────────────────┤
│                Service Layer                 │
│   (markdown, commit, metrics, changelog,     │
│      task, timeline, log, github)            │
├─────────────────────────────────────────────┤
│               Utility Layer                  │
│    (logger, file, date, formatter, git,      │
│      validator, random, helper)              │
├─────────────────────────────────────────────┤
│                 Data Layer                   │
│    (settings, roadmap, progress, versions,   │
│      milestones, commits, developers)        │
└─────────────────────────────────────────────┘
```

## Design Principles

| Principle | Application |
| :--- | :--- |
| **SOLID** | Each module has a single responsibility; generators implement a common interface |
| **DRY** | Shared utilities prevent code duplication; services centralize business logic |
| **KISS** | Simple template rendering; no complex dependency injection framework |
| **Clean Code** | Descriptive names, JSDoc comments, consistent formatting |
| **Modular** | Every module can be tested, replaced, or extended independently |

## Layer Responsibilities

### Scripts Layer
Entry points for CLI commands. Thin wrappers that parse arguments and delegate to the application layer.

### Application Layer
Orchestrates the application lifecycle: bootstrapping, scheduling decisions, and execution coordination.

### Generator Layer
Each generator is an independent module that reads data, formats content, and writes a specific output file. All generators implement the same interface:

```javascript
{
  name: string,
  generate(): Promise<{ filename, content, changed }>
}
```

### Service Layer
Business logic and shared operations: markdown rendering, git commits, metrics computation, log management.

### Utility Layer
Pure helper functions with no side effects (except logger and file utilities). Stateless, highly reusable.

### Data Layer
JSON files that drive the content of generated documentation. Can be updated manually or by the system.

## Change Detection

The system uses SHA-256 content hashing to avoid unnecessary file writes:

1. Generator produces new content
2. System hashes the new content
3. Compares hash against existing file
4. Only writes if content has actually changed
5. Only commits if files were written

This prevents empty commits and reduces disk I/O.

## Extensibility

To add a new generator:

1. Create `generators/myGenerator.js` implementing `{ name, generate() }`
2. Register it in `generators/updateGenerator.js` → `GENERATOR_REGISTRY`
3. Add the name to `app/constants.js` → `GENERATOR_NAMES`
4. Add output mapping to `app/config.js` → `generators.outputMap`
5. Optionally create a template in `templates/`

---

*DevPulse AI — Automated Documentation Engine*
