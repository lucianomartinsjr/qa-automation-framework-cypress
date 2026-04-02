import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  // ── Selectors ──────────────────────────────────────────────
  private readonly selectors = {
    cartItem: ".cart_item",
    itemName: ".inventory_item_name",
    itemPrice: ".cart_item .inventory_item_price",
    itemQuantity: ".cart_quantity",
    removeButton: '[data-test^="remove"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
    checkoutButton: '[data-test="checkout"]',
    title: ".title"
  } as const;

  // ── Actions ────────────────────────────────────────────────
  getCartItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.cartItem);
  }

  getItemNames(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.itemName);
  }

  removeItemByName(productName: string): void {
    cy.get(this.selectors.cartItem)
      .contains(this.selectors.itemName, productName)
      .parents(this.selectors.cartItem)
      .find(this.selectors.removeButton)
      .click();
  }

  continueShopping(): void {
    cy.get(this.selectors.continueShoppingButton).click();
  }

  proceedToCheckout(): void {
    cy.get(this.selectors.checkoutButton).click();
  }

  // ── Assertions ─────────────────────────────────────────────
  shouldHaveItems(count: number): void {
    cy.get(this.selectors.cartItem).should("have.length", count);
  }

  shouldBeEmpty(): void {
    cy.get(this.selectors.cartItem).should("not.exist");
  }

  shouldContainProduct(productName: string): void {
    cy.get(this.selectors.itemName).should("contain", productName);
  }
}
