import { ApiHelper } from "../../support/api-helper";
import userSchema from "../../fixtures/schemas/user-schema.json";

const API_URL = Cypress.env("apiBaseUrl");

describe("API - Users (JSONPlaceholder)", { tags: ["@regression"] }, () => {

  context("GET /users", () => {
    it("should list all users", { tags: "@smoke" }, () => {
      ApiHelper.get(`${API_URL}/users`).then((response) => {
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length(10);
      });
    });

    it("should validate user schema", () => {
      ApiHelper.get(`${API_URL}/users/1`).then((response) => {
        ApiHelper.validateSchema(response.body, userSchema as never);
      });
    });

    it("should return a single user by ID", () => {
      ApiHelper.get(`${API_URL}/users/1`).then((response) => {
        expect(response.body).to.have.property("id", 1);
        expect(response.body).to.have.property("name");
        expect(response.body).to.have.property("username");
        expect(response.body).to.have.property("email");
        expect(response.body).to.have.property("address");
        expect(response.body).to.have.property("phone");
        expect(response.body).to.have.property("website");
        expect(response.body).to.have.property("company");
      });
    });

    it("should return 404 for non-existent user", () => {
      ApiHelper.get(`${API_URL}/users/99999`, 404);
    });
  });

  context("POST /users", () => {
    it("should create a new user", { tags: "@smoke" }, () => {
      const newUser = { name: "QA Engineer", username: "qa_auto", email: "qa@test.com" };

      ApiHelper.post(`${API_URL}/users`, newUser).then((response) => {
        expect(response.body).to.have.property("name", newUser.name);
        expect(response.body).to.have.property("username", newUser.username);
        expect(response.body).to.have.property("email", newUser.email);
        expect(response.body).to.have.property("id");
      });
    });
  });

  context("PUT /users", () => {
    it("should update a user completely", () => {
      const updatedUser = { name: "Senior QA", username: "senior_qa", email: "senior@test.com" };

      ApiHelper.put(`${API_URL}/users/1`, updatedUser).then((response) => {
        expect(response.body).to.have.property("name", updatedUser.name);
        expect(response.body).to.have.property("username", updatedUser.username);
        expect(response.body).to.have.property("email", updatedUser.email);
      });
    });
  });

  context("PATCH /users", () => {
    it("should partially update a user", () => {
      const partialUpdate = { name: "Patched Name" };

      ApiHelper.patch(`${API_URL}/users/1`, partialUpdate).then((response) => {
        expect(response.body).to.have.property("name", "Patched Name");
        expect(response.body).to.have.property("id", 1);
      });
    });
  });

  context("DELETE /users", () => {
    it("should delete a user", () => {
      ApiHelper.delete(`${API_URL}/users/1`);
    });
  });

  context("Nested Resources", () => {
    it("should list posts for a specific user", () => {
      ApiHelper.get(`${API_URL}/users/1/posts`).then((response) => {
        expect(response.body).to.be.an("array");
        response.body.forEach((post: { userId: number }) => {
          expect(post.userId).to.eq(1);
        });
      });
    });

    it("should list todos for a specific user", () => {
      ApiHelper.get(`${API_URL}/users/1/todos`).then((response) => {
        expect(response.body).to.be.an("array");
        response.body.forEach((todo: { userId: number }) => {
          expect(todo.userId).to.eq(1);
        });
      });
    });
  });

  context("Response Time", () => {
    it("should respond within acceptable time", () => {
      cy.request("GET", `${API_URL}/users`).then((response) => {
        ApiHelper.assertResponseTime(response, 5000);
      });
    });
  });
});
