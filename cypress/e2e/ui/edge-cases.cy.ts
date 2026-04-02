import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";

describe("UI - Edge Cases (SauceDemo)", { tags: ["@regression", "@advanced"] }, () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();

  it("should keep core flows stable for performance_glitch_user", () => {
    loginPage.visit();

    const start = Date.now();
    cy.loginWithFixture("performance");

    cy.url({ timeout: 45000 }).should("include", "/inventory");
    inventoryPage.getItems().should("have.length", 6);

    cy.then(() => {
      const duration = Date.now() - start;
      // performance_glitch_user is intentionally slower; keep an upper bound
      // that is strict enough for regressions but stable for CI variance.
      expect(duration).to.be.lessThan(60000);
    });
  });

  it("should expose broken cart behavior for problem_user", () => {
    loginPage.visit();
    cy.loginWithFixture("problem");

    cy.url().should("include", "/inventory");

    inventoryPage.addItemToCartByName("Sauce Labs Backpack");
    inventoryPage.getCartBadge().should("have.text", "1");

    inventoryPage.removeItemByName("Sauce Labs Backpack");

    // problem_user is intentionally flaky/broken in SauceDemo.
    // We validate the known issue rather than expecting standard-user behavior.
    inventoryPage.getCartBadge().should("have.text", "1");
  });
});
