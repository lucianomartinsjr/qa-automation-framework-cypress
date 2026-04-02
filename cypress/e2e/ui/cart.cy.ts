import { CartPage } from "../../pages/CartPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { LoginPage } from "../../pages/LoginPage";

describe("UI - Cart (SauceDemo)", { tags: ["@regression"] }, () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    loginPage.visit();
    cy.loginWithFixture("standard");
    cy.url().should("include", "/inventory");
  });

  context("Cart Operations", () => {
    it("should display added item in cart", { tags: "@smoke" }, () => {
      inventoryPage.addItemToCartByName("Sauce Labs Backpack");
      inventoryPage.goToCart();

      cy.url().should("include", "/cart");
      cartPage.shouldHaveItems(1);
      cartPage.shouldContainProduct("Sauce Labs Backpack");
    });

    it("should display multiple items in cart", () => {
      inventoryPage.addItemToCartByName("Sauce Labs Backpack");
      inventoryPage.addItemToCartByName("Sauce Labs Bike Light");
      inventoryPage.goToCart();

      cartPage.shouldHaveItems(2);
      cartPage.shouldContainProduct("Sauce Labs Backpack");
      cartPage.shouldContainProduct("Sauce Labs Bike Light");
    });

    it("should remove item from cart", () => {
      inventoryPage.addItemToCartByName("Sauce Labs Backpack");
      inventoryPage.goToCart();

      cartPage.removeItemByName("Sauce Labs Backpack");
      cartPage.shouldBeEmpty();
    });

    it("should return to inventory when clicking continue shopping", () => {
      inventoryPage.addItemToCartByName("Sauce Labs Backpack");
      inventoryPage.goToCart();

      cartPage.continueShopping();
      cy.url().should("include", "/inventory");
    });

    it("should proceed to checkout", () => {
      inventoryPage.addItemToCartByName("Sauce Labs Backpack");
      inventoryPage.goToCart();

      cartPage.proceedToCheckout();
      cy.url().should("include", "/checkout-step-one");
    });

    it("should show empty cart when no items added", () => {
      inventoryPage.goToCart();

      cartPage.shouldBeEmpty();
    });
  });
});
