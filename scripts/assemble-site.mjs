import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';

function arg(name, fallback = '') {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

const dist = path.resolve(arg('--dist', 'dist'));
const previews = arg('--previews', '');
const out = path.resolve(arg('--out', '_site'));

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error(`No production index.html in ${dist}`);
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(dist, out, { recursive: true });
removeCname(out);

if (previews) {
  const root = path.resolve(previews);
  if (existsSync(root)) {
    for (const name of readdirSync(root)) {
      if (!/^pr-\d+$/.test(name)) continue;
      const from = path.join(root, name);
      const info = lstatSync(from);
      if (info.isSymbolicLink() || !info.isDirectory()) {
        console.error(`Refusing to copy ${name}: expected a real directory`);
        process.exit(1);
      }
      const dest = path.join(out, name);
      cpSync(from, dest, { recursive: true, dereference: true });
      removeCname(dest);
      console.log(`Included preview /${name}/`);
    }
  }
}

const preserved = [
  'index.html',
  'generic.html',
  'elements.html',
  'blog/indexblog.html',
  'blog/pages/referenceforcpalgo.html',
  'SunDayNights.jpg',
  'favicon.ico',
];
for (const relative of preserved) {
  if (!existsSync(path.join(out, relative))) {
    console.error(`Assembled site is missing ${relative}`);
    process.exit(1);
  }
}
if (existsSync(path.join(out, 'CNAME'))) {
  console.error('CNAME is still in the assembled site');
  process.exit(1);
}

console.log(`Assembled ${out}`);

function removeCname(directory) {
  const cname = path.join(directory, 'CNAME');
  if (!existsSync(cname)) return;
  rmSync(cname);
  console.warn(`Removed ${cname}. Custom domains are set in Pages settings, not by a CNAME file.`);
}
