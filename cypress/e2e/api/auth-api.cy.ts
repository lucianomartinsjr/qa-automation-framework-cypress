import { ApiHelper } from "../../support/api-helper";
import { DataFactory } from "../../support/data-factory";
import authSchema from "../../fixtures/schemas/auth-schema.json";

const API_URL = Cypress.env("reqresBaseUrl");

describe("API - Authentication (ReqRes.in)", { tags: ["@smoke", "@regression"] }, () => {

  context("POST /register", () => {
    it("should register a user successfully", { tags: "@smoke" }, () => {
      const user = DataFactory.api.userRegistration(true);

      ApiHelper.post(`${API_URL}/register`, user, 200).then((response) => {
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("token");
        ApiHelper.validateSchema(response.body, authSchema as never);
      });
    });

    it("should fail registration without password", () => {
      const invalidUser = { email: "sydney@fife" };

      ApiHelper.post(`${API_URL}/register`, invalidUser, 400).then((response) => {
        expect(response.body).to.have.property("error");
        expect(response.body.error).to.eq("Missing password");
      });
    });

    it("should fail registration without email", () => {
      const invalidUser = { password: "pistol" };

      ApiHelper.post(`${API_URL}/register`, invalidUser, 400).then((response) => {
        expect(response.body).to.have.property("error");
        expect(response.body.error).to.eq("Missing email or username");
      });
    });
  });

  context("POST /login", () => {
    it("should login successfully with valid credentials", { tags: "@smoke" }, () => {
      const user = DataFactory.api.userLogin(true);

      ApiHelper.post(`${API_URL}/login`, user, 200).then((response) => {
        expect(response.body).to.have.property("token");
        expect(response.body.token).to.be.a("string").and.not.be.empty;
      });
    });

    it("should fail login without password", () => {
      const invalidUser = { email: "peter@klaven" };

      ApiHelper.post(`${API_URL}/login`, invalidUser, 400).then((response) => {
        expect(response.body).to.have.property("error");
        expect(response.body.error).to.eq("Missing password");
      });
    });

    it("should fail login without email", () => {
      const invalidUser = { password: "cityslicka" };

      ApiHelper.post(`${API_URL}/login`, invalidUser, 400).then((response) => {
        expect(response.body).to.have.property("error");
        expect(response.body.error).to.eq("Missing email or username");
      });
    });
  });
});
