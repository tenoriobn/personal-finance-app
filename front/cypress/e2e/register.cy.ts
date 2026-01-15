describe('Cadastro — Criação de conta', () => {
  const visitPage = () => {
    cy.setPerformanceWarningAsSeen();
    cy.visit('/cadastro');
    cy.waitForNuxtHydration();
  };

  const fillForm = () => {
    cy.findByLabelText('Nome').type('Bruno Teste');
    cy.findByLabelText('Email').type('bruno.teste@email.com');
    cy.findByLabelText('Senha').type('@Ab12345678');
    cy.findByLabelText('Confirmar Senha').type('@Ab12345678');
  };

  const submitForm = () => {
    cy.findByRole('button', { name: 'Cadastrar' }).click();
  };

  beforeEach(() => {
    cy.intercept('POST', '**/auth/register', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
      },
    }).as('registerRequest');
  });

  describe('Acesso à página', () => {
    it('Should load the registration page', () => {
      visitPage();

      cy.findByRole('heading', { name: 'Crie sua conta' }).should('be.visible');
      cy.findByLabelText('Nome').should('be.visible');
      cy.findByLabelText('Email').should('be.visible');
      cy.findByLabelText('Senha').should('be.visible');
      cy.findByLabelText('Confirmar Senha').should('be.visible');
      cy.findByRole('button', { name: 'Cadastrar' }).should('be.visible');
    });
  });

  describe('Acesso à página de Login', () => {
    it('Should display link to login page', () => {
      visitPage();

      cy.findByRole('link', { name: 'Entrar' }).should('be.visible');
    });

    it('Should navigate to login page when clicking on Entrar link', () => {
      visitPage();

      cy.findByRole('link', { name: 'Entrar' }).click();
      cy.location('pathname').should('eq', '/login');
    });
  });

  describe('Fluxo principal (happy path)', () => {
    it('Should register successfully and redirect to home page', () => {
      visitPage();

      fillForm();

      submitForm();

      cy.wait('@registerRequest');
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('Variações reais', () => {
    it('Should navigate to login page when clicking on Entrar link', () => {
      visitPage();

      cy.findByRole('link', { name: 'Entrar' }).click();
      cy.location('pathname').should('eq', '/login');
    });
  });

  describe('Estados de erro visíveis ao usuário', () => {
    it('Should display validation errors when submitting empty form', () => {
      visitPage();

      submitForm();

      cy.findByText('O nome deve ter pelo menos 3 caracteres').should('be.visible');
      cy.findByText('Digite um email válido, ex: \'email@email.com\'').should('be.visible');
      cy.findByText('A senha deve ter pelo menos 8 caracteres').should('be.visible');
      cy.findByText('Confirme sua senha').should('be.visible');
    });

    it('Should display API error message when email already exists', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 400,
        body: {
          message: 'E-mail já cadastrado',
        },
      }).as('registerError');

      visitPage();
      fillForm();

      cy.findByRole('button', { name: 'Cadastrar' }).click();

      cy.wait('@registerError');
      cy.findByText(/e-mail já cadastrado/i).should('be.visible');
    });
  });
});
