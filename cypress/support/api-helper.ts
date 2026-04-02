import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";

const ajv = new Ajv({ allErrors: true });

/**
 * Typed API helper for making requests with built-in assertions.
 */
export const ApiHelper = {
  /**
   * Performs a GET request and validates the response.
   */
  get(url: string, expectedStatus = 200): Cypress.Chainable<Cypress.Response<unknown>> {
    return cy.request({
      method: "GET",
      url,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(expectedStatus);
      return response;
    });
  },

  /**
   * Performs a POST request with body and validates the response.
   */
  post(
    url: string,
    body: Record<string, unknown>,
    expectedStatus = 201
  ): Cypress.Chainable<Cypress.Response<unknown>> {
    return cy.request({
      method: "POST",
      url,
      body,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(expectedStatus);
      return response;
    });
  },

  /**
   * Performs a PUT request with body.
   */
  put(
    url: string,
    body: Record<string, unknown>,
    expectedStatus = 200
  ): Cypress.Chainable<Cypress.Response<unknown>> {
    return cy.request({
      method: "PUT",
      url,
      body,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(expectedStatus);
      return response;
    });
  },

  /**
   * Performs a PATCH request with partial body.
   */
  patch(
    url: string,
    body: Record<string, unknown>,
    expectedStatus = 200
  ): Cypress.Chainable<Cypress.Response<unknown>> {
    return cy.request({
      method: "PATCH",
      url,
      body,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(expectedStatus);
      return response;
    });
  },

  /**
   * Performs a DELETE request.
   */
  delete(url: string, expectedStatus = 200): Cypress.Chainable<Cypress.Response<unknown>> {
    return cy.request({
      method: "DELETE",
      url,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(expectedStatus);
      return response;
    });
  },

  /**
   * Validates response body against a JSON Schema using AJV.
   */
  validateSchema<T>(data: T, schema: JSONSchemaType<T>): void {
    const validate: ValidateFunction<T> = ajv.compile(schema);
    const isValid = validate(data);
    if (!isValid) {
      const errors = validate.errors?.map((e) => `${e.instancePath} ${e.message}`).join(", ");
      throw new Error(`Schema validation failed: ${errors}`);
    }
  },

  /**
   * Asserts response time is within acceptable threshold.
   */
  assertResponseTime(response: Cypress.Response<unknown>, maxMs: number): void {
    expect(response.duration).to.be.lessThan(
      maxMs,
      `Response time ${response.duration}ms exceeds threshold of ${maxMs}ms`
    );
  }
};
