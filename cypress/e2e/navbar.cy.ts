describe('Navbar', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForNuxtHydration();
  });

  context('telas até 767p', () => {
    beforeEach(() => {
      cy.viewport(767, 800);
    });

    it('deve ocultar texto do Link da navbar', () => {
      cy.get('a span').should('not.be.visible');
    });
  });

  context('telas até 991p', () => {
    beforeEach(() => {
      cy.viewport(991, 800);
    });

    it('deve ocultar logo e botão de colapsar navbar', () => {
      cy.getByData('logo-wrapper').should('not.be.visible');
      cy.get('button').contains('span', 'Minimize Menu').should('not.be.visible');
    });
  });

  context('telas a partir de 992p', () => {
    beforeEach(() => {
      cy.viewport(992, 800);
    });

    it('deve exibir todos os links do menu', () => {
      const expectedLabels = ['Overview', 'Transactions', 'Budgets', 'Pots', 'Recurring Bills'];

      cy.get('a span').should('have.length', expectedLabels.length).each((element, index) => {
        cy.wrap(element).should('have.text', expectedLabels[index]);
      });
    });

    it('deve ocultar textos da navbar ao clicar no botão de Minimize Menu', () => {
      cy.findByRole('button', { name: /Minimize Menu/i }).click();

      cy.get('button').contains('span', 'Minimize Menu').should('not.be.visible');
    });
  });
});
