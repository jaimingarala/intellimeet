const { spawnSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const eslintRoot = path.dirname(require.resolve('eslint/package.json'));
const eslintBin = path.join(eslintRoot, 'bin', 'eslint.js');

const args = [
  '--max-warnings=0',
  'eslint.config.js',
  'scripts/**/*.js',
  'tests/**/*.js',
  'apps/api/src/**/*.js',
  'apps/socket/src/**/*.js',
  'apps/worker/src/**/*.js',
  'apps/web/**/*.js',
  'apps/web/**/*.jsx',
];

const result = spawnSync(process.execPath, [eslintBin, ...args], {
  cwd: rootDir,
  stdio: 'inherit',
});

if (result.status !== 0) {
  process.exit(result.status || 1);
}
