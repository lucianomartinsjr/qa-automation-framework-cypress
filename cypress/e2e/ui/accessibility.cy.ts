import { LoginPage } from "../../pages/LoginPage";

describe("UI - Accessibility (SauceDemo)", { tags: ["@a11y", "@regression"] }, () => {
  const loginPage = new LoginPage();

  it("should have no critical accessibility violations on login page", () => {
    loginPage.visit();

    cy.checkAccessibility(undefined, {
      rules: {
        // Only fail on critical/serious violations
        region: { enabled: false }
      }
    });
  });

  it("should have no critical accessibility violations on inventory page", () => {
    loginPage.visit();
    cy.loginWithFixture("standard");
    cy.url().should("include", "/inventory");

    cy.checkAccessibility(undefined, {
      rules: {
        region: { enabled: false }
      }
    });
  });

  it("should have no critical accessibility violations on cart page", () => {
    loginPage.visit();
    cy.loginWithFixture("standard");
    cy.get('[data-test^="add-to-cart"]').first().click();
    cy.get(".shopping_cart_link").click();

    cy.checkAccessibility(undefined, {
      rules: {
        region: { enabled: false }
      }
    });
  });
});
