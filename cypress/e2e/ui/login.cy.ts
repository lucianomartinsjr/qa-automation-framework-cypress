import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";

describe("UI - Login (SauceDemo)", { tags: ["@smoke", "@regression"] }, () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();

  beforeEach(() => {
    loginPage.visit();
  });

  context("Successful Login", () => {
    it("should login with standard user using fixture", { tags: "@smoke" }, () => {
      cy.loginWithFixture("standard");

      cy.url().should("include", "/inventory");
      inventoryPage.getTitle().should("contain", "Products");
      inventoryPage.getItems().should("have.length.greaterThan", 0);
    });

    it("should login with performance glitch user", { tags: "@regression" }, () => {
      cy.loginWithFixture("performance");

      cy.url().should("include", "/inventory");
      inventoryPage.getTitle().should("contain", "Products");
    });

    it("should login with visual user", { tags: "@regression" }, () => {
      cy.loginWithFixture("visual");

      cy.url().should("include", "/inventory");
      inventoryPage.getTitle().should("contain", "Products");
    });
  });

  context("Failed Login", () => {
    it("should display error for locked out user", { tags: "@smoke" }, () => {
      cy.loginWithFixture("locked");

      loginPage
        .getErrorMessage()
        .should("be.visible")
        .and("contain", "Sorry, this user has been locked out.");
    });

    it("should display error when username is empty", { tags: "@regression" }, () => {
      loginPage.fillPassword("secret_sauce");
      loginPage.submit();

      loginPage.getErrorMessage().should("be.visible").and("contain", "Username is required");
    });

    it("should display error when password is empty", { tags: "@regression" }, () => {
      loginPage.fillUsername("standard_user");
      loginPage.submit();

      loginPage.getErrorMessage().should("be.visible").and("contain", "Password is required");
    });

    it("should display error when both fields are empty", { tags: "@regression" }, () => {
      loginPage.submit();

      loginPage.getErrorMessage().should("be.visible").and("contain", "Username is required");
    });

    it("should display error for invalid credentials", { tags: "@regression" }, () => {
      loginPage.login("invalid_user", "invalid_password");

      loginPage
        .getErrorMessage()
        .should("be.visible")
        .and("contain", "Username and password do not match");
    });
  });

  context("Login Page Elements", () => {
    it("should display login form elements correctly", { tags: "@regression" }, () => {
      loginPage.getUsernameField().should("be.visible").and("have.attr", "placeholder", "Username");
      loginPage.getPasswordField().should("be.visible").and("have.attr", "placeholder", "Password");
      loginPage.getLoginButton().should("be.visible").and("have.value", "Login");
    });
  });
});
