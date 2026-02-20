import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

// Built-in Node modules (https://nodejs.org/api/modules.html#modules_core_modules)
const builtInModules = new Set([
  'assert','buffer','child_process','cluster','console','constants','crypto','dgram',
  'dns','domain','events','fs','http','http2','https','inspector','module','net','os',
  'path','perf_hooks','process','punycode','querystring','readline','repl','stream','string_decoder',
  'timers','tls','trace_events','tty','url','util','v8','vm','worker_threads','zlib','async_hooks','wasi'
]);

// Local folders to ignore
const localFolders = new Set(['src','lib','bin','modules']);

// Read package.json dependencies
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const declaredDeps = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {})
]);

const missingDeps = new Set();

// Scan all JS/TS files (ignore node_modules)
const files = glob.sync('**/*.{js,ts,jsx,tsx}', { ignore: 'node_modules/**' });

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');

  // Match ES6 imports: import ... from 'package'
  const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let dep = match[1].split('/')[0];
    if (
      !dep.startsWith('.') &&
      !builtInModules.has(dep) &&
      !localFolders.has(dep) &&
      !declaredDeps.has(dep) &&
      !dep.includes('${') // ignore template variables
    ) {
      missingDeps.add(dep);
    }
  }

  // Match CommonJS require(): require('package')
  const requireRegex = /require\(['"](.*?)['"]\)/g;
  while ((match = requireRegex.exec(content)) !== null) {
    let dep = match[1].split('/')[0];
    if (
      !dep.startsWith('.') &&
      !builtInModules.has(dep) &&
      !localFolders.has(dep) &&
      !declaredDeps.has(dep) &&
      !dep.includes('${')
    ) {
      missingDeps.add(dep);
    }
  }
}

if (missingDeps.size === 0) {
  console.log('✅ No missing dependencies found.');
} else {
  const list = Array.from(missingDeps).sort();
  console.log('❌ Missing dependencies detected:\n');
  list.forEach(d => console.log(d));

  console.log('\nYou can install them all at once with:');
  console.log(`npm install ${list.join(' ')}`);
}

