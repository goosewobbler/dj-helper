import { spawn } from 'child_process';
import { isCI } from 'ci-info';

const appimage = 'appimage';
const appimageIA32 = 'appimageIA32';
const appimageX64 = 'appimage-x64';
const appimageArm64 = 'appimage-arm64';
const mac = 'mac';
const macX64 = 'mac-x64';
const macArm64 = 'mac-arm64';
const windows = 'windows';
const windowsIA32 = 'windowsIA32';
const windowsX64 = 'windowsx64';
const availableTargets = [
  appimage,
  appimageIA32,
  appimageX64,
  appimageArm64,
  mac,
  macX64,
  macArm64,
  windows,
  windowsIA32,
  windowsX64,
];
const allTargets = [appimage, mac, windows];

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
      await runBuildCommands('--linux --ia32 --x64 --arm64 -c.linux.target=AppImage');
      break;
    case appimageIA32:
      await runBuildCommands('--linux --ia32 -c.linux.target=AppImage');
      break;
    case appimageX64:
      await runBuildCommands('--linux --x64 -c.linux.target=AppImage');
      break;
    case appimageArm64:
      await runBuildCommands('--linux --arm64 -c.linux.target=AppImage');
      break;
    case mac:
      await runBuildCommands('--mac --x64 --arm64');
      break;
    case macX64:
      await runBuildCommands('--mac --x64');
      break;
    case macArm64:
      await runBuildCommands('--mac --arm64');
      break;
    case windows:
      await runBuildCommands('--windows --x64 --ia32');
      break;
    case windowsIA32:
      await runBuildCommands('--windows --ia32');
      break;
    case windowsX64:
      await runBuildCommands('--windows --x64');
      break;
  }
}

(async () => {
  try {
    const target = process.argv[2];
    if (target === 'all') {
      await runCommand('pnpm clean:build');
      for (const targetToBuild of allTargets) {
        await build(targetToBuild);
        await runCommand('pnpm clean:bundle');
        await delay(1000);
      }
      return;
    } else if (!target) {
      throw Error(`No target specified. Available targets: ${[...availableTargets, 'all'].join(', ')}`);
    } else if (!availableTargets.includes(target)) {
      throw Error(`Unknown target '${target}'. Available targets: ${[...availableTargets, 'all'].join(', ')}`);
    }

    await runCommand('pnpm clean:bundle');
    await build(target);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
