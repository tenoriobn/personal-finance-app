describe('Visão Geral — Página autenticada', () => {
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

  beforeEach(() => {
    cy.intercept('GET', '**/overview', {
      fixture: 'overview.json',
    }).as('getOverview');

    login();
    cy.wait('@getOverview');
  });

  describe('Acesso à página', () => {
    it('Should load overview page successfully', () => {
      cy.findByRole('heading', { name: 'Visão Geral' }).should('be.visible');
    });
  });

  describe('Resumo financeiro', () => {
    it('Should display financial summary cards', () => {
      cy.findByText('Saldo Atual').closest('article').within(() => {
        cy.findByText('R$ 184,00').should('be.visible');
      });

      cy.findByText('Entradas').closest('article').within(() => {
        cy.findByText('R$ 250,00').should('be.visible');
      });

      cy.findByText('Saídas').closest('article').within(() => {
        cy.findByText('R$ 66,00').should('be.visible');
      });
    });
  });

  describe('Poupanças', () => {
    it('Should display 4 Pots', () => {
      cy.getByData('financial-pots')
        .findAllByRole('article')
        .should('have.length', 4);
    });

    it('Should display pots summary', () => {
      cy.findByRole('heading', { name: 'Poupanças' }).closest('section').within(() => {
        cy.findByText('Total economizado').should('be.visible');
        cy.findByText('R$ 3.344,00').should('be.visible');
        cy.findByText('Presentes1234567').should('be.visible');
      });
    });
  });

  describe('Transações', () => {
    it('Should display 5 transactions', () => {
      cy.findByRole('heading', { name: 'Transações' })
        .closest('section')
        .findAllByRole('row')
        .should('have.length', 5);
    });

    it('Should display first transaction summary', () => {
      cy.findByRole('heading', { name: 'Transações' }).closest('section')
        .findAllByRole('row').first().within(() => {
          cy.findByText('B');
          cy.findByText('Bruno Tenorio');
          cy.findByText('04/12/2025');
          cy.findByText('+R$ 20,00');
        });
    });
  });

  describe('Orçamentos', () => {
    it('Should display 4 Budgets', () => {
      cy.getByData('financial-budgets')
        .findAllByRole('article')
        .should('have.length', 4);
    });

    it('Should display Budgets summary', () => {
      cy.findByRole('heading', { name: 'Orçamentos' }).closest('section').within(() => {
        cy.findByText('Entretenimento').should('be.visible');
        cy.findByText('R$ 39,00').should('be.visible');
      });
    });
  });

  describe('Contas Recorrentes', () => {
    it('Should display Financial Recurring Bills cards', () => {
      cy.findByText('Contas pagas').closest('article').within(() => {
        cy.findByText('R$ 10,00').should('be.visible');
      });

      cy.findByText('A vencer em 5 dias').closest('article').within(() => {
        cy.findByText('R$ 5,00').should('be.visible');
      });

      cy.findByText('Próximos vencimentos').closest('article').within(() => {
        cy.findByText('R$ 0,00').should('be.visible');
      });
    });
  });

  describe('Sair', () => {
    it('Should redirect to login after clicking logout', () => {
      cy.findByRole('button', { name: 'Sair' }).should('be.visible').click();
      cy.location('pathname').should('eq', '/login');
    });
  });
});
