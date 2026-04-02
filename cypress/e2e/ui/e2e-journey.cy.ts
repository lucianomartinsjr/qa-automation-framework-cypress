import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { HeaderComponent } from "../../pages/components/HeaderComponent";
import { DataFactory } from "../../support/data-factory";

describe("UI - E2E Full Journey (SauceDemo)", { tags: ["@smoke", "@regression"] }, () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();
  const header = new HeaderComponent();

  it("should complete a full purchase journey from login to confirmation", { tags: "@smoke" }, () => {
    // 1. Login
    loginPage.visit();
    cy.loginWithFixture("standard");
    cy.url().should("include", "/inventory");

    // 2. Add multiple items to cart
    inventoryPage.addItemToCartByName("Sauce Labs Backpack");
    inventoryPage.addItemToCartByName("Sauce Labs Bolt T-Shirt");
    header.cartBadgeShouldShow(2);

    // 3. Review cart
    header.goToCart();
    cy.url().should("include", "/cart");
    cartPage.shouldHaveItems(2);
    cartPage.shouldContainProduct("Sauce Labs Backpack");
    cartPage.shouldContainProduct("Sauce Labs Bolt T-Shirt");

    // 4. Checkout: Information
    cartPage.proceedToCheckout();
    cy.url().should("include", "/checkout-step-one");
    
    const shippingInfo = DataFactory.checkout.validInfo();
    checkoutPage.fillCheckoutInfo(
      shippingInfo.firstName,
      shippingInfo.lastName,
      shippingInfo.postalCode
    );
    checkoutPage.continueToOverview();

    // 5. Checkout: Overview
    cy.url().should("include", "/checkout-step-two");
    checkoutPage.getOverviewItems().should("have.length", 2);
    checkoutPage.getSummaryTotal().should("contain", "Total: $");
    
    // 6. Finish Order
    checkoutPage.finishOrder();

    // 7. Complete
    cy.url().should("include", "/checkout-complete");
    checkoutPage.getCompleteHeader().should("contain", "Thank you for your order!");
    checkoutPage.getCompleteText().should("contain", "Your order has been dispatched");
    
    // 8. Back to Home
    checkoutPage.backToHome();
    cy.url().should("include", "/inventory");
    header.cartBadgeShouldNotExist();
  });
});
