import { ApiHelper } from "../../support/api-helper";
import userSchema from "../../fixtures/schemas/user-schema.json";

const API_URL = Cypress.env("reqresBaseUrl");

describe("API - Users (ReqRes.in)", { tags: ["@regression"] }, () => {

  context("GET /users", () => {
    it("should list users with pagination", { tags: "@smoke" }, () => {
      ApiHelper.get(`${API_URL}/users?page=1`).then((response) => {
        expect(response.body).to.have.property("page", 1);
        expect(response.body).to.have.property("per_page");
        expect(response.body).to.have.property("total");
        expect(response.body).to.have.property("total_pages");
        expect(response.body.data).to.be.an("array").and.have.length.greaterThan(0);
      });
    });

    it("should return second page of users", () => {
      ApiHelper.get(`${API_URL}/users?page=2`).then((response) => {
        expect(response.body).to.have.property("page", 2);
        expect(response.body.data).to.be.an("array");
      });
    });

    it("should validate user schema", () => {
      ApiHelper.get(`${API_URL}/users/2`).then((response) => {
        ApiHelper.validateSchema(response.body.data, userSchema as never);
      });
    });

    it("should return a single user by ID", () => {
      ApiHelper.get(`${API_URL}/users/2`).then((response) => {
        expect(response.body.data).to.have.property("id", 2);
        expect(response.body.data).to.have.property("email");
        expect(response.body.data).to.have.property("first_name");
        expect(response.body.data).to.have.property("last_name");
        expect(response.body.data).to.have.property("avatar");
      });
    });

    it("should return 404 for non-existent user", () => {
      ApiHelper.get(`${API_URL}/users/99999`, 404);
    });
  });

  context("POST /users", () => {
    it("should create a new user", { tags: "@smoke" }, () => {
      const newUser = { name: "QA Engineer", job: "Test Automation" };

      ApiHelper.post(`${API_URL}/users`, newUser).then((response) => {
        expect(response.body).to.have.property("name", newUser.name);
        expect(response.body).to.have.property("job", newUser.job);
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("createdAt");
      });
    });
  });

  context("PUT /users", () => {
    it("should update a user completely", () => {
      const updatedUser = { name: "Senior QA", job: "Lead Automation" };

      ApiHelper.put(`${API_URL}/users/2`, updatedUser).then((response) => {
        expect(response.body).to.have.property("name", updatedUser.name);
        expect(response.body).to.have.property("job", updatedUser.job);
        expect(response.body).to.have.property("updatedAt");
      });
    });
  });

  context("PATCH /users", () => {
    it("should partially update a user", () => {
      const partialUpdate = { name: "Patched Name" };

      ApiHelper.patch(`${API_URL}/users/2`, partialUpdate).then((response) => {
        expect(response.body).to.have.property("name", "Patched Name");
        expect(response.body).to.have.property("updatedAt");
      });
    });
  });

  context("DELETE /users", () => {
    it("should delete a user", () => {
      ApiHelper.delete(`${API_URL}/users/2`, 204);
    });
  });

  context("Response Time", () => {
    it("should respond within acceptable time", () => {
      cy.request("GET", `${API_URL}/users?page=1`).then((response) => {
        ApiHelper.assertResponseTime(response, 5000);
      });
    });
  });
});
