export class BasePage {
  /**
   * Waits for the page to finish loading by checking the document ready state.
   */
  waitForPageLoad(): void {
    cy.document().its("readyState").should("eq", "complete");
  }

  /**
   * Returns the current page URL.
   */
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  /**
   * Returns the page title element.
   */
  getPageTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(".title");
  }

  /**
   * Takes a named screenshot for visual documentation.
   */
  takeScreenshot(name: string): void {
    cy.screenshot(name, { capture: "viewport" });
  }

  /**
   * Scrolls to a specific position on the page.
   */
  scrollTo(position: Cypress.PositionType): void;
  scrollTo(x: number, y: number): void;
  scrollTo(positionOrX: Cypress.PositionType | number, y?: number): void {
    if (typeof positionOrX === "number") {
      cy.scrollTo(positionOrX, y ?? 0);
      return;
    }

    cy.scrollTo(positionOrX);
  }

  scrollToBottom(): void {
    this.scrollTo("bottom");
  }

  scrollToTop(): void {
    this.scrollTo("top");
  }
}
