import { LoginPage } from "../../pages/LoginPage";

describe("UI - Accessibility Audit (SauceDemo)", { tags: ["@a11y", "@regression"] }, () => {
  const loginPage = new LoginPage();

  it("should audit login page accessibility", () => {
    loginPage.visit();
    cy.checkAccessibility();
  });

  it("should audit inventory page accessibility", () => {
    loginPage.visit();
    cy.loginWithFixture("standard");
    cy.url().should("include", "/inventory");

    cy.checkAccessibility();
  });

  it("should audit cart page accessibility", () => {
    loginPage.visit();
    cy.loginWithFixture("standard");
    cy.get('[data-test^="add-to-cart"]').first().click();
    cy.get(".shopping_cart_link").click();

    cy.checkAccessibility();
  });
});
