describe('Login — Acesso à conta', () => {
  const visitPage = () => {
    cy.setPerformanceWarningAsSeen();
    cy.visit('/login');
    cy.waitForNuxtHydration();
  };

  const fillForm = () => {
    cy.findByLabelText('Email').type('bruno.teste@email.com');
    cy.findByLabelText('Senha').type('@Ab12345678');
  };

  const submitForm = () => {
    cy.findByRole('button', { name: 'Entrar' }).click();
  };

  beforeEach(() => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
      },
    }).as('loginRequest');
  });

  describe('Acesso à página', () => {
    it('Should load the login page', () => {
      visitPage();

      cy.findByRole('heading', { name: 'Acesse sua conta' }).should('be.visible');
      cy.findByLabelText('Email').should('be.visible');
      cy.findByLabelText('Senha').should('be.visible');
      cy.findByRole('button', { name: 'Entrar' }).should('be.visible');
    });
  });

  describe('Acesso à página de cadastro', () => {
    it('Should display link to register page', () => {
      visitPage();

      cy.findByRole('link', { name: 'Cadastre-se' }).should('be.visible');
    });

    it('Should navigate to register page when clicking on Cadastre-se link', () => {
      visitPage();

      cy.findByRole('link', { name: 'Cadastre-se' }).click();
      cy.location('pathname').should('eq', '/cadastro');
    });
  });

  describe('Fluxo principal (happy path)', () => {
    it('Should login successfully and redirect to home page', () => {
      visitPage();
      fillForm();

      submitForm();

      cy.wait('@loginRequest');
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('Variações reais', () => {
    it('Should navigate to register page when clicking on Cadastre-se link', () => {
      visitPage();

      cy.findByRole('link', { name: 'Cadastre-se' }).click();
      cy.location('pathname').should('eq', '/cadastro');
    });
  });

  describe('Estados de erro visíveis ao usuário', () => {
    it('Should display validation errors when submitting empty form', () => {
      visitPage();

      submitForm();

      cy.findByText('Digite um email válido, ex: \'email@email.com\'').should('be.visible');
    });

    it('Should display API error message when credentials are invalid', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: {
          message: 'Email ou senha incorretos',
        },
      }).as('loginError');

      visitPage();
      fillForm();

      submitForm();

      cy.wait('@loginError');
      cy.findByText(/email ou senha incorretos/i).should('be.visible');
    });
  });
});
