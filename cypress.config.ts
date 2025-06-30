import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Increase timeouts for better reliability
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    // Video recording
    video: true,
    // Screenshots on failure
    screenshotOnRunFailure: true,
    // Retry failed tests
    retries: {
      runMode: 2,
      openMode: 1
    }
  }
});
