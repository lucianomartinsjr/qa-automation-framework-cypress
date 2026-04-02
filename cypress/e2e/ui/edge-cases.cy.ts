import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";

describe("UI - Edge Cases (SauceDemo)", { tags: ["@regression", "@advanced"] }, () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();

  it("should keep core flows stable for performance_glitch_user", () => {
    loginPage.visit();

    const start = Date.now();
    cy.loginWithFixture("performance");

    cy.url({ timeout: 30000 }).should("include", "/inventory");
    inventoryPage.getItems().should("have.length", 6);

    cy.then(() => {
      const duration = Date.now() - start;
      expect(duration).to.be.lessThan(30000);
    });
  });

  it("should still allow add/remove cart flow for problem_user", () => {
    loginPage.visit();
    cy.loginWithFixture("problem");

    cy.url().should("include", "/inventory");

    inventoryPage.addItemToCartByName("Sauce Labs Backpack");
    inventoryPage.getCartBadge().should("have.text", "1");

    inventoryPage.removeItemByName("Sauce Labs Backpack");
    inventoryPage.cartBadgeShouldNotExist();
  });
});
