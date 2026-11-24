import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'dist');

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });
cpSync(resolve(projectRoot, 'index.html'), resolve(outputDirectory, 'index.html'));
cpSync(resolve(projectRoot, 'style.css'), resolve(outputDirectory, 'style.css'));
cpSync(resolve(projectRoot, 'src'), resolve(outputDirectory, 'src'), { recursive: true });

console.log(`PIXEL RAGE production files created in ${outputDirectory}`);
