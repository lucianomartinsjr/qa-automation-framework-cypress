import "cypress-axe";

import { LoginPage } from "../../pages/LoginPage";

/**
 * Accessibility tests using cypress-axe (axe-core).
 *
 * SauceDemo is a third-party demo site with known a11y violations.
 * These tests audit the pages and LOG violations without hard-failing,
 * demonstrating the framework's capability and professional approach.
 * In a real project, these would assert zero violations on YOUR codebase.
 */
describe("UI - Accessibility Audit (SauceDemo)", { tags: ["@a11y", "@regression"] }, () => {
  const loginPage = new LoginPage();

  /**
   * Logs accessibility violations in a readable format.
   */
  function logViolations(violations: Cypress.AuditResult[]) {
    violations.forEach((violation) => {
      const nodes = violation.nodes.map((node: { html: string }) => node.html).join("\n  ");
      cy.log(`[${violation.impact?.toUpperCase()}] ${violation.id}: ${violation.description}`);
      cy.log(`  Affected elements:\n  ${nodes}`);
    });
  }

  it("should audit login page accessibility", () => {
    loginPage.visit();
    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        rules: { region: { enabled: false } }
      },
      logViolations,
      true
    );
  });

  it("should audit inventory page accessibility", () => {
    loginPage.visit();
    cy.loginWithFixture("standard");
    cy.url().should("include", "/inventory");
    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        rules: { region: { enabled: false } }
      },
      logViolations,
      true
    );
  });

  it("should audit cart page accessibility", () => {
    loginPage.visit();
    cy.loginWithFixture("standard");
    cy.get('[data-test^="add-to-cart"]').first().click();
    cy.get(".shopping_cart_link").click();
    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        rules: { region: { enabled: false } }
      },
      logViolations,
      true
    );
  });
});
