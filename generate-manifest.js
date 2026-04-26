const fs   = require('fs');
const path = require('path');

const IMAGES_ROOT = path.join(__dirname, 'Images');
const HTML_FILE   = path.join(__dirname, 'loteria.html');
const IMAGE_EXTS  = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

if (!fs.existsSync(IMAGES_ROOT)) {
  console.error(`❌  Could not find Images folder at: ${IMAGES_ROOT}`);
  process.exit(1);
}
if (!fs.existsSync(HTML_FILE)) {
  console.error(`❌  Could not find loteria.html at: ${HTML_FILE}`);
  process.exit(1);
}

// ── Scan ──────────────────────────────────────────────────────────────────────
const manifest = {};
for (const entry of fs.readdirSync(IMAGES_ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const category = entry.name;
  const images = fs.readdirSync(path.join(IMAGES_ROOT, category), { withFileTypes: true })
    .filter(f => f.isFile() && IMAGE_EXTS.has(path.extname(f.name).toLowerCase()))
    .map(f => f.name)
    .sort();
  if (images.length === 0) { console.warn(`⚠️   Skipping "${category}" — no images found.`); continue; }
  manifest[category] = images;
  console.log(`✅  ${category}: ${images.length} image(s)`);
}

if (Object.keys(manifest).length === 0) {
  console.error('❌  No categories found.');
  process.exit(1);
}

// ── Inject into loteria.html ──────────────────────────────────────────────────
const START = '/* @@MANIFEST_START@@ */';
const END   = '/* @@MANIFEST_END@@ */';
const block = `${START}\nconst MANIFEST = ${JSON.stringify(manifest, null, 2)};\n${END}`;

let html = fs.readFileSync(HTML_FILE, 'utf8');

if (html.includes(START)) {
  // Replace existing block
  const a = html.indexOf(START);
  const b = html.indexOf(END) + END.length;
  html = html.slice(0, a) + block + html.slice(b);
} else {
  // First run — inject right after the opening <script> tag
  html = html.replace('<script>', '<script>\n' + block);
}

fs.writeFileSync(HTML_FILE, html);
console.log(`\n✅  Manifest injected into loteria.html`);
console.log(`    Categories: ${Object.keys(manifest).join(', ')}`);
console.log(`    Open loteria.html in your browser — no server needed!`);