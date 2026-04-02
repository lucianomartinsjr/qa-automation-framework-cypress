declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      loginWithFixture(userType?: "standard" | "locked"): Chainable<void>;
    }
  }
}

interface UsersFixture {
  standard: { username: string; password: string };
  locked: { username: string; password: string };
}

Cypress.Commands.add("login", (username: string, password: string) => {
  cy.get("[data-test=\"username\"]").clear().type(username);
  cy.get("[data-test=\"password\"]").clear().type(password, { log: false });
  cy.get("[data-test=\"login-button\"]").click();
});

Cypress.Commands.add("loginWithFixture", (userType: "standard" | "locked" = "standard") => {
  cy.fixture<UsersFixture>("users").then((users) => {
    const user = users[userType];
    cy.login(user.username, user.password);
  });
});

export {};
