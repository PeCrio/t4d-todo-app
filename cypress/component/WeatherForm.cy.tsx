describe('Weather Predictions Modal', () => {
  it('opens modal and submits weather search', () => {
    cy.visit('http://localhost:3000/');

    // Open modal
    cy.get('[data-testid="open-weather-modal"]').click();

    // Confirm modal visible
    cy.get('[data-testid="country"]').should('be.visible');

    // Select a country
    cy.get('[data-testid="country"]').select('Nigeria');

    // Wait for states to populate and select one
    cy.get('[data-testid="state"]').should('not.be.disabled').select('Lagos');

    // Fill in dates
    cy.get('[data-testid="start-date"]').type('2024-01-01');
    cy.get('[data-testid="end-date"]').type('2024-01-05');

    // Click search
    cy.get('[data-testid="search-button"]').click();

    // Check that results render
    cy.get('.text-theme-blue').should('contain', 'Date');
  });
});
