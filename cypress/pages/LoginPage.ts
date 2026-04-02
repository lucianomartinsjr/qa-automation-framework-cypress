export class LoginPage {
  visit(): void {
    cy.visit("/");
  }

  fillUsername(username: string): void {
    cy.get("[data-test=\"username\"]").clear().type(username);
  }

  fillPassword(password: string): void {
    cy.get("[data-test=\"password\"]").clear().type(password, { log: false });
  }

  submit(): void {
    cy.get("[data-test=\"login-button\"]").click();
  }

  login(username: string, password: string): void {
    this.fillUsername(username);
    this.fillPassword(password);
    this.submit();
  }

  getErrorMessage() {
    return cy.get("[data-test=\"error\"]");
  }
}
