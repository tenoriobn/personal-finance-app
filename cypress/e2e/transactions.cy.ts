describe('Transactions', () => {
  const firstRow = () => cy.get('tbody tr').first();
  const firstRowNameCell = () => firstRow().find('td').first();
  const selectDropdown = (testid: string, optionText: string) => {
    cy.getByData(testid).should('be.visible').click();
    cy.getByData(testid).contains(optionText).click();
  };

  beforeEach(() => {
    cy.viewport(1280, 900);

    cy.visit('/');
    cy.waitForNuxtHydration();
    cy.contains('a span', 'Transações').click();
  });

  it('should navigate to the Transações page and display the title', () => {
    cy.get('h2').should('have.text', 'Transações');
  });

  it('should filter transactions by name and update the table with matching entries', () => {
    cy.get('input[name="search"]').type('Savory Bites Bistro');
    firstRowNameCell().should('contain', 'Savory Bites Bistro');

    cy.get('input[name="search"]').clear().type('Sofia Peterson');
    firstRowNameCell().should('contain', 'Sofia Peterson');
    firstRowNameCell().should('not.contain', 'Savory Bites Bistro');
  });

  it('should sort transactions by "A to Z" and update the first row accordingly', () => {
    cy.get('input[name="search"]').clear();

    selectDropdown('dropdown-sort-by', 'A a Z');

    firstRowNameCell().should('contain', 'Aqua Flow Utilities');
    firstRowNameCell().should('not.contain', 'Spark Electric Solutions');
  });

  it('should filter transactions by category "Fundos" and show only relevant transactions', () => {
    cy.get('input[name="search"]').clear();
    selectDropdown('dropdown-category', 'Fundos');

    cy.get('tbody tr').each(($tr) => {
      cy.wrap($tr).find('td').eq(2).should('contain', 'Fundos');
    });
  });

  it('should go to the second page and display different rows of transactions', () => {
    cy.get('input[name="search"]').clear();
    selectDropdown('dropdown-sort-by', 'A a Z');
    selectDropdown('dropdown-category', 'Todos');

    firstRowNameCell().should('contain', 'Aqua Flow Utilities');

    cy.contains('button', /^2$/).click();

    firstRowNameCell().should('not.contain', 'Aqua Flow Utilities');
    firstRowNameCell().should('contain', 'Emma Richardson');
  });
});
