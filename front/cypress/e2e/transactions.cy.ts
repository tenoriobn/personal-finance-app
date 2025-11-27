import type { TransactionsData } from '../../app/screens/Transactions/transactions.type';

describe.skip('Transactions', () => {
  const firstRow = () => cy.get('tbody tr').first();
  const firstRowNameCell = () => firstRow().find('td').first();

  let transactions: TransactionsData[];

  beforeEach(() => {
    cy.viewport(1280, 900);

    cy.fixture('transactions.json').then((mock) => {
      transactions = mock.transactions;

      cy.intercept('GET', '/api/transactions*page=1*', {
        body: {
          data: [transactions[0]],
          total: transactions.length,
          page: 1,
          totalPages: 2,
        },
      }).as('page1');
    });

    cy.visit('/');
    cy.waitForNuxtHydration();
    cy.contains('a span', 'Transações').click();
  });

  it('should navigate to the Transações page and display the title', () => {
    cy.wait('@page1');
    cy.get('h2').should('have.text', 'Transações');
  });

  it('should filter transactions by name', () => {
    cy.intercept('GET', '/api/transactions*search=Savory*', {
      body: {
        data: transactions.filter(t => t.name.includes('Savory')),
        total: 1,
        page: 1,
        totalPages: 1,
      },
    }).as('searchSavory');

    cy.get('input[name="search"]').type('Savory Bites Bistro');
    cy.wait('@searchSavory');
    firstRowNameCell().should('contain', 'Savory Bites Bistro');
  });

  it('should sort transactions by "A to Z"', () => {
    const sortedAZ = [...transactions].sort((a, b) => a.name.localeCompare(b.name));
    cy.intercept('GET', '/api/transactions*sort=A+a+Z*', {
      body: {
        data: sortedAZ,
        total: sortedAZ.length,
        page: 1,
        totalPages: 1,
      },
    }).as('sortAZ');

    cy.getByData('dropdown-sort-by').click().contains('A a Z').click();
    cy.wait('@sortAZ');

    const firstSortedName = [...transactions].sort((a, b) =>
      a.name.localeCompare(b.name),
    )[0].name;

    firstRowNameCell().should('contain', firstSortedName);
  });

  it('should filter transactions by category "Poupanças"', () => {
    cy.intercept('GET', '/api/transactions*category=Poupanças*', {
      body: {
        // data: transactions.filter(t => t.category === 'Poupanças'),
        total: 2,
        page: 1,
        totalPages: 1,
      },
    }).as('filterPoupanças');

    cy.getByData('dropdown-category').click().contains('Poupanças').click();
    cy.wait('@filterPoupanças');

    cy.get('tbody tr').each(($tr) => {
      cy.wrap($tr).find('td').eq(2).should('contain', 'Poupanças');
    });
  });

  it('should paginate transactions', () => {
    cy.wait('@page1');
    firstRowNameCell().should('contain', transactions[0].name);

    cy.intercept('GET', '/api/transactions*page=2*', {
      body: {
        data: [transactions[1]],
        total: transactions.length,
        page: 2,
        totalPages: 2,
      },
    }).as('page2');

    cy.contains('button', /^2$/).click();
    cy.wait('@page2');
    firstRowNameCell().should('contain', transactions[1].name);
  });
});
