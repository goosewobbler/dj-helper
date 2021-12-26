import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getLatestBuiltFilesList } from './utils.mjs';

(async () => {
  const files = await getLatestBuiltFilesList();
  files.push('SHA256SUMS');

  const versionNumber = JSON.parse(fs.readFileSync('./package.json')).version;
  const args = [
    'release',
    'create',
    `v${versionNumber}`,
    ...files.map((name) => path.join('dist', name)),
    '--target',
    'master',
    '--draft',
    '--prerelease',
    '--title',
    versionNumber,
  ];
  console.log('Creating draft release...', args);
  const child = spawn('gh', args);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
})();
