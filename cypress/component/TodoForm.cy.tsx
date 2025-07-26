
describe("TodoForm Modal", () => {
  before(() => {
    // Open the modal once before all tests
    // cy.mount(<TodoForm />);
    
    cy.visit("http://localhost:3001/");
    cy.get('[data-testid="todo-open-modal"]').click(); // open modal
    cy.get('[data-testid="todo-modal"]').should("be.visible");
  });

  it("fills and submits form successfully", () => {
    cy.get('[data-testid="todo-name"]').type("My Todo");
    cy.get('[data-testid="todo-description"]').type("Some desc");
    cy.get('[data-testid="todo-has-subtasks"]').check();
    cy.get('[data-testid="todo-add-subtask"]').click();
    cy.get('[data-testid="todo-subtask-0"]').type("Sub 1");
    cy.get('[data-testid="todo-submit"]').click();

    // Assert the modal is closed
    cy.get('[data-testid="todo-modal"]').should("not.exist");
  });

  it("shows validation errors", () => {
    // Wait for previous test modal close
    cy.wait(500); // wait for state reset

    // Reopen modal if needed
    cy.get('[data-testid="todo-open-modal"]').click();
    cy.get('[data-testid="todo-modal"]').should("be.visible");

    // Try submitting empty form
    cy.get('[data-testid="todo-submit"]').click();
    cy.contains("Name is required").should("exist");
    cy.contains("Description is required").should("exist");
  });

  it("resets all fields", () => {
    // Wait and reopen modal
    cy.wait(500);
    cy.get('[data-testid="todo-open-modal"]').click();
    cy.get('[data-testid="todo-modal"]').should("be.visible");

    // Fill some data
    cy.get('[data-testid="todo-name"]').type("Temp");
    cy.get('[data-testid="todo-description"]').type("Desc");
    cy.get('[data-testid="todo-has-subtasks"]').check();
    cy.get('[data-testid="todo-add-subtask"]').click();
    cy.get('[data-testid="todo-subtask-0"]').type("Sub");

    // Reset form
    cy.get('[data-testid="todo-reset"]').click();

    // Assert form is cleared
    cy.get('[data-testid="todo-name"]').should("have.value", "");
    cy.get('[data-testid="todo-description"]').should("have.value", "");
    cy.get('[data-testid="todo-subtask-0"]').should("not.exist");
  });
});
