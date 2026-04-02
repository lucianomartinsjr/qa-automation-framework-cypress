interface ApiPayloadsFixture {
  newPost: {
    title: string;
    body: string;
    userId: number;
  };
}

describe("API - JSONPlaceholder", () => {
  it("deve listar posts com sucesso", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiBaseUrl")}/posts`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array").and.have.length.greaterThan(0);
      expect(response.body[0]).to.have.all.keys("userId", "id", "title", "body");
    });
  });

  it("deve criar um novo post usando fixture", () => {
    cy.fixture<ApiPayloadsFixture>("api-payloads").then((payloads) => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiBaseUrl")}/posts`,
        body: payloads.newPost
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.include(payloads.newPost);
        expect(response.body).to.have.property("id");
      });
    });
  });
});
