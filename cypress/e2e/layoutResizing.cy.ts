describe("Layout Resizing", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("resizes the layout when clicking row/column increment and decrement buttons", () => {
    // Click the row and column increment buttons
    cy.get("[data-testid='row-increment']").click();
    cy.get("[data-testid='column-increment']").click();

    // Check if the number of rows and columns has increased by 1
    cy.get("[data-testid='cell'][data-row='7']").should("have.length", 7);
    cy.get("[data-testid='cell'][data-column='7']").should("have.length", 7);

    // Click the row and column decrement buttons
    cy.get("[data-testid='row-decrement']").click();
    cy.get("[data-testid='column-decrement']").click();

    // Check if the number of rows and columns has decreased by 1
    cy.get("[data-testid='cell'][data-row='7']").should("not.exist");
    cy.get("[data-testid='cell'][data-column='7']").should("not.exist");
  });

  it("resizes row and column sizes based on user input", () => {
    // Input new sizes and focus out to trigger update
    cy.get("[data-testid='row-size']").first().clear().type("2fr").blur();
    cy.get("[data-testid='row-size']").eq(3).clear().type("4fr").blur();
    cy.get("[data-testid='col-size']").first().clear().type("2fr").blur();
    cy.get("[data-testid='col-size']").eq(3).clear().type("4fr").blur();

    cy.get("[data-testid='grid-editor']").should((editor) => {
      const styles = window.getComputedStyle(editor[0]);

      // Check if the grid template includes the new sizes
      expect(styles.getPropertyValue("--grid-rows")).to.include("2fr");
      expect(styles.getPropertyValue("--grid-rows")).to.include("4fr");
      expect(styles.getPropertyValue("--grid-columns")).to.include("2fr");
      expect(styles.getPropertyValue("--grid-columns")).to.include("4fr");
    });
  });
});
