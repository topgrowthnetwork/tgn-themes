describe('Checkout Flow', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
    // Wait for the page to load completely
    cy.wait(2000);
  });

  it('should complete a full checkout flow from homepage to thank you page', () => {
    // Step 1: Visit the homepage (already done in beforeEach)
    cy.log('✅ Step 1: Homepage loaded');

    // Step 2: Click on 2nd product card link
    cy.get('[data-testid="product-card-link"]')
      .should('be.visible')
      .should('have.length.at.least', 2)
      .eq(2) // Get the 3nd product card link
      .click();

    cy.wait(2000); // Wait for navigation to product page
    cy.log('✅ Step 2: Clicked on 2nd product card');

    // Verify we're on a product page
    cy.url().should('include', '/product/');
    cy.wait(1000);

    // Step 3: Click on Add to Cart button
    cy.get('[data-testid="add-to-cart-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.wait(3000); // Wait for cart modal to load and open
    cy.log('✅ Step 3: Clicked Add to Cart');

    // Verify cart modal is open (look for cart-related elements)
    cy.get('[data-testid="cart-modal"], .cart-modal, [role="dialog"]')
      .should('be.visible')
      .wait(1000);

    // Step 4: Click on proceed to checkout link
    cy.get('[data-testid="proceed-to-checkout"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.wait(2000); // Wait for navigation to checkout page
    cy.log('✅ Step 4: Clicked proceed to checkout');

    // Verify we're on the checkout page
    cy.url().should('include', '/checkout');
    cy.wait(1000);

    // Step 5: Fill user information form (shipping form)
    cy.log('✅ Step 5: Filling shipping form');

    // Fill name
    cy.get('[data-testid="shipping-form-name"]')
      .should('be.visible')
      .clear()
      .type('John Doe')
      .wait(500);

    // Fill email
    cy.get('[data-testid="shipping-form-email"]')
      .should('be.visible')
      .clear()
      .type('moaaz_bs@yahoo.com')
      .wait(500);

    // Fill phone
    cy.get('[data-testid="shipping-form-phone"]')
      .should('be.visible')
      .clear()
      .type('01027050131')
      .wait(500);

    // Fill address fields - Handle Headless UI dropdowns
    // Country dropdown
    cy.get('[data-testid="shipping-form-country"]').should('be.visible').click().wait(500);

    // Select first available country option
    cy.get('[data-testid="shipping-form-country-option-0"]')
      .should('be.visible')
      .click()
      .wait(1000);

    // State dropdown (second dropdown)
    cy.get('[data-testid="shipping-form-state"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click()
      .wait(500);

    // Select first available state option
    cy.get('[data-testid="shipping-form-state-option-0"]').should('be.visible').click().wait(1000);

    // City dropdown (third dropdown)
    cy.get('[data-testid="shipping-form-city"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click()
      .wait(500);

    // Select first available city option
    cy.get('[data-testid="shipping-form-city-option-0"]').should('be.visible').click().wait(1000);

    // Fill address
    cy.get('[data-testid="shipping-form-address"]')
      .should('be.visible')
      .clear()
      .type('123 Main Street, Apt 4B')
      .wait(500);

    // Step 6: Click on shipping form submit button
    cy.get('[data-testid="shipping-form-submit"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.wait(3000); // Wait for payment form to load
    cy.log('✅ Step 6: Submitted shipping form');

    // Verify payment form is now visible
    cy.get('[data-testid="payment-form"]').should('be.visible').wait(1000);

    // Step 7: Select cash on delivery payment method
    cy.get('[data-testid="payment-form-radio-cash_on_delivery"]').should('be.visible').check();

    cy.wait(5000);
    cy.log('✅ Step 7: Selected cash on delivery');

    // Verify the radio button is checked
    cy.get('.cash_on_delivery, input[value="cash_on_delivery"]').should('be.checked');

    // Step 8: Click on payment form submit button
    cy.get('[data-testid="payment-form-submit"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.wait(5000); // Wait for checkout processing and redirect
    cy.log('✅ Step 8: Submitted payment form');

    // Step 9: Verify we're on the thank you page
    cy.url().should('include', '/en/thank-you');
    cy.wait(2000);

    // Additional verification for thank you page content
    cy.get('[data-testid="thank-you-page"]').should('be.visible').wait(1000);

    cy.log('✅ Step 9: Successfully reached thank you page');
    cy.log('🎉 Checkout flow completed successfully!');
  });

  //   // Additional test for error handling
  //   it('should handle form validation errors gracefully', () => {
  //     // Navigate to checkout page directly
  //     cy.visit('/checkout');
  //     cy.wait(2000);

  //     // Try to submit shipping form without filling required fields
  //     cy.get('.shippingForm__submit').should('be.visible').click();

  //     cy.wait(1000);

  //     // Verify validation errors are displayed
  //     cy.get('.field-error, [data-testid="field-error"]')
  //       .should('be.visible')
  //       .and('have.length.at.least', 1);

  //     cy.log('✅ Form validation working correctly');
  //   });

  //   // Test for cart functionality
  //   it('should add multiple items to cart', () => {
  //     // Add first item
  //     cy.get('.productCard__link').eq(0).click();
  //     cy.wait(2000);

  //     cy.get('.addToCart').click();
  //     cy.wait(3000);

  //     // Go back to homepage
  //     cy.visit('/');
  //     cy.wait(2000);

  //     // Add second item
  //     cy.get('.productCard__link').eq(1).click();
  //     cy.wait(2000);

  //     cy.get('.addToCart').click();
  //     cy.wait(3000);

  //     // Verify cart has multiple items
  //     cy.get('.cart-item, [data-testid="cart-item"]').should('have.length.at.least', 2);

  //     cy.log('✅ Multiple items added to cart successfully');
  //   });
});
