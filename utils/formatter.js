/**
 * @module utils/formatter
 * @description Markdown formatting helper functions for generating clean,
 * GitHub-compatible markdown content.
 */

/**
 * Creates a markdown heading.
 * @param {string} text
 * @param {number} [level=1] - Heading level (1–6)
 * @returns {string}
 */
export function heading(text, level = 1) {
  const prefix = '#'.repeat(Math.min(Math.max(level, 1), 6));
  return `${prefix} ${text}`;
}

/**
 * Creates an unordered list from an array of strings.
 * @param {string[]} items
 * @param {string} [marker='-'] - List marker: '-', '*', or '+'
 * @returns {string}
 */
export function list(items, marker = '-') {
  return items.map(item => `${marker} ${item}`).join('\n');
}

/**
 * Creates a checkbox / task list from items.
 * @param {{ text: string, done: boolean }[]} items
 * @returns {string}
 */
export function taskList(items) {
  return items
    .map(({ text, done }) => `- [${done ? 'x' : ' '}] ${text}`)
    .join('\n');
}

/**
 * Creates a markdown table.
 * @param {string[]} headers - Column headers
 * @param {string[][]} rows - Array of row arrays
 * @param {'left'|'center'|'right'} [align='left'] - Column alignment
 * @returns {string}
 */
export function table(headers, rows, align = 'left') {
  const alignMap = { left: ':---', center: ':---:', right: '---:' };
  const separator = alignMap[align] || ':---';

  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `| ${headers.map(() => separator).join(' | ')} |`;
  const bodyRows = rows.map(row => `| ${row.join(' | ')} |`).join('\n');

  return `${headerRow}\n${separatorRow}\n${bodyRows}`;
}

/**
 * Creates a markdown blockquote.
 * @param {string} text
 * @returns {string}
 */
export function quote(text) {
  return text.split('\n').map(line => `> ${line}`).join('\n');
}

/**
 * Creates a fenced code block.
 * @param {string} code
 * @param {string} [language=''] - Language identifier for syntax highlighting
 * @returns {string}
 */
export function codeBlock(code, language = '') {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

/**
 * Creates an inline code span.
 * @param {string} text
 * @returns {string}
 */
export function inlineCode(text) {
  return `\`${text}\``;
}

/**
 * Creates a markdown link.
 * @param {string} text
 * @param {string} url
 * @returns {string}
 */
export function link(text, url) {
  return `[${text}](${url})`;
}

/**
 * Creates a markdown image.
 * @param {string} alt
 * @param {string} url
 * @returns {string}
 */
export function image(alt, url) {
  return `![${alt}](${url})`;
}

/**
 * Creates a Shields.io badge in markdown.
 * @param {string} label
 * @param {string} message
 * @param {string} [color='blue']
 * @returns {string}
 */
export function badge(label, message, color = 'blue') {
  const encodedLabel = encodeURIComponent(label);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://img.shields.io/badge/${encodedLabel}-${encodedMessage}-${color}`;
  return `![${label}](${url})`;
}

/**
 * Creates a horizontal rule.
 * @returns {string}
 */
export function horizontalRule() {
  return '---';
}

/**
 * Wraps text in bold.
 * @param {string} text
 * @returns {string}
 */
export function bold(text) {
  return `**${text}**`;
}

/**
 * Wraps text in italics.
 * @param {string} text
 * @returns {string}
 */
export function italic(text) {
  return `*${text}*`;
}

/**
 * Creates a collapsible details/summary block.
 * @param {string} summary - The clickable summary text
 * @param {string} content - The content revealed on expand
 * @returns {string}
 */
export function details(summary, content) {
  return `<details>\n<summary>${summary}</summary>\n\n${content}\n\n</details>`;
}

/**
 * Joins multiple markdown sections with double newlines.
 * @param  {...string} sections
 * @returns {string}
 */
export function joinSections(...sections) {
  return sections.filter(Boolean).join('\n\n');
}

/**
 * Creates a progress bar using Unicode block characters.
 * @param {number} percentage - 0 to 100
 * @param {number} [width=20] - Bar width in characters
 * @returns {string}
 */
export function progressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `${bar} ${percentage}%`;
}
