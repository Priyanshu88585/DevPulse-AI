<div align="center">

# 🤖 DevPulse AI

### Intelligent Project Documentation & Progress Automation

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![ES Modules](https://img.shields.io/badge/Modules-ESM-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](docs/contribution.md)

*A production-quality Node.js engine that automatically generates and maintains project documentation — progress reports, changelogs, roadmaps, metrics, and development summaries — on a configurable schedule.*

[Features](#-features) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [Configuration](#-configuration) · [Documentation](#-documentation) · [Contributing](#-contributing)

</div>

---

## ✨ Features

- **📊 Progress Reports** — Sprint tracking, completed work, priorities, and blockers
- **🗺️ Roadmap Visualization** — Milestone tracking with progress indicators
- **📋 Changelog** — Semantic versioned entries categorized by type
- **📈 Metrics Dashboard** — Project statistics with badges and progress bars
- **📝 TODO Tracking** — Priority-organized task management
- **🚀 Release Notes** — Version summaries with highlights
- **⏰ Automated Scheduling** — GitHub Actions cron every 6 hours
- **🔍 Change Detection** — SHA-256 hashing prevents unnecessary commits
- **🧩 Extensible** — Add new generators with a single interface

---

## 🏗️ Architecture

The project follows **Clean Architecture** with distinct layers:

```
┌─────────────────────────────────────────┐
│          Scripts (CLI entry)            │
├─────────────────────────────────────────┤
│     Application (bootstrap, scheduler)  │
├─────────────────────────────────────────┤
│         Generators (6 modules)          │
├─────────────────────────────────────────┤
│      Services (9 business modules)      │
├─────────────────────────────────────────┤
│         Utilities (8 helpers)           │
├─────────────────────────────────────────┤
│           Data (JSON files)             │
└─────────────────────────────────────────┘
```

Each generator implements a consistent interface for easy extensibility:

```javascript
{
  name: 'generatorName',
  generate(): Promise<{ filename, content, changed }>
}
```

---

## 📁 Folder Structure

```
DevPulse AI/
├── .github/workflows/     # CI/CD pipelines (scheduler, lint, release)
├── app/                   # Application core (main, bootstrap, scheduler, config)
├── services/              # Business logic (markdown, commit, metrics, ...)
├── generators/            # Documentation generators (progress, roadmap, ...)
├── data/                  # JSON data files (roadmap, versions, milestones, ...)
├── logs/                  # Execution logs (activity, scheduler, errors)
├── output/                # Generated markdown files (PROGRESS, ROADMAP, ...)
├── templates/             # Markdown templates with {{placeholders}}
├── reports/               # Periodic reports (daily, weekly, monthly)
├── utils/                 # Helper functions (logger, file, date, formatter, ...)
├── scripts/               # CLI scripts (start, generate, update, release, clean)
├── docs/                  # Project documentation
├── tests/                 # Unit tests (vitest)
└── assets/                # Project assets
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/user/github-contributions.git
cd github-contributions

# Install dependencies
npm install
```

### Run

```bash
# Generate documentation (dry run — no commit)
npm run generate

# Force-generate and commit
npm run update

# Run with schedule check
npm start

# Run specific generators only
npm start -- --force --only progress,metrics

# View all options
npm start -- --help
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `GITHUB_TOKEN` | — | GitHub PAT for pushing commits |
| `GIT_USER_NAME` | `GitHub Contributions Bot` | Git commit author name |
| `GIT_USER_EMAIL` | `bot@github-contributions.dev` | Git commit author email |
| `AUTO_COMMIT` | `true` | Auto-commit after generation |
| `AUTO_PUSH` | `false` | Auto-push after commit |
| `LOG_LEVEL` | `INFO` | Log verbosity: `DEBUG`, `INFO`, `WARN`, `ERROR` |
| `NODE_ENV` | `production` | Environment mode |

### Project Settings (`data/settings.json`)

```json
{
  "name": "Your Project",
  "version": "1.0.0",
  "description": "Your project description",
  "repository": "https://github.com/user/repo",
  "enabledGenerators": ["progress", "roadmap", "changelog", "metrics", "todo", "release"]
}
```

---

## 📝 Generated Files

| File | Generator | Description |
| :--- | :--- | :--- |
| `PROGRESS.md` | Progress | Sprint status, completed work, priorities |
| `ROADMAP.md` | Roadmap | Milestones with progress bars |
| `CHANGELOG.md` | Changelog | Semantic versioned change log |
| `METRICS.md` | Metrics | Project statistics dashboard |
| `TODO.md` | TODO | Priority-organized task list |
| `RELEASES.md` | Release | Version summaries and highlights |

---

## 🔄 GitHub Actions

### Scheduled Generation

The `scheduler.yml` workflow runs every 6 hours:

```yaml
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch: {}
```

It generates documentation, commits changes, and pushes to `main`.

### Manual Trigger

Go to **Actions** → **Documentation Scheduler** → **Run workflow**

### Additional Workflows

| Workflow | Trigger | Purpose |
| :--- | :--- | :--- |
| `scheduler.yml` | Cron / Manual | Generate and commit docs |
| `lint.yml` | Push / PR | Syntax check and tests |
| `release.yml` | Tag push | Create GitHub Release |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

Tests cover:
- All 6 generators (output shape, content, change detection)
- All services (markdown, changelog, metrics, tasks, timeline)
- All utilities (date, formatter, helper, random, validator)
- Scheduler (interval checking, execution history)

---

## 🛠️ Development

```bash
# Generate docs without committing
npm run generate

# Force regenerate everything
npm run update

# Prepare a release (bumps version)
npm run release          # patch bump
npm run release minor    # minor bump
npm run release major    # major bump

# Clean output and logs
npm run clean

# Syntax check
npm run lint
```

---

## 📖 Documentation

| Document | Description |
| :--- | :--- |
| [Architecture](docs/architecture.md) | System design and layer responsibilities |
| [Workflow](docs/workflow.md) | Execution pipeline from trigger to commit |
| [Setup Guide](docs/setup.md) | Installation and configuration |
| [API Reference](docs/api.md) | Public API for all modules |
| [Contributing](docs/contribution.md) | How to contribute |

---

## 🔮 Future Enhancements

- 🤖 AI-generated weekly development summaries
- 🔗 GitHub Issues synchronization
- 📊 Project health scoring
- 📐 Mermaid architecture diagrams
- 🛡️ Shields.io badge auto-updates
- 👥 Contributor statistics
- 🌐 Multi-repository support
- 🧩 Plugin architecture for custom generators

---

## 🤝 Contributing

Contributions are welcome! See [Contributing Guidelines](docs/contribution.md) for details.

```bash
# Fork → Clone → Branch → Code → Test → PR
git checkout -b feature/amazing-feature
npm test
git commit -m 'feat: add amazing feature'
git push origin feature/amazing-feature
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by the DevPulse AI Team**

*Clean Architecture · Zero Dependencies · Automated Documentation*

</div>
