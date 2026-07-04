# API Reference

> Public API documentation for all modules.

---

## Generators

All generators implement the same interface:

```javascript
{
  name: string,
  generate(): Promise<{
    filename: string,  // Output filename (e.g., 'PROGRESS.md')
    content: string,   // Generated markdown content
    changed: boolean,  // Whether the content differs from existing file
  }>
}
```

### Available Generators

| Generator | Output | Description |
| :--- | :--- | :--- |
| `progressGenerator` | `PROGRESS.md` | Sprint tracking, completed work, priorities |
| `roadmapGenerator` | `ROADMAP.md` | Milestones and project roadmap |
| `changelogGenerator` | `CHANGELOG.md` | Semantic versioned changelog |
| `metricsGenerator` | `METRICS.md` | Project statistics dashboard |
| `todoGenerator` | `TODO.md` | Priority-organized task list |
| `releaseGenerator` | `RELEASES.md` | Release summaries and highlights |

### Update Orchestrator

```javascript
import { runAllGenerators, runGenerator, listGenerators } from './generators/updateGenerator.js';

// Run all enabled generators
const result = await runAllGenerators();
// result: { results: [], changedFiles: [], errors: [] }

// Run specific generators
const result = await runAllGenerators({ only: ['progress', 'metrics'] });

// Run a single generator
const output = await runGenerator('progress');
```

---

## Utilities

### Logger (`utils/logger.js`)

```javascript
import logger from './utils/logger.js';

logger.info('Message');
logger.warn('Warning', { key: 'value' });
logger.error('Error occurred', { error: err.message });
logger.debug('Debug info');

// Timing
const done = logger.time('Operation');
// ... do work ...
done(); // Logs elapsed time

// Log to specific file
logger.logTo('custom.log', 'Entry');
```

### File Utilities (`utils/file.js`)

```javascript
import { readJSON, writeJSON, readMarkdown, writeMarkdown, ensureDir, fileExists } from './utils/file.js';

const data = readJSON('/path/to/file.json', { default: 'value' });
writeJSON('/path/to/file.json', data);

const content = readMarkdown('/path/to/file.md', '');
const changed = writeMarkdown('/path/to/file.md', content); // Returns boolean
```

### Date Utilities (`utils/date.js`)

```javascript
import { formatDate, formatTimestamp, formatReadable, getRelativeTime, getCurrentSprint } from './utils/date.js';

formatDate();           // '2025-07-04'
formatTimestamp();      // '2025-07-04T12:00:00.000Z'
formatReadable();       // 'July 4, 2025'
getRelativeTime(date);  // '2 hours ago'
getCurrentSprint();     // { number: 14, start: '...', end: '...' }
```

### Formatter (`utils/formatter.js`)

```javascript
import { heading, table, list, badge, progressBar, details } from './utils/formatter.js';

heading('Title', 2);           // '## Title'
list(['A', 'B', 'C']);         // '- A\n- B\n- C'
table(['H1', 'H2'], [['a','b']]);
badge('status', 'active', 'green');
progressBar(75);               // '███████████████░░░░░ 75%'
```

---

## Services

### Markdown Service

```javascript
import { renderTemplate, composeDocument, documentHeader } from './services/markdown.service.js';

renderTemplate('Hello {{name}}', { name: 'World' });
composeDocument(section1, section2, section3);
documentHeader('Title', { description: 'Desc', lastUpdated: '2025-01-01' });
```

### Commit Service

```javascript
import { performCommit, selectCommitMessage } from './services/commit.service.js';

const result = await performCommit(changedFiles, { push: true });
```

### Metrics Service

```javascript
import { computeMetrics, getMetricsSummary } from './services/metrics.service.js';

const metrics = computeMetrics();
// { documentationPages, totalTasks, completedTasks, ... }
```

---

## Configuration

```javascript
import config from './app/config.js';

config.project.name      // Project name
config.generators.enabled // Enabled generator names
config.git.autoCommit     // Whether to auto-commit
config.scheduler.interval // Schedule interval in ms
```

---

*DevPulse AI — Automated Documentation Engine*
