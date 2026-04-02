import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  // ── Selectors ──────────────────────────────────────────────
  private readonly selectors = {
    firstName: '[data-test="firstName"]',
    lastName: '[data-test="lastName"]',
    postalCode: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',
    cancelButton: '[data-test="cancel"]',
    finishButton: '[data-test="finish"]',
    backHomeButton: '[data-test="back-to-products"]',
    errorMessage: '[data-test="error"]',
    summaryTotal: ".summary_total_label",
    summarySubtotal: ".summary_subtotal_label",
    summaryTax: ".summary_tax_label",
    completeHeader: ".complete-header",
    completeText: ".complete-text",
    checkoutOverviewItem: ".cart_item",
    itemPrice: ".inventory_item_price"
  } as const;

  // ── Step 1: Information ────────────────────────────────────
  fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): void {
    cy.get(this.selectors.firstName).clear().type(firstName);
    cy.get(this.selectors.lastName).clear().type(lastName);
    cy.get(this.selectors.postalCode).clear().type(postalCode);
  }

  continueToOverview(): void {
    cy.get(this.selectors.continueButton).click();
  }

  cancelCheckout(): void {
    cy.get(this.selectors.cancelButton).click();
  }

  // ── Step 2: Overview ───────────────────────────────────────
  getOverviewItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.checkoutOverviewItem);
  }

  getSummaryTotal(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.summaryTotal);
  }

  getSummarySubtotal(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.summarySubtotal);
  }

  getSummaryTax(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.summaryTax);
  }

  finishOrder(): void {
    cy.get(this.selectors.finishButton).click();
  }

  // ── Step 3: Complete ───────────────────────────────────────
  getCompleteHeader(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.completeHeader);
  }

  getCompleteText(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.completeText);
  }

  backToHome(): void {
    cy.get(this.selectors.backHomeButton).click();
  }

  // ── Assertions ─────────────────────────────────────────────
  getErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.errorMessage);
  }
}
