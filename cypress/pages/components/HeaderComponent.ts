export class HeaderComponent {
  // ── Selectors ──────────────────────────────────────────────
  private readonly selectors = {
    burgerMenu: "#react-burger-menu-btn",
    closeMenu: "#react-burger-cross-btn",
    cartLink: ".shopping_cart_link",
    cartBadge: ".shopping_cart_badge",
    menuItems: ".bm-item-list a",
    allItemsLink: "#inventory_sidebar_link",
    aboutLink: "#about_sidebar_link",
    logoutLink: "#logout_sidebar_link",
    resetLink: "#reset_sidebar_link"
  } as const;

  // ── Actions ────────────────────────────────────────────────
  openMenu(): void {
    cy.get(this.selectors.burgerMenu).click();
  }

  closeMenu(): void {
    cy.get(this.selectors.closeMenu).click();
  }

  navigateToAllItems(): void {
    this.openMenu();
    cy.get(this.selectors.allItemsLink).click();
  }

  navigateToAbout(): void {
    this.openMenu();
    cy.get(this.selectors.aboutLink).click();
  }

  logout(): void {
    this.openMenu();
    cy.get(this.selectors.logoutLink).click();
  }

  resetAppState(): void {
    this.openMenu();
    cy.get(this.selectors.resetLink).click();
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

  cartBadgeShouldShow(count: number): void {
    cy.get(this.selectors.cartBadge).should("have.text", count.toString());
  }
}
