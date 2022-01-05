/* eslint-disable no-template-curly-in-string */
module.exports = {
  asar: true,
  appId: 'com.dj-helper.app',
  copyright: `Copyright © ${new Date().getFullYear()} Goosewobbler`,
  productName: 'DJ Helper',
  artifactName: '${name}-${version}-${os}-${arch}.${ext}',
  afterSign: './scripts/notarize.js',
  files: ['bundle/**/*', 'build/**/*'],
  mac: {
    category: 'public.app-category.music',
    icon: 'build/icon.icns',
    hardenedRuntime: true,
    entitlements: './build/entitlements.mac.plist',
    entitlementsInherit: './build/entitlements.mac.plist',
  },
  win: {
    target: 'nsis',
    icon: 'build/icon.ico',
  },
  nsis: {
    deleteAppDataOnUninstall: true,
  },
  linux: {
    category: 'Audio',
    icon: 'build/icon/',
    desktop: {
      StartupWMClass: 'dj helper',
    },
    target: ['AppImage'],
  },
};
