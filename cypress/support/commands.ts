// /// <reference types="cypress" />
// // ***********************************************
// // This example commands.ts shows you how to
// // create various custom commands and overwrite
// // existing commands.
// //
// // For more comprehensive examples of custom
// // commands please read more here:
// // https://on.cypress.io/custom-commands
// // ***********************************************
// //
// //
// // -- This is a parent command --
// // Cypress.Commands.add('login', (email, password) => { ... })
// //
// //
// // -- This is a child command --
// // Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
// //
// //
// // -- This is a dual command --
// // Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
// //
// //
// // -- This will overwrite an existing command --
// // Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// //
// // declare global {
// //   namespace Cypress {
// //     interface Chainable {
// //       login(email: string, password: string): Chainable<void>
// //       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
// //       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
// //       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
// //     }
// //   }
// // }

// // Declare global Cypress namespace to add custom commands
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       waitForPageLoad(): Chainable<void>;
//       fillShippingForm(userData: any): Chainable<void>;
//       addProductToCart(productIndex: number): Chainable<void>;
//     }
//   }
// }

// // Add custom commands for better test reliability
// Cypress.Commands.add('waitForPageLoad', () => {
//   cy.get('body').should('be.visible');
//   cy.wait(1000);
// });

// Cypress.Commands.add('fillShippingForm', (userData: any = {}) => {
//   const defaultData = {
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     phone: '+1234567890',
//     country: 'United States',
//     state: 'California',
//     city: 'Los Angeles',
//     address: '123 Main Street, Apt 4B'
//   };

//   const data = { ...defaultData, ...userData };

//   // Fill name
//   cy.get('input[name="name"], input[placeholder*="name" i]')
//     .should('be.visible')
//     .clear()
//     .type(data.name)
//     .wait(500);

//   // Fill email
//   cy.get('input[name="email"], input[type="email"]')
//     .should('be.visible')
//     .clear()
//     .type(data.email)
//     .wait(500);

//   // Fill phone
//   cy.get('input[name="phone"], input[type="tel"]')
//     .should('be.visible')
//     .clear()
//     .type(data.phone)
//     .wait(500);

//   // Fill address fields - Handle Headless UI dropdowns
//   // Country dropdown
//   cy.get('[id*="headlessui-listbox-button"]')
//     .first() // First dropdown is usually country
//     .should('be.visible')
//     .click()
//     .wait(500);

//   // Select first available country option
//   cy.get('[role="option"]').first().should('be.visible').click().wait(1000);

//   // State dropdown (second dropdown)
//   cy.get('[id*="headlessui-listbox-button"]')
//     .eq(1) // Second dropdown is usually state
//     .should('be.visible')
//     .should('not.be.disabled')
//     .click()
//     .wait(500);

//   // Select first available state option
//   cy.get('[role="option"]').first().should('be.visible').click().wait(1000);

//   // City dropdown (third dropdown)
//   cy.get('[id*="headlessui-listbox-button"]')
//     .eq(2) // Third dropdown is usually city
//     .should('be.visible')
//     .should('not.be.disabled')
//     .click()
//     .wait(500);

//   // Select first available city option
//   cy.get('[role="option"]').first().should('be.visible').click().wait(1000);

//   // Fill address
//   cy.get('textarea[name="shipping_address.address"], textarea[placeholder*="address" i]')
//     .should('be.visible')
//     .clear()
//     .type(data.address)
//     .wait(500);
// });

// Cypress.Commands.add('addProductToCart', (productIndex: number = 0) => {
//   cy.get('.productCard__link')
//     .should('be.visible')
//     .should('have.length.at.least', productIndex + 1)
//     .eq(productIndex)
//     .click();

//   cy.wait(2000);

//   cy.get('.addToCart').should('be.visible').should('not.be.disabled').click();

//   cy.wait(3000);
// });
