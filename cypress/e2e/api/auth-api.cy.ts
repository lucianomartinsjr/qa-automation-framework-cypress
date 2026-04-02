import { ApiHelper } from "../../support/api-helper";

const API_URL = Cypress.env("apiBaseUrl");

describe("API - Comments (JSONPlaceholder)", { tags: ["@regression"] }, () => {

  context("GET /comments", () => {
    it("should list all comments", { tags: "@smoke" }, () => {
      ApiHelper.get(`${API_URL}/comments`).then((response) => {
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length(500);
      });
    });

    it("should return a single comment by ID", () => {
      ApiHelper.get(`${API_URL}/comments/1`).then((response) => {
        expect(response.body).to.have.property("id", 1);
        expect(response.body).to.have.all.keys("postId", "id", "name", "email", "body");
      });
    });

    it("should filter comments by postId", () => {
      cy.request({
        method: "GET",
        url: `${API_URL}/comments`,
        qs: { postId: 1 }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length(5);
        response.body.forEach((comment: { postId: number }) => {
          expect(comment.postId).to.eq(1);
        });
      });
    });

    it("should return comments for a specific post (nested route)", () => {
      ApiHelper.get(`${API_URL}/posts/1/comments`).then((response) => {
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length(5);
        response.body.forEach((comment: { postId: number }) => {
          expect(comment.postId).to.eq(1);
        });
      });
    });

    it("should return 404 for non-existent comment", () => {
      ApiHelper.get(`${API_URL}/comments/99999`, 404);
    });
  });

  context("POST /comments", () => {
    it("should create a new comment", () => {
      const newComment = {
        postId: 1,
        name: "Test Comment",
        email: "qa@automation.com",
        body: "This is a test comment from Cypress"
      };

      ApiHelper.post(`${API_URL}/comments`, newComment).then((response) => {
        expect(response.body).to.include(newComment);
        expect(response.body).to.have.property("id");
      });
    });
  });

  context("PUT /comments", () => {
    it("should update a comment completely", () => {
      const updatedComment = {
        postId: 1,
        name: "Updated Comment",
        email: "updated@test.com",
        body: "Updated body content"
      };

      ApiHelper.put(`${API_URL}/comments/1`, updatedComment).then((response) => {
        expect(response.body).to.include(updatedComment);
        expect(response.body).to.have.property("id", 1);
      });
    });
  });

  context("DELETE /comments", () => {
    it("should delete a comment", () => {
      ApiHelper.delete(`${API_URL}/comments/1`);
    });
  });

  context("Response Time", () => {
    it("should respond within acceptable time", () => {
      cy.request("GET", `${API_URL}/comments?postId=1`).then((response) => {
        ApiHelper.assertResponseTime(response, 5000);
      });
    });
  });
});
