describe('Transactions', () => {
  const firstRow = () => cy.get('tbody tr').first();
  const firstRowNameCell = () => firstRow().find('td').first();
  const selectDropdown = (testid: string, optionText: string) => {
    cy.getByData(testid).should('be.visible').click();
    cy.getByData(testid).contains(optionText).click();
  };

  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.intercept('GET', '/api/transactions', { fixture: 'data.test.json' }).as('getData');
    cy.visit('/');
    cy.waitForNuxtHydration();
    cy.contains('a span', 'Transactions').click();
    cy.wait('@getData');
  });

  it('navigates to the Transactions page', () => {
    cy.get('h2').should('have.text', 'Transactions');
  });

  it('filters by name and updates the table', () => {
    cy.get('input[name="search"]').type('Savory Bites Bistro');
    firstRowNameCell().should('contain', 'Savory Bites Bistro');

    cy.get('input[name="search"]').clear().type('Sofia Peterson');
    firstRowNameCell().should('contain', 'Sofia Peterson');
    firstRowNameCell().should('not.contain', 'Savory Bites Bistro');
  });

  it('sorts by "A to Z" and updates the first row', () => {
    cy.get('input[name="search"]').clear();

    selectDropdown('dropdown-sort-by', 'A to Z');

    firstRowNameCell().should('contain', 'Aqua Flow Utilities');
    firstRowNameCell().should('not.contain', 'Spark Electric Solutions');
  });

  it('filters by category "Bills" and shows only Bills', () => {
    cy.get('input[name="search"]').clear();
    selectDropdown('dropdown-category', 'Bills');

    cy.get('tbody tr').each(($tr) => {
      cy.wrap($tr).find('td').eq(2).should('contain', 'Bills');
    });
  });

  it('goes to page 2 and shows different rows', () => {
    cy.get('input[name="search"]').clear();
    selectDropdown('dropdown-sort-by', 'A to Z');
    selectDropdown('dropdown-category', 'All Transactions');

    firstRowNameCell().should('contain', 'Aqua Flow Utilities');

    cy.contains('button', /^2$/).click();

    firstRowNameCell().should('not.contain', 'Aqua Flow Utilities');
    firstRowNameCell().should('contain', 'Emma Richardson');
  });
});
