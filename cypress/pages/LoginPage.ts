import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // ── Selectors ──────────────────────────────────────────────
  private readonly selectors = {
    username: '[data-test="username"]',
    password: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    errorButton: '[data-test="error-button"]'
  } as const;

  // ── Actions ────────────────────────────────────────────────
  visit(): void {
    cy.visit("/");
    this.waitForPageLoad();
  }

  fillUsername(username: string): this {
    cy.get(this.selectors.username).clear().type(username);
    return this;
  }

  fillPassword(password: string): this {
    cy.get(this.selectors.password).clear().type(password, { log: false });
    return this;
  }

  submit(): void {
    cy.get(this.selectors.loginButton).click();
  }

  login(username: string, password: string): void {
    this.fillUsername(username);
    this.fillPassword(password);
    this.submit();
  }

  clearFields(): this {
    cy.get(this.selectors.username).clear();
    cy.get(this.selectors.password).clear();
    return this;
  }

  dismissError(): void {
    cy.get(this.selectors.errorButton).click();
  }

  // ── Assertions ─────────────────────────────────────────────
  getErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.errorMessage);
  }

  getUsernameField(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.username);
  }

  getPasswordField(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.password);
  }

  getLoginButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.loginButton);
  }
}
