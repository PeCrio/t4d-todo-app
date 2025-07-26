// import { getBaseUrl } from "@/utils/Constants";
import { defineConfig } from "cypress";


// const baseUrl = getBaseUrl();

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    // baseUrl: baseUrl,
    specPattern: 'cypress/component/**/*.cy.{js,ts,jsx,tsx}',
    video: true, 
    screenshotOnRunFailure: true, 
  },
});
