import type { TransactionsResponse, TransactionsData } from '../../app/screens/Transactions/transactions.type';

describe('Transações — Página autenticada', () => {
  const login = () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    }).as('loginRequest');

    cy.setPerformanceWarningAsSeen();

    cy.visit('/login');
    cy.waitForNuxtHydration();

    cy.findByLabelText('Email').type('bruno.teste@email.com');
    cy.findByLabelText('Senha').type('@Ab12345678');
    cy.findByRole('button', { name: 'Entrar' }).click();

    cy.wait('@loginRequest');
    cy.location('pathname').should('eq', '/');
  };

  const getTransactionRow = (index: number) => cy.findByRole('table').find('tbody > tr').eq(index);

  beforeEach(() => {
    cy.fixture('overview.json').then((overview) => {
      cy.intercept('GET', '**/overview*', { body: overview }).as('getOverview');
    });

    cy.fixture('transactions.json').then((transactions: TransactionsResponse) => {
      cy.intercept('GET', '**/transactions*', (req) => {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);

        const start = (page - 1) * limit;
        const end = start + limit;

        req.reply({
          ...transactions,
          data: transactions.data.slice(start, end),
          total: transactions.data.length,
          totalPages: Math.ceil(transactions.data.length / limit),
        });
      }).as('getTransactions');
    });

    cy.fixture('categories.json').then((categories) => {
      cy.intercept('GET', '**/categories*', { body: categories }).as('getCategories');
    });

    cy.fixture('categories-used.json').then((used) => {
      cy.intercept('GET', '**/categories/used*', { body: used }).as('getCategoriesUsed');
    });

    cy.fixture('budget-id.json').then((budget) => {
      cy.intercept(
        'GET',
        `**/budgets/${budget.id}`,
        {
          statusCode: 200,
          body: budget,
        },
      ).as('getBudgetId');
    });

    cy.intercept('GET', '**/budgets*', {
      statusCode: 200,
      body: [],
    });
    cy.intercept('GET', '**/recurring-bills*', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '**/pots*', {
      statusCode: 200,
      body: [],
    });

    login();

    cy.findByRole('link', { name: 'Transações' }).click();

    cy.wait('@getOverview');
    cy.wait('@getTransactions');
    cy.wait('@getCategories');
    cy.wait('@getCategoriesUsed');
  });

  describe('Acesso à página', () => {
    it('Should load transactions page successfully', () => {
      cy.findByRole('heading', { name: 'Transações' }).should('be.visible');
    });
  });

  describe('Tabela de transações', () => {
    it('Should display 10 transactions on the first page', () => {
      cy.findByRole('table').find('tbody').findAllByRole('row').should('have.length', 10);
    });

    it('Should display first transaction row correctly', () => {
      getTransactionRow(0).within(() => {
        cy.findByText('A');
        cy.findAllByText('Antonio Figueiredo');
        cy.findByText('Contas');
        cy.findByText('08/01/2026');
        cy.findByText('+R$ 1,00');
      });
    });
  });

  describe('Filtros', () => {
    it('Should filter by search input', () => {
      cy.fixture('transactions.json').then((transactions: TransactionsResponse) => {
        const filteredData = transactions.data.filter((t: TransactionsData) =>
          t.name.toLowerCase().includes('rafael'),
        );

        cy.intercept('GET', '**/transactions**search=Rafael**', (req) => {
          req.reply({
            statusCode: 200,
            body: {
              ...transactions,
              data: filteredData,
              total: filteredData.length,
              totalPages: 1,
            },
          });
        }).as('getTransactionsFiltered');

        cy.findByLabelText('Pesquisar transações').type('Rafael');

        cy.wait('@getTransactionsFiltered');

        getTransactionRow(0).within(() => {
          cy.findAllByText(filteredData[0].name);
          cy.findByText(filteredData[0].budget.category.name);
          cy.findByText(new Date(filteredData[0].date).toLocaleDateString('pt-BR'));
          cy.findByText(`+R$ ${filteredData[0].amount},00`);
        });

        cy.findByRole('table').find('tbody > tr').should('have.length', filteredData.length);
      });
    });

    it('Should sort by "Mais Alto" (Z → A)', () => {
      cy.fixture('transactions.json').then((transactions: TransactionsResponse) => {
        const sortedData = [...transactions.data].sort((a, b) =>
          b.name.localeCompare(a.name),
        );

        cy.intercept('GET', '**/transactions**sort=Z+a+A**', (req) => {
          req.reply({
            statusCode: 200,
            body: {
              ...transactions,
              data: sortedData,
            },
          });
        }).as('getTransactionsSorted');

        cy.getByData('dropdown-sort-by').click();
        cy.get('li').contains('Z a A').click();

        cy.wait('@getTransactionsSorted');

        getTransactionRow(0).within(() => {
          cy.findAllByText(sortedData[0].name);
        });
      });
    });

    it('Should filter by category "Contas"', () => {
      cy.fixture('transactions.json').then((transactions: TransactionsResponse) => {
        const filteredData = transactions.data.filter(
          (t: TransactionsData) => t.budget?.category?.id === '68e5610fe6616ee788ea45af',
        );

        cy.intercept(
          'GET',
          '**/transactions**categoryId=68e5610fe6616ee788ea45af**',
          (req) => {
            req.reply({
              statusCode: 200,
              body: {
                ...transactions,
                data: filteredData,
              },
            });
          },
        ).as('getTransactionsFiltered');

        cy.getByData('dropdown-category').click();
        cy.get('li').contains('Contas').click({ force: true });

        cy.wait('@getTransactionsFiltered');

        cy.findByRole('table').find('tbody > tr').should('have.length', filteredData.length);

        getTransactionRow(0).within(() => {
          cy.findAllByText(filteredData[0].budget.category.name);
          cy.findAllByText(filteredData[0].name);
          cy.findByText(new Date(filteredData[0].date).toLocaleDateString('pt-BR'));
          cy.findByText(`+R$ ${filteredData[0].amount},00`);
        });
      });
    });
  });

  describe('Paginação', () => {
    it('Should display correct number of pages', () => {
      cy.fixture('transactions.json').then((transactions: TransactionsResponse) => {
        const totalPages = Math.ceil(transactions.data.length / 10);

        cy.getByData('pagination').find('[data-testid="page-button"]').should('have.length', totalPages);
      });
    });

    it('Should navigate to next page and display transactions correctly', () => {
      const limit = 10;

      cy.fixture('transactions.json').then((transactions: TransactionsResponse) => {
        const totalPages = Math.ceil(transactions.data.length / limit);
        const page1Data = transactions.data.slice(0, limit);
        const page2Data = transactions.data.slice(limit, limit * 2);

        cy.intercept('GET', '**/transactions**page=2**', (req) => {
          req.reply({
            ...transactions,
            data: page2Data,
            total: transactions.data.length,
            totalPages,
          });
        }).as('getPage2');

        cy.findByRole('table').find('tbody > tr').should('have.length', page1Data.length);

        cy.getByData('next-pagination').click();

        cy.wait('@getPage2');

        cy.findByRole('table').find('tbody > tr').should('have.length', page2Data.length);

        cy.get('tbody > tr').first().within(() => {
          cy.findAllByText(page2Data[0].name);
          cy.findByText(page2Data[0].budget.category.name);
          cy.findByText(new Date(page2Data[0].date).toLocaleDateString('pt-BR'));
          cy.findByText(`+R$ ${page2Data[0].amount},00`);
        });
      });
    });

    it('Should disable prev button on first page and next button on last page', () => {
      const limit = 10;

      cy.fixture('transactions.json').then((transactions: TransactionsResponse) => {
        const totalPages = Math.ceil(transactions.data.length / limit);

        cy.intercept('GET', `**/transactions**page=${totalPages}**`, (req) => {
          req.reply({
            ...transactions,
            data: transactions.data.slice((totalPages - 1) * limit, totalPages * limit),
            total: transactions.data.length,
            totalPages,
          });
        }).as('getLastPage');

        cy.getByData('prev-pagination').should('be.disabled');

        for (let i = 1; i < totalPages; i++) {
          cy.getByData('next-pagination').click();
        }

        cy.wait('@getLastPage');

        cy.getByData('next-pagination').should('be.disabled');
      });
    });
  });

  describe('Modal Transação', () => {
    it('Should create a new transaction successfully', () => {
      const day = new Date().getDate();
      const dayPadded = String(day).padStart(2, '0');

      const newTransaction = {
        id: 'transaction-id',
        name: 'Compra Mercado',
        date: `2026-01-${dayPadded}T03:00:00.000Z`,
        amount: -120,
        recurring: false,
        type: 'OUT',
        budgetId: '693991789c031cc034ff0c0a',
        budget: {
          category: {
            id: '693991789c031cc034ff0c0a',
            name: 'Supermercado',
          },
        },
      };

      cy.fixture('transactions.json').then((transactions: TransactionsResponse) => {
        cy.intercept('POST', '**/transactions', (req) => {
          expect(req.body).to.include({
            name: newTransaction.name,
            recurring: false,
            budgetId: newTransaction.budgetId,
            type: 'OUT',
          });

          expect(req.body.date).to.match(
            new RegExp(`^2026-01-${dayPadded}`),
          );

          expect(req.body.amount).to.eq(-120);

          req.reply({
            statusCode: 201,
            body: { id: newTransaction.id },
          });
        }).as('createTransaction');

        cy.intercept('GET', '**/transactions**', (req) => {
          req.reply({
            statusCode: 200,
            body: {
              ...transactions,
              data: [newTransaction, ...transactions.data],
              total: transactions.data.length + 1,
            },
          });
        }).as('refreshTransactions');

        cy.findByRole('button', { name: '+Nova Transação' }).click();
        cy.findByText('Criar nova Transação').should('be.visible');

        cy.findByLabelText('Nome da Transação').type(newTransaction.name);

        cy.findByLabelText('Data da Transação').click();
        cy.get('.calendar-container').should('be.visible');
        cy.get('.vc-day:not(.vc-disabled)')
          .contains(new RegExp(`^${day}$`))
          .click();

        cy.getByData('dropdown-category-options').click();
        cy.get('li').contains('Supermercado').click();
        cy.wait('@getBudgetId');

        cy.findByLabelText('Valor').type('12000');

        cy.getByData('dropdown-recurring').click();
        cy.get('li').contains('Saída').click();

        cy.findByRole('button', { name: 'Criar' }).click();

        cy.wait('@createTransaction');
        cy.wait('@refreshTransactions');

        cy.findByText('Criar nova Transação').should('not.exist');
        cy.findByText('Transação criada com sucesso!').should('be.visible');

        cy.findByRole('table')
          .find('tbody > tr')
          .first()
          .within(() => {
            cy.findAllByText('Compra Mercado');
            cy.findByText(`${dayPadded}/01/2026`);
            cy.findByText('-R$ 120,00');
          });
      });
    });
  });
});
