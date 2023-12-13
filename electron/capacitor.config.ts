import type { CapacitorConfig } from '@capacitor/cli';

export default {
    appId: 'com.kaetram.app',
    appName: 'Kaetram',
    webDir: '../client/dist/',
    backgroundColor: '#000000',
    server: { androidScheme: 'https' }
    // android: { buildOptions: { signingType: 'apksigner' } }
} satisfies CapacitorConfig;
