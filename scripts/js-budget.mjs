import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = 'dist';
const limit = 50 * 1024;
const htmlFiles = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}

await walk(root);

const seen = new Set();
let gzipBytes = 0;
let rawBytes = 0;

function count(file, buffer) {
  if (seen.has(file)) return;
  seen.add(file);
  const gzip = gzipSync(buffer).length;
  rawBytes += buffer.length;
  gzipBytes += gzip;
  console.log(`${buffer.length}\traw\t${gzip}\tgzip\t${file}`);
}

for (const file of htmlFiles) {
  if (file.includes(`${path.sep}blog${path.sep}`)) continue;
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = match[1];
    const type = /type\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1] ?? '';
    if (type.includes('json')) continue;
    const src = /src\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
    if (src) {
      const clean = src.split('?')[0];
      if (!clean.endsWith('.js')) continue;
      const local = path.join(root, clean.replace(/^\//, ''));
      try {
        count(local, await readFile(local));
      } catch {
        console.error(`Missing script ${local} referenced by ${file}`);
        process.exit(1);
      }
    } else if (match[2].trim()) {
      count(`${file}#inline`, Buffer.from(match[2]));
    }
  }
}

console.log(`JS_RAW=${rawBytes}`);
console.log(`JS_GZIP=${gzipBytes}`);
if (gzipBytes > limit) {
  console.error(`JavaScript gzip ${gzipBytes} exceeds ${limit} bytes`);
  process.exit(1);
}

const home = await readFile(path.join(root, 'index.html'), 'utf8');
const required = [
  'Data and backend engineer. I build the platforms teams run on',
  'How I lead',
  'GAIA: an AI agent as a production system',
  'Backend years in Mohali',
  'linkedin.com/in/ganesh-prasad',
  'live-demo',
  'Sample data',
  'prefers-reduced-motion',
  'application/ld+json',
];
for (const needle of required) {
  if (!home.includes(needle)) {
    console.error(`Homepage is missing: ${needle}`);
    process.exit(1);
  }
}
if (home.includes('Data engineer for solar and battery storage')) {
  console.error('The solar-only hero line is still on the homepage');
  process.exit(1);
}
