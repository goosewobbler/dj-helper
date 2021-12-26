import fs from 'fs';

export async function getLatestBuiltFilesList() {
  const packageJson = await fs.promises.readFile('./package.json');
  const version = JSON.parse(packageJson).version;
  return [
    `dj-helper-${version}-mac-x64.zip`,
    `dj-helper-${version}-mac-x64.dmg`,
    `dj-helper-${version}-mac-x64.dmg.blockmap`,

    `dj-helper-${version}-mac-arm64.zip`,
    `dj-helper-${version}-mac-arm64.dmg`,
    `dj-helper-${version}-mac-arm64.dmg.blockmap`,

    `dj-helper-${version}-linux-i386.AppImage`,
    `dj-helper-${version}-linux-x86_64.AppImage`,
    `dj-helper-${version}-linux-arm64.AppImage`,

    `dj-helper-${version}-win.exe`,
    `dj-helper-${version}-win.exe.blockmap`,

    'latest-linux-ia32.yml',
    'latest-linux.yml',
    'latest-linux-arm64.yml',
    'latest-mac.yml',
    'latest.yml',
    // 'builder-effective-config.yaml',
  ];
}
