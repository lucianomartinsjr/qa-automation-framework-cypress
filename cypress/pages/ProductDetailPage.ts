import { BasePage } from "./BasePage";

export class ProductDetailPage extends BasePage {
  // ── Selectors ──────────────────────────────────────────────
  private readonly selectors = {
    name: '[data-test="inventory-item-name"]',
    description: '[data-test="inventory-item-desc"]',
    price: '[data-test="inventory-item-price"]',
    addToCartButton: '[data-test^="add-to-cart"]',
    removeButton: '[data-test^="remove"]',
    backButton: '[data-test="back-to-products"]'
  } as const;

  // ── Actions ────────────────────────────────────────────────
  getProductName(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.name);
  }

  getProductDescription(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.description);
  }

  getProductPrice(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.price);
  }

  addToCart(): void {
    cy.get(this.selectors.addToCartButton).click();
  }

  removeFromCart(): void {
    cy.get(this.selectors.removeButton).click();
  }

  goBack(): void {
    cy.get(this.selectors.backButton).click();
  }
}
