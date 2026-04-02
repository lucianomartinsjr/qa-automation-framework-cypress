import { InventoryPage } from "../../pages/InventoryPage";
import { LoginPage } from "../../pages/LoginPage";

describe("UI - Inventory (SauceDemo)", { tags: ["@regression"] }, () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();

  beforeEach(() => {
    loginPage.visit();
    cy.loginWithFixture("standard");
    cy.url().should("include", "/inventory");
  });

  context("Product Listing", () => {
    it("should display all 6 products", { tags: "@smoke" }, () => {
      inventoryPage.getItems().should("have.length", 6);
    });

    it("should display product names, descriptions, and prices", () => {
      inventoryPage.getItems().each(($item) => {
        cy.wrap($item).find(".inventory_item_name").should("not.be.empty");
        cy.wrap($item).find(".inventory_item_desc").should("not.be.empty");
        cy.wrap($item).find(".inventory_item_price").should("not.be.empty");
      });
    });
  });

  context("Sorting", () => {
    it("should sort products by name A to Z", () => {
      inventoryPage.sortBy("az");

      inventoryPage.getItemNames().then(($names) => {
        const names = [...$names].map((el) => el.textContent ?? "");
        const sorted = [...names].sort();
        expect(names).to.deep.equal(sorted);
      });
    });

    it("should sort products by name Z to A", () => {
      inventoryPage.sortBy("za");

      inventoryPage.getItemNames().then(($names) => {
        const names = [...$names].map((el) => el.textContent ?? "");
        const sorted = [...names].sort().reverse();
        expect(names).to.deep.equal(sorted);
      });
    });

    it("should sort products by price low to high", () => {
      inventoryPage.sortBy("lohi");

      inventoryPage.getItemPrices().then((prices) => {
        const numPrices = prices.map(Number);
        const sorted = [...numPrices].sort((a, b) => a - b);
        expect(numPrices).to.deep.equal(sorted);
      });
    });

    it("should sort products by price high to low", () => {
      inventoryPage.sortBy("hilo");

      inventoryPage.getItemPrices().then((prices) => {
        const numPrices = prices.map(Number);
        const sorted = [...numPrices].sort((a, b) => b - a);
        expect(numPrices).to.deep.equal(sorted);
      });
    });
  });

  context("Add to Cart", () => {
    it("should add a product to cart and show badge", { tags: "@smoke" }, () => {
      inventoryPage.addItemToCartByName("Sauce Labs Backpack");

      inventoryPage.getCartBadge().should("have.text", "1");
    });

    it("should add multiple products to cart", () => {
      inventoryPage.addItemToCartByName("Sauce Labs Backpack");
      inventoryPage.addItemToCartByName("Sauce Labs Bike Light");

      inventoryPage.getCartBadge().should("have.text", "2");
    });

    it("should remove a product from inventory page", () => {
      inventoryPage.addItemToCartByName("Sauce Labs Backpack");
      inventoryPage.getCartBadge().should("have.text", "1");

      inventoryPage.removeItemByName("Sauce Labs Backpack");
      inventoryPage.cartBadgeShouldNotExist();
    });
  });

  context("Product Details", () => {
    it("should navigate to product detail page", () => {
      inventoryPage.clickProduct("Sauce Labs Backpack");

      cy.url().should("include", "/inventory-item");
      cy.get('[data-test="inventory-item-name"]').should("contain", "Sauce Labs Backpack");
    });
  });
});
