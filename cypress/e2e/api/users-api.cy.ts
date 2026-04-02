import reqresSingleUserSchema from "../../fixtures/schemas/reqres-single-user-schema.json";

const REQRES_URL = Cypress.env("reqresBaseUrl");
const REQRES_API_KEY = Cypress.env("reqresApiKey");

describe("API - Users (ReqRes.in)", { tags: ["@regression"] }, () => {
  context("GET /users", () => {
    it("should list users with pagination", { tags: "@smoke" }, () => {
      cy.apiRequest({
        method: "GET",
        url: `${REQRES_URL}/users`,
        qs: { page: 2 },
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 200
      }).then((response) => {
        expect(response.body).to.have.property("page", 2);
        expect(response.body).to.have.property("per_page");
        expect(response.body).to.have.property("total");
        expect(response.body).to.have.property("total_pages");
        expect(response.body.data).to.be.an("array");
        expect(response.body.data).to.have.length.greaterThan(0);
      });
    });

    it("should return a single user by id", { tags: "@smoke" }, () => {
      cy.apiRequest({
        method: "GET",
        url: `${REQRES_URL}/users/2`,
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 200
      }).then((response) => {
        cy.validateSchema(response.body, reqresSingleUserSchema as Record<string, unknown>);
        expect(response.body.data).to.have.property("id", 2);
        expect(response.body.data).to.have.property("email");
      });
    });

    it("should return 404 for user not found", () => {
      cy.apiRequest({
        method: "GET",
        url: `${REQRES_URL}/users/23`,
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 404
      }).then((response) => {
        expect(response.body).to.deep.equal({});
      });
    });
  });

  context("POST /users", () => {
    it("should create a new user", () => {
      cy.apiRequest({
        method: "POST",
        url: `${REQRES_URL}/users`,
        body: { name: "Luciano QA", job: "Automation Engineer" },
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 201
      }).then((response) => {
        expect(response.body).to.include({
          name: "Luciano QA",
          job: "Automation Engineer"
        });
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("createdAt");
      });
    });
  });

  context("PUT /users/{id}", () => {
    it("should update an existing user", () => {
      cy.apiRequest({
        method: "PUT",
        url: `${REQRES_URL}/users/2`,
        body: { name: "Luciano QA", job: "Senior QA Engineer" },
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 200
      }).then((response) => {
        expect(response.body).to.include({
          name: "Luciano QA",
          job: "Senior QA Engineer"
        });
        expect(response.body).to.have.property("updatedAt");
      });
    });
  });

  context("PATCH /users/{id}", () => {
    it("should partially update a user", () => {
      cy.apiRequest({
        method: "PATCH",
        url: `${REQRES_URL}/users/2`,
        body: { job: "QA Architect" },
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 200
      }).then((response) => {
        expect(response.body).to.include({ job: "QA Architect" });
        expect(response.body).to.have.property("updatedAt");
      });
    });
  });

  context("DELETE /users/{id}", () => {
    it("should delete a user", () => {
      cy.apiRequest({
        method: "DELETE",
        url: `${REQRES_URL}/users/2`,
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 204
      });
    });
  });

  context("Performance", () => {
    it("should respond under 5 seconds for list users", () => {
      cy.apiRequest({
        method: "GET",
        url: `${REQRES_URL}/users`,
        qs: { page: 1 },
        headers: { "x-api-key": REQRES_API_KEY },
        expectedStatus: 200
      }).then((response) => {
        expect(response.duration).to.be.lessThan(5000);
      });
    });
  });
});
