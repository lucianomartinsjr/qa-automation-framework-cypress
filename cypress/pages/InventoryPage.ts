import { BasePage } from "./BasePage";

export type SortOption = "az" | "za" | "lohi" | "hilo";

export class InventoryPage extends BasePage {
  // ── Selectors ──────────────────────────────────────────────
  private readonly selectors = {
    title: ".title",
    inventoryItem: ".inventory_item",
    itemName: ".inventory_item_name",
    itemPrice: ".inventory_item_price",
    itemDescription: ".inventory_item_desc",
    addToCartButton: '[data-test^="add-to-cart"]',
    removeButton: '[data-test^="remove"]',
    sortDropdown: '[data-test="product-sort-container"]',
    cartBadge: ".shopping_cart_badge",
    cartLink: ".shopping_cart_link"
  } as const;

  // ── Actions ────────────────────────────────────────────────
  getTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.title);
  }

  getItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.inventoryItem);
  }

  getItemNames(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.itemName);
  }

  getItemPrices(): Cypress.Chainable<string[]> {
    return cy.get(this.selectors.itemPrice).then(($prices) => {
      return [...$prices].map((el) => el.textContent?.replace("$", "") ?? "0");
    });
  }

  sortBy(option: SortOption): void {
    cy.get(this.selectors.sortDropdown).select(option);
  }

  addItemToCartByIndex(index: number): void {
    cy.get(this.selectors.addToCartButton).eq(index).click();
  }

  addItemToCartByName(productName: string): void {
    cy.get(this.selectors.inventoryItem)
      .contains(this.selectors.itemName, productName)
      .parents(this.selectors.inventoryItem)
      .find(this.selectors.addToCartButton)
      .click();
  }

  removeItemByName(productName: string): void {
    cy.get(this.selectors.inventoryItem)
      .contains(this.selectors.itemName, productName)
      .parents(this.selectors.inventoryItem)
      .find(this.selectors.removeButton)
      .click();
  }

  clickProduct(productName: string): void {
    cy.get(this.selectors.itemName).contains(productName).click();
  }

  goToCart(): void {
    cy.get(this.selectors.cartLink).click();
  }

  // ── Assertions ─────────────────────────────────────────────
  getCartBadge(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.cartBadge);
  }

  cartBadgeShouldNotExist(): void {
    cy.get(this.selectors.cartBadge).should("not.exist");
  }
}
