// // ***********************************************************
// // This example support/e2e.ts is processed and
// // loaded automatically before your test files.
// //
// // This is a great place to put global configuration and
// // behavior that modifies Cypress.
// //
// // You can change the location of this file or turn off
// // automatically serving support files with the
// // 'supportFile' configuration option.
// //
// // You can read more here:
// // https://on.cypress.io/configuration
// // ***********************************************************

// // Import commands.js using ES2015 syntax:
// import './commands';

// // Alternatively you can use CommonJS syntax:
// // require('./commands')

// // Add custom commands for better test reliability
// Cypress.Commands.add('waitForPageLoad', () => {
//   cy.get('body').should('be.visible');
//   cy.wait(1000);
// });

// Cypress.Commands.add('fillShippingForm', (userData = {}) => {
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

//   // Fill address fields
//   cy.get('select[name="shipping_address.country"], [data-testid="country-select"]')
//     .should('be.visible')
//     .select(data.country)
//     .wait(1000);

//   cy.get('select[name="shipping_address.state"], [data-testid="state-select"]')
//     .should('be.visible')
//     .should('not.be.disabled')
//     .select(data.state)
//     .wait(1000);

//   cy.get('select[name="shipping_address.city"], [data-testid="city-select"]')
//     .should('be.visible')
//     .should('not.be.disabled')
//     .select(data.city)
//     .wait(1000);

//   cy.get('textarea[name="shipping_address.address"], textarea[placeholder*="address" i]')
//     .should('be.visible')
//     .clear()
//     .type(data.address)
//     .wait(500);
// });

// Cypress.Commands.add('addProductToCart', (productIndex = 0) => {
//   cy.get('.productCard__link')
//     .should('be.visible')
//     .should('have.length.at.least', productIndex + 1)
//     .eq(productIndex)
//     .click();

//   cy.wait(2000);

//   cy.get('.addToCart').should('be.visible').should('not.be.disabled').click();

//   cy.wait(3000);
// });

// // Global error handling
// Cypress.on('uncaught:exception', (err, runnable) => {
//   // Returning false here prevents Cypress from failing the test
//   // for uncaught exceptions that might be expected in some scenarios
//   if (err.message.includes('ResizeObserver loop limit exceeded')) {
//     return false;
//   }
//   return true;
// });

// // Add custom assertions
// chai.Assertion.addMethod('containText', function (text) {
//   const obj = this._obj;
//   this.assert(
//     obj.text().includes(text),
//     `expected #{this} to contain text '${text}'`,
//     `expected #{this} to not contain text '${text}'`,
//     text,
//     obj.text()
//   );
// });

// Import commands.js using ES2015 syntax:
import './commands';
