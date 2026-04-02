import authLoginSchema from "../../fixtures/schemas/auth-login-schema.json";
import authRegisterSchema from "../../fixtures/schemas/auth-register-schema.json";
import { DataFactory } from "../../support/data-factory";

const REQRES_URL = Cypress.env("reqresBaseUrl");
const REQRES_API_KEY = Cypress.env("reqresApiKey");

describe("API - Authentication (ReqRes.in)", { tags: ["@smoke", "@regression"] }, () => {
  context("POST /register", () => {
    it("should register successfully with valid credentials", { tags: "@smoke" }, () => {
      const payload = DataFactory.api.userRegistration(true);

      cy.apiRequest({
        method: "POST",
        url: `${REQRES_URL}/register`,
        body: payload,
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 200
      }).then((response) => {
        cy.validateSchema(response.body, authRegisterSchema as Record<string, unknown>);
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("token");
      });
    });

    it("should fail registration without password", () => {
      cy.apiRequest({
        method: "POST",
        url: `${REQRES_URL}/register`,
        body: { email: "sydney@fife" },
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 400
      }).then((response) => {
        expect(response.body).to.have.property("error", "Missing password");
      });
    });

    it("should fail registration without email", () => {
      cy.apiRequest({
        method: "POST",
        url: `${REQRES_URL}/register`,
        body: { password: "pistol" },
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 400
      }).then((response) => {
        expect(response.body).to.have.property("error", "Missing email or username");
      });
    });
  });

  context("POST /login", () => {
    it("should login successfully with valid credentials", { tags: "@smoke" }, () => {
      const payload = DataFactory.api.userLogin(true);

      cy.apiRequest({
        method: "POST",
        url: `${REQRES_URL}/login`,
        body: payload,
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 200
      }).then((response) => {
        cy.validateSchema(response.body, authLoginSchema as Record<string, unknown>);
        expect(response.body).to.have.property("token");
      });
    });

    it("should fail login without password", () => {
      cy.apiRequest({
        method: "POST",
        url: `${REQRES_URL}/login`,
        body: { email: "peter@klaven" },
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 400
      }).then((response) => {
        expect(response.body).to.have.property("error", "Missing password");
      });
    });

    it("should fail login without email", () => {
      cy.apiRequest({
        method: "POST",
        url: `${REQRES_URL}/login`,
        body: { password: "cityslicka" },
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 400
      }).then((response) => {
        expect(response.body).to.have.property("error", "Missing email or username");
      });
    });
  });
});
