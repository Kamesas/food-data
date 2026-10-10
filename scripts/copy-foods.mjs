// Copies the built food files into an app folder.
// Usage: node scripts/copy-foods.mjs <target-dir>
import fs from "node:fs";
import path from "node:path";

const [targetDir] = process.argv.slice(2);

if (!targetDir) {
  console.error("Usage: node scripts/copy-foods.mjs <target-dir>");
  process.exit(1);
}

const DIST_DIR = path.join(import.meta.dirname, "..", "dist");

const files = fs
  .readdirSync(DIST_DIR)
  .filter((name) => /^foods\.[a-z]+\.json$/.test(name));

if (files.length === 0) {
  console.error(`No foods.*.json in ${DIST_DIR}. Run npm run build:foods first.`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const name of files) {
  fs.copyFileSync(path.join(DIST_DIR, name), path.join(targetDir, name));
  console.log(`Copied ${name} to ${targetDir}`);
}
