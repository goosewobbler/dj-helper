const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { notarize } = require('@electron/notarize');

module.exports = async (context) => {
  const {
    platformName,
    appOutDir,
    packager: { appInfo },
  } = context;
  // Only notarize the app on macOS.
  if (platformName !== 'darwin') {
    return;
  }
  console.log('afterSign hook triggered');

  const { appId } = JSON.parse(await fs.promises.readFile('./electron-builder.json'));

  const appPath = path.join(appOutDir, `${appInfo.productFilename}.app`);
  await fs.promises.access(appPath);

  console.log(`Notarizing ${appId} found at ${appPath}`);

  try {
    const appleIdPassword = `@keychain:AC_PASSWORD`;
    await notarize({
      appBundleId: appId,
      appPath,
      appleId: execSync('mas account'),
      appleIdPassword,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  console.log(`Done notarizing ${appId}`);
};
