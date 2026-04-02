import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { ProductDetailPage } from "../../pages/ProductDetailPage";
import { HeaderComponent } from "../../pages/components/HeaderComponent";

describe("UI - Product Details (SauceDemo)", { tags: ["@regression"] }, () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const productDetailPage = new ProductDetailPage();
  const header = new HeaderComponent();

  beforeEach(() => {
    loginPage.visit();
    cy.loginWithFixture("standard");
  });

  it("should display correct product information on details page", () => {
    const productName = "Sauce Labs Backpack";
    
    inventoryPage.clickProduct(productName);
    cy.url().should("include", "/inventory-item");

    productDetailPage.getProductName().should("have.text", productName);
    productDetailPage.getProductDescription().should("not.be.empty");
    productDetailPage.getProductPrice().should("contain", "$");
  });

  it("should add and remove product from cart on details page", () => {
    inventoryPage.clickProduct("Sauce Labs Bike Light");
    
    productDetailPage.addToCart();
    header.cartBadgeShouldShow(1);

    productDetailPage.removeFromCart();
    header.cartBadgeShouldNotExist();
  });

  it("should navigate back to inventory from details page", () => {
    inventoryPage.clickProduct("Sauce Labs Bolt T-Shirt");
    productDetailPage.goBack();
    
    cy.url().should("include", "/inventory");
    inventoryPage.getTitle().should("contain", "Products");
  });
});
