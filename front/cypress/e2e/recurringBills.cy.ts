import type { RecurringBillsResponse } from '../../app/screens/RecurringBills/recurringBills.type';

describe('Visão Geral — Página autenticada', () => {
  const login = () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    }).as('loginRequest');

    cy.visit('/login');
    cy.waitForNuxtHydration();

    cy.findByLabelText('Email').type('bruno.teste@email.com');
    cy.findByLabelText('Senha').type('@Ab12345678');
    cy.findByRole('button', { name: 'Entrar' }).click();

    cy.wait('@loginRequest');
    cy.location('pathname').should('eq', '/');
  };

  const getTransactionRow = (index: number) => cy.getByData('recurring-bills-table').find('tbody > tr').eq(index);

  beforeEach(() => {
    cy.intercept('GET', '**/overview', {
      fixture: 'overview.json',
    }).as('getOverview');

    cy.fixture('recurring-bills.json').then((recurringBills: RecurringBillsResponse[]) => {
      cy.intercept('GET', '**/recurring-bills*', {
        statusCode: 200,
        body: recurringBills,
      }).as('getRecurringBills');
    });

    login();

    cy.findByRole('link', { name: 'Recorrentes' }).click();

    cy.wait('@getOverview');
    cy.wait('@getRecurringBills');
  });

  describe('Acesso à página', () => {
    it('Should load pots page successfully', () => {
      cy.findByRole('heading', { name: 'Contas Recorrentes' }).should('be.visible');
    });
  });

  describe('Resumo financeiro', () => {
    it('Should display total recurring bills value', () => {
      cy.findByText('Total de contas').closest('div').within(() => {
        cy.findByText('R$ 20,00').should('be.visible');
      });
    });

    it('Should display recurring bills summary breakdown correctly', () => {
      cy.findByRole('heading', { name: 'Resumo' }).should('be.visible').parent().within(() => {
        cy.findByText('Contas pagas').parent().within(() => {
          cy.findByText('R$ 20,00').should('be.visible');
        });

        cy.findByText('A vencer em 5 dias').parent().within(() => {
          cy.findByText('R$ 0,00').should('be.visible');
        });

        cy.findByText('Próximos vencimentos').parent().within(() => {
          cy.findByText('R$ 0,00').should('be.visible');
        });
      });
    });
  });

  describe('Tabela de contas recorrentes', () => {
    it('Should render recurring bills list on first page', () => {
      cy.getByData('recurring-bills-table').find('tbody').findAllByRole('row').should('have.length', 2);
    });

    it('Should display recurring bill information correctly', () => {
      getTransactionRow(0).within(() => {
        cy.findByText('O');
        cy.findAllByText('Olavio Santista');
        cy.findByText('Jan - 10').should('be.visible');
        cy.findByText('R$ 10,00').should('be.visible');
      });
    });
  });

  describe('Filtros', () => {
    it('Should filter recurring bills by search input', () => {
      cy.fixture('recurring-bills.json').then((recurringBill: RecurringBillsResponse) => {
        const filteredData = recurringBill.data.filter(bill => bill.name.toLowerCase().includes('bruno'));

        cy.intercept('GET', '**/recurring-bills**search=Bruno**', (req) => {
          req.reply({
            statusCode: 200,
            body: {
              ...recurringBill,
              data: filteredData,
              total: filteredData.length,
              totalPages: 1,
            },
          });
        }).as('getRecurringBillsFiltered');

        cy.findByLabelText('Pesquisar conta').type('Bruno');

        cy.wait('@getRecurringBillsFiltered');

        getTransactionRow(0).within(() => {
          cy.findByText(filteredData[0].name).should('be.visible');
          cy.findByText('Jan - 03').should('be.visible');
          cy.findByText('R$ 10,00').should('be.visible');
        });

        cy.getByData('recurring-bills-table').find('tbody > tr').should('have.length', filteredData.length);
      });
    });

    it('Should sort recurring bills alphabetically from A to Z', () => {
      cy.fixture('recurring-bills.json').then((recurringBill: RecurringBillsResponse) => {
        const sortedData = [...recurringBill.data].sort((a, b) => a.name.localeCompare(b.name));

        cy.intercept('GET', '**/recurring-bills**sort=A+a+Z**', (req) => {
          req.reply({
            statusCode: 200,
            body: {
              ...recurringBill,
              data: sortedData,
            },
          });
        }).as('getRecurringBillsSorted');

        cy.getByData('dropdown-sort-by').click();
        cy.get('li').contains('A a Z').click({ force: true });

        cy.wait('@getRecurringBillsSorted');

        getTransactionRow(0).within(() => {
          cy.findAllByText(sortedData[0].name);
        });
      });
    });
  });
});
