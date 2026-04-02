import { defineConfig } from "cypress";

const environments = {
  staging: {
    baseUrl: "https://www.saucedemo.com",
    apiBaseUrl: "https://jsonplaceholder.typicode.com",
    reqresBaseUrl: "https://reqres.in/api"
  },
  production: {
    baseUrl: "https://www.saucedemo.com",
    apiBaseUrl: "https://jsonplaceholder.typicode.com",
    reqresBaseUrl: "https://reqres.in/api"
  }
} as const;

const environmentName =
  (process.env.CYPRESS_ENVIRONMENT?.toLowerCase() as keyof typeof environments) ?? "staging";
const environmentConfig = environments[environmentName] ?? environments.staging;

export default defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  video: true,
  screenshotsFolder: "cypress/artifacts/screenshots",
  videosFolder: "cypress/artifacts/videos",
  defaultCommandTimeout: 10000,
  responseTimeout: 15000,
  requestTimeout: 10000,
  retries: {
    runMode: 2,
    openMode: 0
  },
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportDir: "cypress/reports",
    overwrite: false,
    html: false,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true
  },
  e2e: {
    baseUrl: environmentConfig.baseUrl,
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    env: {
      environment: environmentName,
      apiBaseUrl: environmentConfig.apiBaseUrl,
      reqresBaseUrl: environmentConfig.reqresBaseUrl,
      reqresApiKey: process.env.CYPRESS_REQRES_API_KEY ?? "",
      grepFilterSpecs: true,
      grepOmitFiltered: true
    },
    setupNodeEvents(on, config) {
      const requestedEnvironment = (config.env.environment as string | undefined)?.toLowerCase();
      const selectedEnvironment =
        (requestedEnvironment as keyof typeof environments) ?? environmentName;
      const selectedConfig = environments[selectedEnvironment] ?? environments.staging;

      config.baseUrl = selectedConfig.baseUrl;
      config.env.apiBaseUrl = selectedConfig.apiBaseUrl;
      config.env.reqresBaseUrl = selectedConfig.reqresBaseUrl;
      config.env.environment = selectedEnvironment;

      require("cypress-mochawesome-reporter/plugin")(on);
      require("@cypress/grep/src/plugin")(config);
      return config;
    }
  }
});
