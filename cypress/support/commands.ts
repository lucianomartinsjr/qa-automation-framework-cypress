/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login using SauceDemo credentials.
       */
      login(username: string, password: string): Chainable<void>;

      /**
       * Login using fixture data for a specific user type.
       */
      loginWithFixture(
        userType?: "standard" | "locked" | "problem" | "performance" | "error" | "visual"
      ): Chainable<void>;
    }
  }
}

interface UsersFixture {
  standard: { username: string; password: string };
  locked: { username: string; password: string };
  problem: { username: string; password: string };
  performance: { username: string; password: string };
  error: { username: string; password: string };
  visual: { username: string; password: string };
}

// ── Login Command ────────────────────────────────────────────
Cypress.Commands.add("login", (username: string, password: string) => {
  cy.get('[data-test="username"]').clear().type(username);
  cy.get('[data-test="password"]').clear().type(password, { log: false });
  cy.get('[data-test="login-button"]').click();
});

// ── Login with Fixture ───────────────────────────────────────
Cypress.Commands.add(
  "loginWithFixture",
  (userType: keyof UsersFixture = "standard") => {
    cy.fixture<UsersFixture>("users").then((users) => {
      const user = users[userType];
      cy.login(user.username, user.password);
    });
  }
);

export {};
