import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { LoginPage } from "../../pages/LoginPage";
import { DataFactory } from "../../support/data-factory";

describe("UI - Checkout (SauceDemo)", { tags: ["@regression"] }, () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();

  beforeEach(() => {
    loginPage.visit();
    cy.loginWithFixture("standard");
    inventoryPage.addItemToCartByName("Sauce Labs Backpack");
    inventoryPage.goToCart();
    cartPage.proceedToCheckout();
  });

  context("Happy Path", () => {
    it(
      "should complete a full purchase E2E",
      { tags: "@smoke" },
      () => {
        const info = DataFactory.checkout.validInfo();

        checkoutPage.fillCheckoutInfo(info.firstName, info.lastName, info.postalCode);
        checkoutPage.continueToOverview();

        // Overview step
        cy.url().should("include", "/checkout-step-two");
        checkoutPage.getOverviewItems().should("have.length", 1);
        checkoutPage.getSummaryTotal().should("be.visible");

        checkoutPage.finishOrder();

        // Completion step
        cy.url().should("include", "/checkout-complete");
        checkoutPage.getCompleteHeader().should("contain", "Thank you for your order!");
      }
    );

    it("should return to products after completing order", () => {
      const info = DataFactory.checkout.validInfo();

      checkoutPage.fillCheckoutInfo(info.firstName, info.lastName, info.postalCode);
      checkoutPage.continueToOverview();
      checkoutPage.finishOrder();
      checkoutPage.backToHome();

      cy.url().should("include", "/inventory");
    });
  });

  context("Form Validation", () => {
    it("should show error when first name is empty", () => {
      cy.fixture("checkout-data").then((data) => {
        checkoutPage.fillCheckoutInfo(
          data.missingFirstName.firstName || "{backspace}",
          data.missingFirstName.lastName,
          data.missingFirstName.postalCode
        );
        // Clear first name since empty string doesn't type
        cy.get('[data-test="firstName"]').clear();
        checkoutPage.continueToOverview();

        checkoutPage.getErrorMessage().should("contain", "First Name is required");
      });
    });

    it("should show error when last name is empty", () => {
      cy.fixture("checkout-data").then((data) => {
        checkoutPage.fillCheckoutInfo(
          data.missingLastName.firstName,
          data.missingLastName.lastName || "{backspace}",
          data.missingLastName.postalCode
        );
        cy.get('[data-test="lastName"]').clear();
        checkoutPage.continueToOverview();

        checkoutPage.getErrorMessage().should("contain", "Last Name is required");
      });
    });

    it("should show error when postal code is empty", () => {
      cy.fixture("checkout-data").then((data) => {
        checkoutPage.fillCheckoutInfo(
          data.missingPostalCode.firstName,
          data.missingPostalCode.lastName,
          data.missingPostalCode.postalCode || "{backspace}"
        );
        cy.get('[data-test="postalCode"]').clear();
        checkoutPage.continueToOverview();

        checkoutPage.getErrorMessage().should("contain", "Postal Code is required");
      });
    });

    it("should show error when all fields are empty", () => {
      checkoutPage.continueToOverview();

      checkoutPage.getErrorMessage().should("contain", "First Name is required");
    });
  });

  context("Cancel Checkout", () => {
    it("should return to cart when cancelling", () => {
      checkoutPage.cancelCheckout();

      cy.url().should("include", "/cart");
    });
  });
});
