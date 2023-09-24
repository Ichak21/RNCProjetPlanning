const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1536,
  viewportHeight: 720,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
