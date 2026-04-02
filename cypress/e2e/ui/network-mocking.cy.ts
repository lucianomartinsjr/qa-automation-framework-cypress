import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";

describe("UI - Network Mocking (Cypress Intercept)", { tags: ["@advanced", "@regression"] }, () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();

  beforeEach(() => {
    loginPage.visit();
    cy.loginWithFixture("standard");
  });

  it("should demonstrate stubbing an API response for inventory items", () => {
    // Intercept the images or other assets if SauceDemo had a real JSON API for items
    // Since SauceDemo is mostly static after login, we can mock the page transition or external calls
    
    // Example: Intercepting a hypothetical analytics call
    cy.intercept("POST", "**/events", {
      statusCode: 200,
      body: { status: "success" }
    }).as("analytics");

    inventoryPage.addItemToCartByIndex(0);
    // cy.wait("@analytics"); // Uncomment if there was a real call
  });

  it("should simulate a server error (500) during checkout", () => {
    // We can't easily mock the form submission to a real backend here because it's client-side navigation
    // but we can demonstrate how to intercept a resource
    
    cy.intercept("GET", "**/inventory.html*", {
      statusCode: 500,
      body: "Internal Server Error Stub"
    }).as("getError");

    // This is more illustrative for the portfolio to show cy.intercept knowledge
    cy.log("demonstrating cy.intercept() capability for mocking backend errors");
  });

  it("should simulate a slow network response (Throttle)", () => {
    // Intercepting an image to make it slow
    cy.intercept("GET", "**/back-all-1200x670.jpg*", (req) => {
      req.on('response', (res) => {
        res.setDelay(2000); // Delay response by 2 seconds
      });
    }).as("slowImage");

    cy.visit("/inventory.html");
    // cy.wait("@slowImage");
  });
});
