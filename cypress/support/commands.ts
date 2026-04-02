/* eslint-disable @typescript-eslint/no-namespace */
import Ajv from "ajv";
import "cypress-axe";

const ajv = new Ajv({ allErrors: true });

type UserType = "standard" | "locked" | "problem" | "performance" | "error" | "visual";
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface UsersFixture {
  standard: { username: string; password: string };
  locked: { username: string; password: string };
  problem: { username: string; password: string };
  performance: { username: string; password: string };
  error: { username: string; password: string };
  visual: { username: string; password: string };
}

interface ApiRequestOptions {
  method: HttpMethod;
  url: string;
  body?: unknown;
  qs?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  expectedStatus?: number;
}

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
      loginWithFixture(userType?: UserType): Chainable<void>;

      /**
       * Performs a typed API request with built-in status assertion.
       */
      apiRequest(options: ApiRequestOptions): Chainable<Cypress.Response<unknown>>;

      /**
       * Validates response payload against JSON schema.
       */
      validateSchema(data: unknown, schema: Record<string, unknown>): Chainable<void>;

      /**
       * Runs accessibility audit and logs violations without failing tests.
       */
      checkAccessibility(options?: Record<string, unknown>): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (username: string, password: string) => {
  cy.get('[data-test="username"]').clear();
  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').clear();
  cy.get('[data-test="password"]').type(password, { log: false });
  cy.get('[data-test="login-button"]').click();
});

Cypress.Commands.add("loginWithFixture", (userType: UserType = "standard") => {
  cy.fixture<UsersFixture>("users").then((users) => {
    const user = users[userType];
    cy.login(user.username, user.password);
  });
});

Cypress.Commands.add("apiRequest", (options: ApiRequestOptions) => {
  const { expectedStatus = 200, ...requestOptions } = options;

  return cy
    .request({
      ...requestOptions,
      failOnStatusCode: false
    })
    .then((response) => {
      expect(response.status).to.eq(expectedStatus);
      return response;
    });
});

Cypress.Commands.add("validateSchema", (data: unknown, schema: Record<string, unknown>) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const errors = validate.errors?.map((error) => `${error.instancePath} ${error.message}`).join(", ");
    throw new Error(`Schema validation failed: ${errors}`);
  }

  return cy.wrap(undefined, { log: false });
});

Cypress.Commands.add("checkAccessibility", (options: Record<string, unknown> = { rules: { region: { enabled: false } } }) => {
  cy.injectAxe();

  cy.checkA11y(
    undefined,
    options as never,
    (violations) => {
      violations.forEach((violation) => {
        const affectedNodes = violation.nodes.map((node) => node.html).join("\n  ");
        cy.log(`[${violation.impact ?? "UNKNOWN"}] ${violation.id}: ${violation.description}`);
        cy.log(`Affected elements:\n  ${affectedNodes}`);
      });
    },
    true
  );

  return cy.wrap(undefined, { log: false });
});

export {};
