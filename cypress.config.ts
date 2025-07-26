import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    specPattern: 'cypress/component/**/*.cy.{js,ts,jsx,tsx}',
    video: true, 
    screenshotOnRunFailure: true, 
  },
});
