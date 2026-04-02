describe("UI - Network Mocking (Cypress Intercept)", { tags: ["@advanced", "@regression"] }, () => {
  it("should simulate a 500 response for inventory page request", () => {
    cy.intercept("GET", "**/inventory.html", {
      statusCode: 500,
      body: "Internal Server Error"
    }).as("inventory500");

    cy.visit("/inventory.html", { failOnStatusCode: false });
    cy.wait("@inventory500").its("response.statusCode").should("eq", 500);
  });

  it("should simulate a 404 response for a missing route", () => {
    cy.intercept("GET", "**/mock-not-found", {
      statusCode: 404,
      body: "Not Found"
    }).as("notFound");

    cy.visit("/mock-not-found", { failOnStatusCode: false });
    cy.wait("@notFound").its("response.statusCode").should("eq", 404);
  });

  it("should simulate slow network on inventory page request", () => {
    cy.intercept("GET", "**/inventory.html", (req) => {
      req.reply({
        statusCode: 200,
        delay: 2000,
        body:
          "<!doctype html><html><head><title>Delayed Inventory</title></head><body>Delayed response</body></html>"
      });
    }).as("slowInventory");

    const start = Date.now();

    cy.visit("/inventory.html", { failOnStatusCode: false });
    cy.wait("@slowInventory").its("response.statusCode").should("eq", 200);
    cy.then(() => {
      const duration = Date.now() - start;
      expect(duration).to.be.greaterThan(1800);
    });
  });
});
