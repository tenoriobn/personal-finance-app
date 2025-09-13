import type { mount } from 'cypress/vue';

type MountParams = Parameters<typeof mount>;
type OptionsParam = MountParams[1];

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      /**
       * Custom command to get element by data-test attribute
       * @example cy.getByData('submit-button')
     */
      getByData(selector: string): Chainable<JQuery<HTMLElement>>

      waitForNuxtHydration(): Chainable<void>
    }
  }
}
