# Setup Guide

> Complete installation and configuration guide.

---

## Prerequisites

- **Node.js** 18.0.0 or later (LTS recommended)
- **npm** 9.0.0 or later
- **Git** 2.0 or later

## Installation

```bash
# Clone the repository
git clone https://github.com/user/devpulse-ai.git
cd devpulse-ai

# Install dependencies
npm install
```

## Configuration

### Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
GITHUB_TOKEN=your_github_personal_access_token
GIT_USER_NAME=Your Name
GIT_USER_EMAIL=your@email.com
NODE_ENV=production
AUTO_COMMIT=true
AUTO_PUSH=false
```

### Project Settings

Edit `data/settings.json` to customize project metadata:

```json
{
  "name": "Your Project Name",
  "version": "1.0.0",
  "description": "Your project description",
  "repository": "https://github.com/user/repo",
  "author": "Your Name"
}
```

### Generator Configuration

Enable or disable generators in `data/settings.json`:

```json
{
  "enabledGenerators": [
    "progress",
    "roadmap",
    "changelog",
    "metrics",
    "todo",
    "release"
  ]
}
```

## Quick Start

```bash
# Generate documentation (dry run — no commit)
npm run generate

# Force-generate and commit
npm run update

# Run with schedule check
npm start

# View help
npm start -- --help
```

## GitHub Actions Setup

1. Push the repository to GitHub
2. The scheduler workflow (`.github/workflows/scheduler.yml`) will automatically run every 6 hours
3. To trigger manually: GitHub → Actions → "Documentation Scheduler" → "Run workflow"

### Required Permissions

The GitHub Actions workflow needs `contents: write` permission to push commits. This is configured in the workflow file.

## Customizing Data

### Roadmap (`data/roadmap.json`)

Add or modify milestones with statuses: `completed`, `in-progress`, `planned`, `future`.

### Versions (`data/versions.json`)

Add new version entries with categorized changes: `Added`, `Changed`, `Fixed`, `Improved`, `Documentation`.

### Progress (`data/progress.json`)

Update current sprint goals, completed items, next priorities, and blockers.

### Milestones (`data/milestones.json`)

Track milestone completion percentages and task breakdowns.

## Verification

```bash
# Run tests
npm test

# Check syntax
npm run lint

# Check output files
ls output/
```

---

*DevPulse AI — Automated Documentation Engine*
