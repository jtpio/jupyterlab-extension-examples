import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    // Browser options
    // headless: false,
    slowMo: 500,

    // Context options
    // viewport: { width: 1280, height: 720 },

    // Artifacts
    video: 'on',
  },
};

export default config;
