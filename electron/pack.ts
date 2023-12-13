import { build } from 'electron-builder';

await build({
    config: {
        appId: 'com.kaetram.app',
        directories: { buildResources: 'resources' },
        files: ['assets/**/*', 'build/**/*', 'capacitor.config.*', 'app/**/*'],
        // nsis: { allowElevation: true, oneClick: false, allowToChangeInstallationDirectory: true },
        icon: 'assets/appIcon.ico',
        win: { target: 'nsis' },
        mac: { target: 'dmg' },
        linux: { target: 'AppImage' }
    }
});
