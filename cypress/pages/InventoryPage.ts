export class InventoryPage {
  getTitle() {
    return cy.get(".title");
  }

  getItems() {
    return cy.get(".inventory_item");
  }
}
