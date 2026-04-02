import { LoginPage } from "../../pages/LoginPage";

describe("UI - Network Mocking (Cypress Intercept)", { tags: ["@advanced", "@regression"] }, () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it("should simulate a 500 error for login request", () => {
    cy.intercept("POST", "**/v1/login", {
      statusCode: 500,
      body: { error: "Internal Server Error" }
    }).as("login500");

    cy.loginWithFixture("standard");
    cy.wait("@login500").its("response.statusCode").should("eq", 500);

    loginPage.getErrorMessage().should("be.visible");
  });

  it("should simulate a 404 error for login endpoint", () => {
    cy.intercept("POST", "**/v1/login", {
      statusCode: 404,
      body: { error: "Not Found" }
    }).as("login404");

    cy.loginWithFixture("standard");
    cy.wait("@login404").its("response.statusCode").should("eq", 404);

    loginPage.getErrorMessage().should("be.visible");
  });

  it("should simulate slow network for login and still complete authentication", () => {
    cy.intercept("POST", "**/v1/login", (request) => {
      request.on("response", (response) => {
        response.setDelay(2000);
      });
    }).as("slowLogin");

    cy.loginWithFixture("standard");
    cy.wait("@slowLogin").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/inventory");
  });
});
