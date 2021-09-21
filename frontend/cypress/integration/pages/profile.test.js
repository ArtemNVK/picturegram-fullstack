/* eslint-disable no-undef */
describe('Profile', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.config().baseUrl}/p/61425604cfbf9e7c48c9b4ed`);
  });

  it('goes to a profile page and validates the UI', () => {
    cy.get('body').within(() => {
      cy.get('div').should('contain.text', 'monet');
      cy.get('div').should('contain.text', 'Claude Monet');
      cy.get('div').should('contain.text', '9 photos');
      cy.get('div').should('contain.text', '1 follower');
      cy.get('div').should('contain.text', '0 following');
    });
  });
});
