describe.skip('Navbar', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForNuxtHydration();
  });

  context('telas até 767p', () => {
    beforeEach(() => {
      cy.viewport(767, 800);
    });

    it('should hide navbar link text on small screens', () => {
      cy.get('a span').should('not.be.visible');
    });
  });

  context('telas até 991p', () => {
    beforeEach(() => {
      cy.viewport(991, 800);
    });

    it('should hide logo and navbar collapse button on medium screens', () => {
      cy.getByData('logo-wrapper').should('not.be.visible');
      cy.get('button').contains('span', 'Ocultar Menu').should('not.be.visible');
    });
  });

  context('telas a partir de 992p', () => {
    beforeEach(() => {
      cy.viewport(992, 800);
    });

    it('should display all navbar menu links on large screens', () => {
      const expectedLabels = ['Visão Geral', 'Transações', 'Orçamentos', 'Poupanças', 'Recorrentes'];

      cy.get('a span').should('have.length', expectedLabels.length).each((element, index) => {
        cy.wrap(element).should('have.text', expectedLabels[index]);
      });
    });

    it('should toggle the visibility of navbar links when clicking the "Ocultar Menu" button', () => {
      const toggleButton = () => cy.findByRole('button', { name: /Ocultar Menu/i });

      toggleButton().click();
      toggleButton().find('span').should('not.be.visible');
      cy.get('a span').should('not.be.visible');

      toggleButton().click();
      toggleButton().find('span').should('be.visible');
      cy.get('a span').should('be.visible');
    });
  });
});
