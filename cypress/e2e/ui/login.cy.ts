import { InventoryPage } from "../../pages/InventoryPage";
import { LoginPage } from "../../pages/LoginPage";

describe("UI - Login (SauceDemo)", () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();

  it("deve logar com usuário válido usando fixture + custom command", () => {
    loginPage.visit();
    cy.loginWithFixture("standard");

    cy.url().should("include", "/inventory");
    inventoryPage.getTitle().should("contain", "Products");
    inventoryPage.getItems().should("have.length.greaterThan", 0);
  });

  it("deve exibir erro para usuário bloqueado", () => {
    loginPage.visit();
    cy.loginWithFixture("locked");

    loginPage
      .getErrorMessage()
      .should("be.visible")
      .and("contain", "Sorry, this user has been locked out.");
  });
});
