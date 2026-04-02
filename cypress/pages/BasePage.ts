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
  scrollToBottom(): void {
    cy.scrollTo("bottom");
  }

  scrollToTop(): void {
    cy.scrollTo("top");
  }
}
