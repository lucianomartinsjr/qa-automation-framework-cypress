import "./commands";
import "cypress-mochawesome-reporter/register";
import "@cypress/grep";
import "cypress-axe";

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

afterEach(function onAfterEach() {
  if (this.currentTest?.state === "failed") {
    const testName = this.currentTest.title.replace(/\s+/g, "-").toLowerCase();
    cy.screenshot(`failure-${testName}`);
  }
});
