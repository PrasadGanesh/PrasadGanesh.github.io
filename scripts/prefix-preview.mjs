import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

function arg(name) {
  const index = process.argv.indexOf(name);
  const value = index === -1 ? '' : process.argv[index + 1];
  if (!value) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return value;
}

const dir = path.resolve(arg('--dir'));
const site = arg('--site').replace(/\/$/, '');
let base = arg('--base');
if (!base.startsWith('/')) base = `/${base}`;
base = base.replace(/\/$/, '');
if (!/^\/pr-\d+$/.test(base)) {
  console.error(`Preview base must look like /pr-123, got ${base}`);
  process.exit(1);
}

const textExtensions = new Set(['.html', '.css', '.xml', '.txt', '.svg']);

function walk(root, files = []) {
  for (const name of readdirSync(root)) {
    const full = path.join(root, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (textExtensions.has(path.extname(name).toLowerCase())) files.push(full);
  }
  return files;
}

const marker = '__PREVIEW_BASE_ALREADY__';
const originFrom = `${site}/`;
const originTo = `${site}${base}/`;
const baseName = base.slice(1);
const already = `${baseName}(?=/|["'#?\\s]|$)`;
const rootAttribute = new RegExp(
  String.raw`(?<![\w.])(href|src|action|poster)\s*=\s*(["'])\/(?!\/|${already})`,
  'gi',
);
const rootCssUrl = new RegExp(String.raw`url\(\s*(["']?)\/(?!\/|${already})`, 'gi');
const rootRefresh = new RegExp(String.raw`url=\/(?!\/|${already})`, 'gi');

function prefix(content, file) {
  let next = content.split(originTo).join(marker).split(originFrom).join(originTo).split(marker).join(originTo);
  next = next.replace(rootAttribute, `$1=$2${base}/`);
  next = next.replace(rootCssUrl, `url($1${base}/`);
  next = next.replace(rootRefresh, `url=${base}/`);

  if (file.endsWith('.html')) {
    next = next.replace(new RegExp(String.raw`(["'])\/(?!\/|${already})`, 'g'), `$1${base}/`);
    const robots = '<meta name="robots" content="noindex, nofollow">';
    if (/<meta\s+name=["']robots["']/i.test(next)) {
      next = next.replace(/<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>/gi, robots);
    } else {
      next = next.replace(/<head([^>]*)>/i, `<head$1>${robots}`);
    }
  }

  if (path.basename(file) === 'robots.txt') {
    next = 'User-agent: *\nDisallow: /\n';
  }
  return next;
}

const files = walk(dir);
if (!files.some((file) => path.basename(file) === 'index.html')) {
  console.error(`No index.html under ${dir}`);
  process.exit(1);
}

for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const after = prefix(before, file);
  if (after !== before) writeFileSync(file, after);
}

const home = readFileSync(path.join(dir, 'index.html'), 'utf8');
const redirect = readFileSync(path.join(dir, 'generic.html'), 'utf8');
const jqueryPath = path.join(dir, 'blog/assets/js/jquery.min.js');
const jquery = readFileSync(jqueryPath, 'utf8');
const facesPath = path.join(dir, 'fonts/faces.css');
const faces = existsSync(facesPath) ? readFileSync(facesPath, 'utf8') : '';
const errors = [];

if (!home.includes(`href="${base}/"`)) errors.push('home link was not prefixed');
const fontsPrefixed =
  home.includes(`url(${base}/fonts/`) ||
  home.includes(`"${base}/fonts/`) ||
  faces.includes(`${base}/fonts/`);
if (!fontsPrefixed) errors.push('font URLs were not prefixed');
if (home.includes('url(/fonts/') || home.includes('"/fonts/')) errors.push('an unprefixed font URL remains');
if (faces.includes('url("/fonts/') || faces.includes('url(/fonts/')) {
  errors.push('faces.css still points at /fonts/');
}
if (!home.includes(`${site}${base}/`)) errors.push('canonical origin was not prefixed');
if (!home.includes('name="robots" content="noindex, nofollow"')) errors.push('preview home is indexable');
if (!redirect.includes(`url=${base}/`)) errors.push('generic.html does not redirect inside the preview');
if (!jquery.includes("href='/a'")) errors.push('preserved jQuery was rewritten');
if (home.includes(`${base}${base}`)) errors.push('preview base was applied twice');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Prefixed ${files.length} text files with ${base}`);
