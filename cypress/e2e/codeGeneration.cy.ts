describe("Code Generation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("generates and switches between HTML & CSS code", () => {
    cy.get("[data-testid='view-code']").click();

    cy.get("[data-testid='code-generator']").should("be.visible");

    cy.get("[data-testid='code-block']").within(() => {
      cy.get("code").should("contain.text", '<div class="container">');
    });

    cy.get("[data-testid='css-btn']").click();
    cy.get("[data-testid='code-block']").within(() => {
      cy.get("code").should("contain.text", "display: grid;");
    });

    cy.get("[data-testid='html-btn']").click();
    cy.get("[data-testid='code-block']").within(() => {
      cy.get("code").should("contain.text", '<div class="container">');
    });

    cy.get("[data-testid='close-modal']").click();
    cy.get("[data-testid='code-generator']").should("not.exist");
  });

  it("includes all the properties in the generated code", () => {
    // Set a row-gap and a column-gap
    cy.get("#rowGap").clear().type("12").blur();
    cy.get("#columnGap").clear().type("14").blur();

    // Add two new areas to the grid
    cy.get("[data-testid='cell']").first().click();
    cy.get("[data-testid='cell']").eq(1).click();

    // Set align-self and justify-self values for the second area
    cy.get("[data-testid='align-self']").select("center");
    cy.get("[data-testid='justify-self']").select("start");

    // Click the view code button and switch to CSS
    cy.get("[data-testid='view-code']").click();
    cy.get("[data-testid='css-btn']").click();

    // Check if all the properties are included in the generated CSS code
    cy.get("[data-testid='code-block']").within(() => {
      cy.get("code")
        .invoke("text")
        .then((text: string) => {
          expect(text).to.contain("row-gap: 12px;");
          expect(text).to.contain("column-gap: 14px;");
          expect(text).to.contain("align-self: center;");
          expect(text).to.contain("justify-self: start;");
        });
    });

    // Reset the align-self and justify-self values for the second area
    cy.get("[data-testid='align-self']").select("stretch", { force: true });
    cy.get("[data-testid='justify-self']").select("stretch", { force: true });

    // Check if the reset align-self and justify-self values are removed from the generated CSS code
    cy.get("[data-testid='code-block']").within(() => {
      cy.get("code")
        .invoke("text")
        .then((text: string) => {
          expect(text).not.to.contain("align-self: center;");
          expect(text).not.to.contain("justify-self: start;");
        });
    });
  });
});
