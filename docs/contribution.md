# Contributing

> Guidelines for contributing to DevPulse AI.

---

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USER/devpulse-ai.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`

## Development Workflow

```bash
# Run documentation generation (dry run)
npm run generate

# Run tests
npm test

# Watch mode for tests
npm run test:watch

# Lint check
npm run lint

# Clean output
npm run clean
```

## Code Style

- **ES Modules** — Use `import`/`export`, not `require`/`module.exports`
- **async/await** — Prefer over raw Promises
- **JSDoc** — Document all public functions
- **Descriptive Names** — Avoid abbreviations; clarity over brevity
- **Constants** — All magic values go in `app/constants.js`

## Adding a Generator

1. Create `generators/myGenerator.js`:

```javascript
const myGenerator = {
  name: 'myFeature',

  async generate() {
    // Read data, format content, write file
    return { filename: 'MY_FILE.md', content, changed };
  },
};

export default myGenerator;
```

2. Register in `generators/updateGenerator.js`:

```javascript
import myGenerator from './myGenerator.js';

const GENERATOR_REGISTRY = {
  // ... existing generators
  myFeature: myGenerator,
};
```

3. Add constants in `app/constants.js`
4. Write tests in `tests/generators.test.js`

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Include tests for new functionality
- Update documentation if behavior changes
- Use conventional commit messages:
  - `feat: add new generator`
  - `fix: resolve date formatting issue`
  - `docs: update setup guide`
  - `test: add metrics service tests`
  - `chore: update dependencies`

## Reporting Issues

When reporting bugs:
- Describe the expected vs actual behavior
- Include Node.js version (`node --version`)
- Include relevant log output from `logs/`
- Provide steps to reproduce

## Code of Conduct

Be respectful, constructive, and inclusive. We're all here to build great software.

---

*DevPulse AI — Automated Documentation Engine*
