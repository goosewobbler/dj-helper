import { spawn } from 'child_process';
import { isCI } from 'ci-info';

const appimage = 'appimage';
const appimageX64 = 'appimage-x64';
const appimageArm64 = 'appimage-arm64';
const mac = 'mac';
const macArm64 = 'mac-arm64';
const windows = 'windows';
const availableTargets = [appimage, appimageX64, appimageArm64, mac, macArm64, windows];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runCommand(fullCommand, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    console.log(fullCommand);
    const [command, ...args] = fullCommand.split(' ');
    const options = { env: { ...process.env, ...extraEnv } };
    const child = spawn(command, args, options);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('error', reject);
    child.on('close', (code) => {
      if (code > 0) {
        reject(code);
      } else {
        resolve(code);
      }
    });
  });
}

async function runBuildCommands(archFlags) {
  const extraEnv = {};
  const publishFlag = ` -p ${isCI ? 'onTagOrDraft' : 'never'}`;
  const isArm = archFlags.includes('--arm64');

  if (isArm) {
    extraEnv.npm_config_target_arch = 'arm64';
  }

  await runCommand('pnpm bundle', extraEnv);
  await runCommand(`pnpm electron-builder ${archFlags}${publishFlag}`, extraEnv);
}

async function build(target) {
  console.log(`building ${target}...`);
  await Promise.resolve();
  switch (target) {
    case appimage:
      await runBuildCommands('--linux --ia32 -c.linux.target=AppImage');
      break;
    case appimageX64:
      await runBuildCommands('--linux --x64 -c.linux.target=AppImage');
      break;
    case appimageArm64:
      await runBuildCommands('--linux --arm64 -c.linux.target=AppImage');
      break;
    case mac:
      await runBuildCommands('--mac --x64');
      break;
    case macArm64:
      await runBuildCommands('--mac --arm64');
      break;
    case windows:
      await runBuildCommands('--windows --x64 --ia32');
      break;
  }
}

(async () => {
  try {
    const target = process.argv[2];
    if (target === 'all') {
      await runCommand('pnpm clean:build');
      for (const availableTarget of availableTargets) {
        await build(availableTarget);
        await runCommand('pnpm clean:bundle');
        await delay(1000);
      }
      return;
    } else if (!target) {
      throw Error(`No target specified. Available targets: ${availableTargets.join(', ')}`);
    } else if (!availableTargets.includes(target)) {
      throw Error(`Unknown target '${target}'. Available target: ${availableTargets.join(', ')}`);
    }

    await runCommand('pnpm clean:bundle');
    await build(target);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
