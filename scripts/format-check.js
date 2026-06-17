const { spawnSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const prettierRoot = path.dirname(require.resolve('prettier/package.json'));
const prettierBin = path.join(prettierRoot, 'bin', 'prettier.cjs');

const args = [
  '--check',
  'README.md',
  '.github/workflows/*.yml',
  'eslint.config.js',
  'package.json',
  'scripts/**/*.js',
  'tests/**/*.js',
  'apps/api/src/**/*.js',
  'apps/socket/src/**/*.js',
  'apps/worker/src/**/*.js',
  'apps/web/**/*.{js,jsx}',
];

const result = spawnSync(process.execPath, [prettierBin, ...args], {
  cwd: rootDir,
  stdio: 'inherit',
});

if (result.status !== 0) {
  process.exit(result.status || 1);
}
