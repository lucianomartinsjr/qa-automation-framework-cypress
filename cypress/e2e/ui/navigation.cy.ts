import { LoginPage } from "../../pages/LoginPage";
import { HeaderComponent } from "../../pages/components/HeaderComponent";

describe("UI - Navigation (SauceDemo)", { tags: ["@regression"] }, () => {
  const loginPage = new LoginPage();
  const header = new HeaderComponent();

  beforeEach(() => {
    loginPage.visit();
    cy.loginWithFixture("standard");
    cy.url().should("include", "/inventory");
  });

  context("Sidebar Menu", () => {
    it("should open and close the sidebar menu", () => {
      header.openMenu();
      cy.get(".bm-menu-wrap").should("be.visible");

      header.closeMenu();
      cy.get(".bm-menu-wrap").should("not.be.visible");
    });

    it("should navigate to All Items from sidebar", () => {
      // Navigate to cart first, then back
      header.goToCart();
      cy.url().should("include", "/cart");

      header.navigateToAllItems();
      cy.url().should("include", "/inventory");
    });
  });

  context("Logout", () => {
    it("should logout successfully", { tags: "@smoke" }, () => {
      header.logout();

      cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
      loginPage.getUsernameField().should("be.visible");
    });
  });

  context("Cart Navigation", () => {
    it("should navigate to cart page", () => {
      header.goToCart();

      cy.url().should("include", "/cart");
    });

    it("should display cart badge after adding item", () => {
      cy.get('[data-test^="add-to-cart"]').first().click();

      header.cartBadgeShouldShow(1);
    });

    it("should update cart badge when adding multiple items", () => {
      cy.get('[data-test^="add-to-cart"]').eq(0).click();
      cy.get('[data-test^="add-to-cart"]').eq(0).click();

      header.cartBadgeShouldShow(2);
    });
  });

  context("Reset App State", () => {
    it("should reset cart when resetting app state", () => {
      cy.get('[data-test^="add-to-cart"]').first().click();
      header.cartBadgeShouldShow(1);

      header.resetAppState();
      header.closeMenu();

      header.cartBadgeShouldNotExist();
    });
  });
});
