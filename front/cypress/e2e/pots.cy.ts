import type { PotData } from '../../app/screens/Pots/pots.type';

describe('Poupanças — Página autenticada', () => {
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
    cy.fixture('overview.json').then((overview) => {
      cy.intercept('GET', '**/overview*', { body: overview }).as('getOverview');
    });

    cy.intercept('GET', '**/budgets*', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '**/transactions*', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '**/recurring-bills*', {
      statusCode: 200,
      body: [],
    });

    cy.fixture('pots.json').then((pots: PotData[]) => {
      cy.intercept('GET', '**/pots*', {
        statusCode: 200,
        body: pots,
      }).as('getPots');
    });

    cy.fixture('themes-available-pots.json').then((themes) => {
      cy.intercept('GET', '**/themes/available/pot*', {
        statusCode: 200,
        body: themes,
      }).as('getThemesAvailablePots');
    });

    login();

    cy.findByRole('link', { name: 'Poupanças' }).click();

    cy.wait('@getOverview');
    cy.wait('@getPots');
    cy.wait('@getThemesAvailablePots');
  });

  describe('Acesso à página', () => {
    it('Should load pots page successfully', () => {
      cy.findByRole('heading', { name: 'Poupanças' }).should('be.visible');
    });
  });

  describe('Cards de Poupanças', () => {
    const getPotsCards = () => cy.findAllByTestId('actions-toggle').parents('.bg-white');
    it('Should render pot cards for each available pot', () => {
      getPotsCards().should('have.length.at.least', 13);
    });

    it('Should display correct saved value, progress and target for each pot', () => {
      cy.getByData('pot-card')
        .first()
        .within(() => {
          cy.findByText('Total Economizado').should('be.visible');
          cy.findByText('R$ 120,00').should('be.visible');
          cy.findByText('54.55%').should('be.visible');
          cy.findByText('Meta de R$ 220,00').should('be.visible');
        });

      cy.getByData('pot-card')
        .eq(1)
        .within(() => {
          cy.findByText('Total Economizado').should('be.visible');
          cy.findByText('R$ 1.000,00').should('be.visible');
          cy.findByText('100.00%').should('be.visible');
          cy.findByText('Meta de R$ 1.000,00').should('be.visible');
        });
    });
  });

  describe('Cria Poupança', () => {
    it('Should create a new Pot successfully', () => {
      const newPot: PotData = {
        id: 'new-pot-id',
        name: 'Nova Poupança',
        totalAmount: 0,
        targetAmount: 1000,
        createdAt: '2024-01-01T00:00:00.000Z',
        theme: {
          id: '68e55fcee6616ee788ea45ab',
          colorName: 'Exército',
          colorHex: '#7F9161',
        },
      };

      cy.fixture('pots.json').then((pots) => {
        cy.intercept('POST', '**/pots', (req) => {
          expect(req.body).to.include({
            name: 'Nova Poupança',
            targetAmount: 10,
            totalAmount: 0,
            themeId: '68e55fcee6616ee788ea45ab',
          });

          req.reply({
            statusCode: 201,
            body: newPot,
          });
        }).as('createPot');

        cy.intercept('GET', '**/pots*', {
          statusCode: 200,
          body: [newPot, ...pots],
        }).as('refreshPots');

        cy.findByRole('button', { name: '+Nova Poupança' }).click();

        cy.findByLabelText('Nome da Poupança').type('Nova Poupança');
        cy.findByLabelText('Valor da Meta').type('1000');

        cy.getByData('theme-dropdown').click();
        cy.contains('Exército').click();

        cy.findByRole('button', { name: 'Criar' }).click();

        cy.wait('@createPot');

        cy.findByText('Poupança criada com sucesso!').should('be.visible');

        cy.getByData('pot-card')
          .contains('Nova Poupança')
          .should('be.visible');
      });
    });
  });

  describe('Edita Poupança', () => {
    it('Should edit an existing pot successfully', () => {
      cy.fixture('pots.json').then((pots: PotData[]) => {
        const originalPot = pots[0];

        cy.intercept('PUT', `**/pots/${originalPot.id}`, (req) => {
          expect(req.body).to.include({
            name: originalPot.name,
            targetAmount: 1200,
            themeId: originalPot.theme.id,
          });

          req.reply({
            statusCode: 200,
            body: {
              ...originalPot,
              targetAmount: 1200,
            },
          });
        }).as('updatePot');

        cy.intercept('GET', '**/pots*', {
          statusCode: 200,
          body: [
            {
              ...originalPot,
              targetAmount: 1200,
            },
            ...pots.slice(1),
          ],
        }).as('refreshPots');

        cy.getByData('pot-card')
          .first()
          .within(() => {
            cy.getByData('actions-toggle').click();
            cy.getByData('edit-action').click();
          });

        cy.findByLabelText('Valor da Meta')
          .clear()
          .type('120000');

        cy.findByRole('button', { name: 'Editar' }).click();

        cy.wait('@updatePot');

        cy.findByText('Poupança atualizada com sucesso!')
          .should('be.visible');

        cy.getByData('pot-card')
          .first()
          .contains('R$ 1.200,00')
          .should('be.visible');
      });
    });
  });

  describe('Deleta Poupança', () => {
    it('Should delete a pot successfully', () => {
      cy.fixture('pots.json').then((pots: PotData[]) => {
        const potToDelete = pots.find(pot => pot.name === 'Presentes')!;
        const updatedPots = pots.filter(pot => pot.id !== potToDelete.id);

        cy.intercept('DELETE', '**/pots/*', {
          statusCode: 200,
        }).as('deletePot');

        cy.intercept(
          {
            method: 'GET',
            url: '**/pots*',
          },
          {
            statusCode: 200,
            body: updatedPots,
          },
        ).as('refreshPots');

        cy.getByData('pot-card')
          .contains('Presentes')
          .closest('[data-testid="pot-card"]')
          .within(() => {
            cy.getByData('actions-toggle').click();
            cy.getByData('delete-action').click();
          });

        cy.findByRole('button', { name: 'Deletar Poupança' }).click();

        cy.wait('@deletePot');
        cy.wait('@refreshPots');

        cy.findAllByText('Presentes').should('not.exist');
      });
    });
  });

  describe('Adicionar dinheiro na Poupança', () => {
    it('Should add money to an existing pot successfully', () => {
      cy.fixture('pots.json').then((pots: PotData[]) => {
        const originalPot = structuredClone(pots[0]);
        const amountToAdd = 20;

        cy.intercept('PUT', `**/pots/${originalPot.id}`, (req) => {
          expect(req.body).to.have.property('totalAmount');

          req.reply({
            statusCode: 200,
            body: {
              ...originalPot,
              totalAmount: 200,
            },
          });
        }).as('addMoney');

        cy.intercept('GET', '**/pots*', {
          statusCode: 200,
          body: [
            {
              ...originalPot,
              totalAmount: 200,
            },
            ...pots.slice(1),
          ],
        }).as('refreshPots');

        cy.getByData('pot-card')
          .first()
          .within(() => {
            cy.findByRole('button', { name: '+Add Dinheiro' }).click();
          });

        cy.findByLabelText('Valor Adicionado')
          .clear()
          .type(String(amountToAdd * 100));

        cy.findByRole('button', { name: 'Adicionar' }).click();

        cy.wait('@addMoney');
        cy.wait('@refreshPots');

        cy.findByText('Poupança atualizada com sucesso!')
          .should('be.visible');

        cy.getByData('pot-card')
          .first()
          .contains('R$ 200,00')
          .should('be.visible');
      });
    });
  });

  describe('Retirar dinheiro da Poupança', () => {
    it('Should remove money from an existing pot successfully', () => {
      cy.fixture('pots.json').then((pots: PotData[]) => {
        const originalPot = structuredClone(pots[0]);

        const amountToRemove = 20;

        cy.intercept('PUT', `**/pots/${originalPot.id}`, (req) => {
          expect(req.body).to.have.property('totalAmount');

          req.reply({
            statusCode: 200,
            body: {
              ...originalPot,
              totalAmount: 100,
            },
          });
        }).as('removeMoney');

        cy.intercept('GET', '**/pots*', {
          statusCode: 200,
          body: [
            {
              ...originalPot,
              totalAmount: 100,
            },
            ...pots.slice(1),
          ],
        }).as('refreshPots');

        cy.getByData('pot-card')
          .first()
          .within(() => {
            cy.findByRole('button', { name: 'Retirar' }).click();
          });

        cy.findByLabelText('Valor a retirar')
          .clear()
          .type(String(amountToRemove * 100));

        cy.getByData('confirm-remove-money').click();

        cy.wait('@removeMoney');
        cy.wait('@refreshPots');

        cy.findByText('Valor retirado com sucesso!').should('be.visible');

        cy.getByData('pot-card')
          .first()
          .contains('R$ 100,00')
          .should('be.visible');
      });
    });
  });
});
