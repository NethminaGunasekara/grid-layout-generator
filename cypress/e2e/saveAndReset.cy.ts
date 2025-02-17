describe("Save and Reset", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("saves the grid layout when the save button is clicked", () => {
    // Increment the row and column count
    cy.get("[data-testid='row-increment']").click();
    cy.get("[data-testid='column-increment']").click();

    // Add two new areas to the grid
    cy.get("[data-testid='cell']").first().click();
    cy.get("[data-testid='cell']").eq(1).click();

    // Check if the grid layout has been incremented
    cy.get("[data-testid='cell']").should("have.length", 49);

    // Check if the newly added areas are listed in the area options
    cy.get("[data-testid='areas-available']")
      .find("option")
      .should("have.length", 2);

    // Open the save modal and proceed with saving
    cy.get("[data-testid='open-save-modal']").click();
    cy.get("[data-testid='save-modal']").should("be.visible");
    cy.get("[data-testid='save-layout']").click();
    cy.get("[data-testid='layout-name']").focus().type("Layout 1").blur();
    cy.get("[data-testid='finish-save").click();

    // Check if the grid layout has been saved
    cy.get("[data-testid='saved-layout']").as("savedLayout");
    cy.get("@savedLayout").should("have.length", 1);
    cy.get("@savedLayout")
      .find("[data-testid='layout-name']")
      .should("have.text", "Layout 1");

    // Close the save modal and proceed with resetting
    cy.get("[data-testid='close-save-modal']").click();
    cy.get("[data-testid='reset-layout']").click();
    cy.get("[data-testid='grid-reset-confirmation-modal']").should(
      "be.visible",
    );
    cy.get("[data-testid='reset-btn']").click();

    // Check if the grid layout has been reset
    cy.get("[data-testid='cell']").should("have.length", 36);
    cy.get("[data-testid='area']").should("not.exist");

    // Load the saved layout
    cy.get("[data-testid='open-save-modal']").click();
    cy.get("@savedLayout").dblclick();
    cy.get("[data-testid='cell']").should("have.length", 49);
    cy.get("[data-testid='area']").should("have.length", 2);
  });
});
