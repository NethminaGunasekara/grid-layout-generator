describe("Area Management", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("adds a new area when clicking a cell", () => {
    // Click the first cell (row 1, column 1)
    cy.get("[data-row='1'][data-column='1']").click();

    // Check if one area is rendered
    cy.get("[data-testid='area']").should("have.length", 1);

    // Check if the newly added area is positioned correctly
    cy.get("[data-testid='area']").should(($area) => {
      expect($area).to.have.attr("data-row-start", "1");
      expect($area).to.have.attr("data-column-start", "1");
      expect($area).to.have.attr("data-row-end", "2");
      expect($area).to.have.attr("data-column-end", "2");
    });
  });

  it("lists available areas, allows selection & renaming", () => {
    // Click the first to cell to add two new areas
    cy.get("[data-row='1'][data-column='1']").click();
    cy.get("[data-testid='cell']").eq(1).click();

    // Check if the newly added areas are listed in the area options
    cy.get("[data-testid='areas-available']").as("areaSelect");
    cy.get("@areaSelect").find("option").should("have.length", 2);
    cy.get("@areaSelect").find("option").first().should("have.text", "area-1");
    cy.get("@areaSelect").find("option").eq(1).should("have.text", "area-2");

    // Select and rename the first area using area options
    cy.get("[data-testid='areas-available']").select("area-1");
    cy.get('[data-testid="area-id-input"]').clear().type("area-3").blur();

    // Check if the first area is renamed to area-3
    cy.get("[data-testid='area']")
      .first()
      .should("have.attr", "data-id", "area-3");

    // Select and rename the second area using inputs within the grid editor
    cy.get("[data-testid='area']").eq(1).click();

    cy.get('[data-testid="area-2-id-input"]').clear().type("area-4").blur();

    // Check if the second area is renamed to area-4
    cy.get("[data-testid='area']")
      .eq(1)
      .should("have.attr", "data-id", "area-4");
  });

  it("repositions the area when the user drops it on the grid", () => {
    // Click the first to cell to add a new area
    cy.get("[data-row='1'][data-column='1']").click();

    // Gradually move the area to the right and down to trigger a drop
    cy.get("[data-id='area-1']").then(($area) => {
      const rect = $area[0].getBoundingClientRect();
      const moveX = rect.width * 1.5; // 150% right
      const moveY = rect.height * 1.5; // 150% down
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      const stepX = moveX / 10;
      const stepY = moveY / 10;

      // Start dragging
      cy.get("[data-testid='area-1-move-button']").trigger("mousedown", {
        button: 0,
        clientX: startX,
        clientY: startY,
      });

      Cypress._.times(10, (i) => {
        cy.wait(50); // delay between steps
        cy.document().trigger("mousemove", {
          clientX: startX + stepX * (i + 1),
          clientY: startY + stepY * (i + 1),
        });
      });

      // Drop the area on the target cell
      cy.document().trigger("mouseup", { force: true });
      cy.get("[data-testid='area-1-move-button']").trigger("mouseup", {
        force: true,
      });

      // Check if the area is positioned correctly
      cy.get("[data-id='area-1']").should(($area) => {
        expect($area).to.have.attr("data-row-start", "2");
        expect($area).to.have.attr("data-column-start", "2");
        expect($area).to.have.attr("data-row-end", "3");
        expect($area).to.have.attr("data-column-end", "3");
      });
    });
  });

  it("repositions the area when the user edits its size in area options", () => {
    cy.viewport(360, 640); // Set viewport to mobile size

    // Click the first to cell to add a new area
    cy.get("[data-row='1'][data-column='1']").click();

    // Input the new position and trigger update
    cy.get("#row-end").first().clear().type("3").blur();
    cy.get("#column-end").first().clear().type("3").blur();
    cy.get("#row-start").first().clear().type("2").blur();
    cy.get("#column-start").first().clear().type("2").blur();

    // Check if the area is positioned correctly
    cy.get("[data-id='area-1']").should(($area) => {
      expect($area).to.have.attr("data-row-start", "2");
      expect($area).to.have.attr("data-column-start", "2");
      expect($area).to.have.attr("data-row-end", "3");
      expect($area).to.have.attr("data-column-end", "3");
    });
  });

  it("can resize the area using the resize handle", () => {
    // Click the first to cell to add a new area
    cy.get("[data-row='1'][data-column='1']").click();

    // Gradually move the resize handle to trigger a resize
    cy.get("[data-id='area-1']").then(($area) => {
      const rect = $area[0].getBoundingClientRect();
      const moveX = rect.width * 0.5; // 50% right
      const moveY = rect.height * 0.5; // 50% down
      const startX = rect.left + rect.width;
      const startY = rect.top + rect.height;
      const stepX = moveX / 10;
      const stepY = moveY / 10;

      // Start dragging
      cy.get("[data-testid='area-1-resize-handle']").trigger("mousedown", {
        button: 0,
        clientX: startX,
        clientY: startY,
      });

      Cypress._.times(10, (i) => {
        cy.wait(50); // delay between steps
        cy.document().trigger("mousemove", {
          clientX: startX + stepX * (i + 1),
          clientY: startY + stepY * (i + 1),
        });
      });

      // Drop the area on the target cell
      cy.document().trigger("mouseup", { force: true });
      cy.get("[data-testid='area-1-resize-handle']").trigger("mouseup", {
        force: true,
      });

      // Check if the area is positioned correctly
      cy.get("[data-id='area-1']").should(($area) => {
        expect($area).to.have.attr("data-row-start", "1");
        expect($area).to.have.attr("data-column-start", "1");
        expect($area).to.have.attr("data-row-end", "3");
        expect($area).to.have.attr("data-column-end", "3");
      });
    });
  });

  it("resizes the area when the user edits its size in area options", () => {
    cy.viewport(360, 640); // Set viewport to mobile size

    // Click the first to cell to add a new area
    cy.get("[data-row='1'][data-column='1']").click();

    // Input the new size and trigger update
    cy.get("#row-end").first().clear().type("3").blur();
    cy.get("#column-end").first().clear().type("3").blur();

    // Check if the area is positioned correctly
    cy.get("[data-id='area-1']").should(($area) => {
      expect($area).to.have.attr("data-row-start", "1");
      expect($area).to.have.attr("data-column-start", "1");
      expect($area).to.have.attr("data-row-end", "3");
      expect($area).to.have.attr("data-column-end", "3");
    });
  });

  it("deletes the area when the user clicks the delete button", () => {
    // Click the first to cell to add a new area
    cy.get("[data-row='1'][data-column='1']").click();

    // Click the delete button for the first area
    cy.get("[data-testid='area-1-delete-button']").click();

    // Check if the area is deleted
    cy.get("[data-id='area-1']").should("not.exist");
  });
});
