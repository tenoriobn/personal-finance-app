import type { BudgetData } from '../../app/screens/Budgets/budgets.type';

describe('Orçamentos — Página autenticada', () => {
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

  beforeEach(() => {
    cy.fixture('overview.json').then((overview) => {
      cy.intercept('GET', '**/overview*', { body: overview }).as('getOverview');
    });

    cy.fixture('budgets.json').then((budgets: BudgetData[]) => {
      cy.intercept('GET', '**/budgets*', {
        statusCode: 200,
        body: budgets,
      }).as('getBudgets');
    });

    cy.fixture('categories-available.json').then((categories) => {
      cy.intercept('GET', '**/categories/available*', {
        statusCode: 200,
        body: categories,
      }).as('getCategoriesAvailable');
    });

    cy.fixture('themes-available-budget.json').then((themes) => {
      cy.intercept('GET', '**/themes/available/budget*', {
        statusCode: 200,
        body: themes,
      }).as('getThemesAvailableBudget');
    });

    login();

    cy.findByRole('link', { name: 'Orçamentos' }).click();

    cy.wait('@getOverview');
    cy.wait('@getBudgets');
    cy.wait('@getCategoriesAvailable');
    cy.wait('@getThemesAvailableBudget');
  });

  describe('Acesso à página', () => {
    it('Should load budgets page successfully', () => {
      cy.findByRole('heading', { name: 'Orçamentos' }).should('be.visible');
    });
  });

  describe('Resumo de gastos', () => {
    it('Should display the spending summary table', () => {
      cy.getByData('spending-summary-table').should('be.visible');
    });

    it('Should list the first three budgets in the summary table', () => {
      cy.getByData('spending-summary-table')
        .find('tbody')
        .findAllByRole('row')
        .should('have.length', 3);
    });

    it('Should display correct information for each budget row', () => {
      cy.getByData('spending-summary-table').within(() => {
        cy.findByText('Entretenimento').should('be.visible');
        cy.findByText('R$ 39,00').should('be.visible');
        cy.findByText('de R$ 100,00').should('be.visible');

        cy.findByText('Contas').should('be.visible');
        cy.findByText('R$ 146,00').should('be.visible');
        cy.findByText('de R$ 500,00').should('be.visible');

        cy.findByText('Supermercado').should('be.visible');
        cy.findByText('R$ 30,00').should('be.visible');
        cy.findByText('de R$ 700,00').should('be.visible');
      });
    });
  });

  describe('Cards de orçamento', () => {
    const getBudgetCards = () => cy.findAllByTestId('actions-toggle').parents('.bg-white');

    it('Should render budget cards for each available budget', () => {
      getBudgetCards().should('have.length.at.least', 2);
    });

    it('Should display budget title and maximum value on each card', () => {
      cy.findByRole('heading', { name: 'Entretenimento' }).should('be.visible');
      cy.findByText('Máximo de R$ 100,00').should('be.visible');

      cy.findByRole('heading', { name: 'Contas' }).should('be.visible');
      cy.findByText('Máximo de R$ 500,00').should('be.visible');
    });

    it('Should display spent and free amounts for each budget', () => {
      cy.getByData('budget-card')
        .first()
        .within(() => {
          cy.findByText('Gasto').should('be.visible');
          cy.findByText('R$ 39,00').should('be.visible');

          cy.findByText('Livre').should('be.visible');
          cy.findByText('R$ 61,00').should('be.visible');
        });

      cy.getByData('budget-card')
        .eq(1)
        .within(() => {
          cy.findByText('Gasto').should('be.visible');
          cy.findByText('R$ 146,00').should('be.visible');

          cy.findByText('Livre').should('be.visible');
          cy.findByText('R$ 354,00').should('be.visible');
        });
    });

    it('Should display recent transactions section inside each budget card', () => {
      cy.findAllByRole('heading', { name: 'Últimos gastos' })
        .should('have.length.at.least', 2);
    });

    it('Should display up to three recent transactions per budget card', () => {
      cy.findAllByRole('table').each((table) => {
        cy.wrap(table)
          .find('tbody tr')
          .should('have.length.at.most', 3);
      });
    });

    it('Should allow user to navigate to transactions page from a budget card', () => {
      cy.findAllByRole('link', { name: 'Ver todos' })
        .first()
        .click();

      cy.location('pathname').should('eq', '/transacoes');
    });
  });

  describe('Cria orçamento', () => {
    it('Should create a new budget successfully', () => {
      const newBudget: BudgetData = {
        id: 'new-budget-id',
        maximumSpend: 900,
        category: {
          id: '68e56137e6616ee788ea45b4',
          name: 'Educação',
          budgetId: 'new-budget-id',
        },
        theme: {
          id: '68e55fade6616ee788ea45a6',
          colorName: 'Turquesa',
          colorHex: '#277C78',
        },
        transactions: [],
      };

      cy.fixture('budgets.json').then((budgets) => {
        cy.intercept('POST', '**/budgets', (req) => {
          expect(req.body).to.deep.equal({
            maximumSpend: 900,
            categoryId: '68e56137e6616ee788ea45b4',
            themeId: '68e55fade6616ee788ea45a6',
          });

          req.reply({
            statusCode: 201,
            body: {
              id: 'new-budget-id',
              ...req.body,
            },
          });
        }).as('createBudget');

        cy.intercept('GET', '**/budgets*', {
          statusCode: 200,
          body: [newBudget, ...budgets],
        }).as('refreshBudgets');

        cy.findByRole('button', { name: '+Novo Orçamento' }).click();

        cy.findByText('Criar novo Orçamento').should('be.visible');

        cy.findByLabelText('Gasto máximo')
          .clear()
          .type('90000');

        cy.getByData('category-dropdown').click();
        cy.get('li').contains('Educação').click();

        cy.getByData('theme-dropdown').click();
        cy.get('li').contains('Turquesa').click();

        cy.findByRole('button', { name: 'Criar' }).click();

        cy.wait('@createBudget');

        cy.findByText('Orçamento criado com sucesso!')
          .should('be.visible');

        cy.findByText('Criar novo Orçamento')
          .should('not.exist');

        cy.getByData('budget-card')
          .contains('Educação')
          .should('be.visible');
      });
    });
  });

  describe('Edita orçamento', () => {
    it('Should edit an existing budget successfully', () => {
      cy.fixture('budgets.json').then((budgets: BudgetData[]) => {
        const originalBudget = budgets[0];

        cy.intercept('PUT', `**/budgets/${originalBudget.id}`, (req) => {
          expect(req.body).to.deep.equal({
            maximumSpend: 1200,
            categoryId: originalBudget.category.id,
            themeId: originalBudget.theme.id,
          });

          req.reply({
            statusCode: 200,
            body: {
              ...originalBudget,
              maximumSpend: 1200,
            },
          });
        }).as('updateBudget');

        cy.intercept('GET', '**/budgets*', {
          statusCode: 200,
          body: [
            {
              ...originalBudget,
              maximumSpend: 1200,
            },
            ...budgets.slice(1),
          ],
        }).as('refreshBudgets');

        cy.getByData('budget-card')
          .first()
          .within(() => {
            cy.getByData('actions-toggle').click();
            cy.getByData('edit-action').click();
          });

        cy.findByText('Editar Orçamento').should('be.visible');

        cy.findByLabelText('Gasto máximo')
          .clear()
          .type('120000');

        cy.findByRole('button', { name: 'Salvar alterações' }).click();

        cy.wait('@updateBudget');

        cy.findByText('Orçamento atualizado com sucesso!')
          .should('be.visible');

        cy.findByText('Editar Orçamento')
          .should('not.exist');

        cy.getByData('budget-card')
          .first()
          .contains('R$ 1.200,00')
          .should('be.visible');
      });
    });
  });

  describe('Deleta orçamento', () => {
    it('Should delete a budget successfully', () => {
      cy.fixture('budgets.json').then((budgets: BudgetData[]) => {
        const budgetToDelete = budgets.find(
          budget => budget.category.name === 'Entretenimento',
        );

        expect(budgetToDelete).to.not.equal(undefined);

        const updatedBudgets = budgets.filter(
          budget => budget.id !== budgetToDelete!.id,
        );

        cy.getByData('budget-card').first().as('budgetCard');

        cy.get('@budgetCard')
          .should('be.visible')
          .within(() => {
            cy.getByData('actions-toggle').click();
            cy.getByData('delete-action').click();
          });

        cy.findByRole('heading', { name: 'Deletar Orçamento' }).should('be.visible');

        cy.intercept('DELETE', `**/budgets/${budgetToDelete!.id}`, {
          statusCode: 200,
        }).as('deleteBudget');

        cy.intercept('GET', '**/budgets*', {
          statusCode: 200,
          body: updatedBudgets,
        }).as('refreshBudgets');

        cy.findByRole('button', { name: 'Deletar Orçamento' }).click();

        cy.wait('@deleteBudget');

        cy.wait('@refreshBudgets');

        cy.getByData('budget-card').contains('Entretenimento').should('not.exist');
      });
    });
  });
});
