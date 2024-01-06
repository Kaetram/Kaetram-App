import { KeyboardResize } from '@capacitor/keyboard';

import type { CapacitorConfig } from '@capacitor/cli';

export default {
    appId: 'com.kaetram.app',
    appName: 'Kaetram',
    webDir: '../client/dist/',
    backgroundColor: '#000000',
    server: { androidScheme: 'https' },
    plugins: {
        Keyboard: {
            resize: KeyboardResize.Body,
            resizeOnFullScreen: true
        }
    }
    // android: { buildOptions: { signingType: 'apksigner' } }
} satisfies CapacitorConfig;
