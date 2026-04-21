import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const source = resolve(repoRoot, 'questCalendar/docs');
const destination = resolve(repoRoot, 'docs');

if (!existsSync(source)) {
  throw new Error(`Build output was not found: ${source}`);
}

rmSync(destination, { force: true, recursive: true });
cpSync(source, destination, { recursive: true });

console.log(`Copied GitHub Pages build to ${destination}`);
