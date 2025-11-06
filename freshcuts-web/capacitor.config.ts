import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.freshcuts.app',
  appName: 'FreshCuts',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;