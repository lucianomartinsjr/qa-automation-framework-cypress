import authLoginSchema from "../../fixtures/schemas/auth-login-schema.json";
import authRegisterSchema from "../../fixtures/schemas/auth-register-schema.json";
import { DataFactory } from "../../support/data-factory";

const REQRES_URL = Cypress.env("reqresBaseUrl");
const REQRES_API_KEY = Cypress.env("reqresApiKey") as string;
const hasReqresApiKey = Boolean(REQRES_API_KEY);

function reqresHeaders(): Record<string, string> {
  return { "x-api-key": REQRES_API_KEY };
}

if (!hasReqresApiKey) {
  describe("API - Authentication (ReqRes.in) - Missing API Key", { tags: ["@regression"] }, () => {
    it("should return 401 when login is called without API key", () => {
      cy.apiRequest({
        method: "POST",
        url: `${REQRES_URL}/login`,
        body: { email: "eve.holt@reqres.in", password: "cityslicka" },
        expectedStatus: 401
      });
    });
  });
} else {
  describe("API - Authentication (ReqRes.in)", { tags: ["@smoke", "@regression"] }, () => {
    context("POST /register", () => {
      it("should register successfully with valid credentials", { tags: "@smoke" }, () => {
        const payload = DataFactory.api.userRegistration(true);

        cy.apiRequest({
          method: "POST",
          url: `${REQRES_URL}/register`,
          body: payload,
          headers: reqresHeaders(),
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
          headers: reqresHeaders(),
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
          headers: reqresHeaders(),
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
          headers: reqresHeaders(),
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
          headers: reqresHeaders(),
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
          headers: reqresHeaders(),
          expectedStatus: 400
        }).then((response) => {
          expect(response.body).to.have.property("error", "Missing email or username");
        });
      });
    });
  });
}
