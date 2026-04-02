import { ApiHelper } from "../../support/api-helper";
import { DataFactory } from "../../support/data-factory";
import postSchema from "../../fixtures/schemas/post-schema.json";

const API_URL = Cypress.env("apiBaseUrl");

describe("API - Posts (JSONPlaceholder)", { tags: ["@smoke", "@regression"] }, () => {

  context("GET /posts", () => {
    it("should list all posts", { tags: "@smoke" }, () => {
      ApiHelper.get(`${API_URL}/posts`).then((response) => {
        expect(response.body).to.be.an("array").and.have.length.greaterThan(0);
        expect(response.body).to.have.length(100);
      });
    });

    it("should validate post schema", { tags: "@smoke" }, () => {
      ApiHelper.get(`${API_URL}/posts/1`).then((response) => {
        ApiHelper.validateSchema(response.body, postSchema as never);
      });
    });

    it("should return post by ID", () => {
      ApiHelper.get(`${API_URL}/posts/1`).then((response) => {
        expect(response.body).to.have.property("id", 1);
        expect(response.body).to.have.all.keys("userId", "id", "title", "body");
      });
    });

    it("should return 404 for non-existent post", () => {
      ApiHelper.get(`${API_URL}/posts/99999`, 404);
    });

    it("should filter posts by userId query parameter", () => {
      cy.request({
        method: "GET",
        url: `${API_URL}/posts`,
        qs: { userId: 1 }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
        response.body.forEach((post: { userId: number }) => {
          expect(post.userId).to.eq(1);
        });
      });
    });

    it("should respond within acceptable time", () => {
      cy.request("GET", `${API_URL}/posts`).then((response) => {
        ApiHelper.assertResponseTime(response, 5000);
      });
    });
  });

  context("POST /posts", () => {
    it("should create a new post with fixture data", () => {
      cy.fixture("api-payloads").then((payloads) => {
        ApiHelper.post(`${API_URL}/posts`, payloads.newPost).then((response) => {
          expect(response.body).to.include(payloads.newPost);
          expect(response.body).to.have.property("id");
        });
      });
    });

    it("should create a new post with dynamic data", { tags: "@smoke" }, () => {
      const newPost = DataFactory.api.newPost();

      ApiHelper.post(`${API_URL}/posts`, newPost).then((response) => {
        expect(response.body).to.include(newPost);
        expect(response.body).to.have.property("id");
      });
    });
  });

  context("PUT /posts", () => {
    it("should update an existing post completely", () => {
      const updatedPost = DataFactory.api.updatedPost();

      ApiHelper.put(`${API_URL}/posts/1`, updatedPost).then((response) => {
        expect(response.body).to.include(updatedPost);
        expect(response.body).to.have.property("id", 1);
      });
    });
  });

  context("PATCH /posts", () => {
    it("should partially update an existing post", () => {
      const partialUpdate = { title: "Patched Title" };

      ApiHelper.patch(`${API_URL}/posts/1`, partialUpdate).then((response) => {
        expect(response.body).to.have.property("title", "Patched Title");
        expect(response.body).to.have.property("id", 1);
      });
    });
  });

  context("DELETE /posts", () => {
    it("should delete an existing post", () => {
      ApiHelper.delete(`${API_URL}/posts/1`);
    });
  });
});
