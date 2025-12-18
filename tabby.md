Online Custom Integration

# On‑Site Messaging

Tabby provides JavaScript snippets that display promotional messaging on your Product, Cart and Checkout pages. These snippets show split price information and a “Learn More” widget that opens a pop-up when clicked.

[​

](#overview)

## Overview

Tabby promotional snippets help increase customer awareness and conversion rates by displaying payment options directly on your store pages. The implementation includes:

- **Product and Cart page snippet** - shows split payment options on product pages and the shopping cart page
- **Checkout snippet** - provides payment details during checkout

![Product page snippet](https://mintcdn.com/tabby-5f40add6/MNU7VcFJsgE-sYyU/images/pdp-snippet-th.png?fit=max&auto=format&n=MNU7VcFJsgE-sYyU&q=85&s=54412cade7003d33dc170e3e000fbe38)![Product page snippet](https://mintcdn.com/tabby-5f40add6/MNU7VcFJsgE-sYyU/images/pdp-snippet-aldo.png?fit=max&auto=format&n=MNU7VcFJsgE-sYyU&q=85&s=119b4ecc2e7b198bf629010e5be5a20b)![Checkout page snippet](https://mintcdn.com/tabby-5f40add6/U3aDdORLG-8Qw1A4/images/checkout-snippet.png?fit=max&auto=format&n=U3aDdORLG-8Qw1A4&q=85&s=7c9d9b4bdaf794b7509b411a4bf7151d)

Ensure snippets fit mobile screen widths and are appropriately sized for desktop. All promo snippets and pop-up widgets must fit within screen dimensions.

[​

](#product-and-cart-page-snippet)

## Product and Cart Page Snippet

The Product and Cart page snippet uses the `TabbyPromo` component to display promotional messaging on product and cart pages. Create an empty `<div>` element with a unique selector, preferably using an `id`:

Copy

    <div id="TabbyPromo"></div>

For maximum visibility, place the container in one of the suggested places:

- **Product**: near the product price or next to the “Add to cart” button;
- **Cart**: below the total cart amount.

Include the Tabby Promo script in your page and initialize the `TabbyPromo` component after the script loads:

Copy

    <script src="https://checkout.tabby.ai/tabby-promo.js"></script>
    <script>
      new TabbyPromo({
        selector: '#TabbyPromo', // required
        currency: 'AED', // required, 'AED' or 'SAR' or 'KWD', uppercase, no spaces
        price: '1200.00', // required, 2 decimal places for AED, SAR; 3 decimal places for KWD
        lang: 'en', // optional, 'en' or 'ar'
        source: 'product', // optional, 'product' or 'cart'
        shouldInheritBg: false, // optional, true or false
        publicKey: 'your_pk', // required, Your public key
        merchantCode: 'your_merchant_code' // required, Your merchant code, based on your store currency
      });
    </script>

###

[​

](#complete-product-and-cart-snippet-example)

Complete Product and Cart Snippet Example

Copy

    <html>
      <body>
        <div id="TabbyPromo"></div>
        <script src="https://checkout.tabby.ai/tabby-promo.js"></script>
        <script>
          new TabbyPromo({
            selector: '#TabbyPromo',
            currency: 'AED',
            price: '1200.00',
            lang: 'en',
            source: 'product',
            shouldInheritBg: false,
            publicKey: 'your_pk',
            merchantCode: 'your_merchant_code'
          });
        </script>
      </body>
    </html>

[​

](#checkout-snippet)

## Checkout Snippet

The checkout snippet uses the `TabbyCard` component to display payment information during checkout. Create an empty `div` element where the Tabby Card will be displayed:

Copy

    <div id="tabbyCard"></div>

Place this div under the Tabby payment method option. Display it when the Tabby payment method is selected. Load and Initialize TabbyCard:

Copy

    <script src="https://checkout.tabby.ai/tabby-card.js"></script>
    <script>
      new TabbyCard({
        selector: '#tabbyCard', // required
        currency: 'SAR', // required, 'AED' or 'SAR' or 'KWD', uppercase, no spaces
        price: '1600.00', // required, 2 decimal places for AED, SAR; 3 decimal places for KWD
        lang: 'en', // optional, 'en' or 'ar'
        shouldInheritBg: false, // optional, true or false
        publicKey: 'your_pk', // required, Your public key
        merchantCode: 'your_merchant_code' // required, Your merchant code, based on your store currency
      });
    </script>

###

[​

](#complete-checkout-snippet-example)

Complete Checkout Snippet Example

Copy

    <div id="tabbyCard"></div>
    <html>
      <body>
        <div id="tabby"></div>
        <script src="https://checkout.tabby.ai/tabby-card.js"></script>
        <script>
          new TabbyCard({
            selector: '#tabbyCard',
            currency: 'SAR',
            price: '1600.00',
            lang: 'en',
            shouldInheritBg: false,
            publicKey: 'your_pk',
            merchantCode: 'your_merchant_code'
          });
        </script>
      </body>
    </html>

[​

](#custom-promo-snippets)

## Custom Promo Snippets

If you can’t use Tabby’s JavaScript promo components (e.g., due to framework constraints, security policies, or custom requirements), you can use Tabby’s “Learn More” pop-up widgets via direct URLs.

Before implementing custom promo snippets, you must discuss and confirm the desired solution with your Tabby account manager.

###

[​

](#when-to-use-custom-promo-snippets)

When to use custom promo snippets?

Consider custom promo snippets when:

- You can’t load external JavaScript files due to security policies
- You’re building a native mobile app and need webview integration - [check our Mobile App Promo Messaging guide](https://docs.tabby.ai/pay-in-4-custom-integration/mobile-apps/app-promo-messaging)
- You need complete control over snippet styling and behaviour

###

[​

](#pop-up-url-structure-and-examples)

Pop-up URL structure and examples

The pop-up URL follows this pattern:

Description

URL

UAE Pop-up, English

[**https://checkout.tabby.ai/promos/product-page/installments/en/?price=340.00&currency=AED&merchant_code=AE&public_key=pk_xyz**](https://checkout.tabby.ai/promos/product-page/installments/en/?price=340.00&currency=AED&merchant_code=AE&public_key=pk_...)

KSA Pop-up, Arabic

[**https://checkout.tabby.ai/promos/product-page/installments/ar/?price=100&currency=SAR&merchant_code=SA&public_key=pk_xyz**](https://checkout.tabby.ai/promos/product-page/installments/ar/?price=100&currency=SAR&merchant_code=SA&public_key=pk_...)

####

[​

](#url-parameters)

URL Parameters

Parameter

Required

Description

Values

`merchant_code`

Yes

Your merchant code

Provided by Tabby

`public_key`

Yes

Your Tabby public key

`'pk_test_...'`, `'pk_...'`

`price`

Yes

Product or cart price

`'1200.00'`, `'99.99'`, `'5.500'` (3 decimals for KWD only)

`currency`

Yes

Currency code

`AED`, `SAR`, `KWD`

`lang`

No

Language code

`en`, `ar`

![UAE pop-up with price, en](https://mintcdn.com/tabby-5f40add6/P693KbtvGHftcJLw/images/custom-uae-en-0625.JPG?fit=max&auto=format&n=P693KbtvGHftcJLw&q=85&s=4705d8f2eacfe6bd9b9a996302fb3d8e)![KSA pop-up with price, ar](https://mintcdn.com/tabby-5f40add6/P693KbtvGHftcJLw/images/custom-ksa-ar.JPG?fit=max&auto=format&n=P693KbtvGHftcJLw&q=85&s=cc2a250ded13061d38336db098763e58)

[​

](#best-pracitces)

## Best Pracitces

###

[​

](#security-and-performance)

Security and Performance

- Never expose your Secret API Key in frontend code - only Public Key should be used there;
- Make sure snippet update is triggered when prices change on product pages with variant selectors;
- Consider lazy loading snippets for below-the-fold content;
- Use event listeners to detect when scripts load before initializing components.

###

[​

](#responsive-design)

Responsive Design

- Ensure snippets fit mobile screen widths (typically 320px minimum);
- Verify snippet visibility across different screen sizes;
- Use CSS media queries for custom styling.

Was this page helpful?

YesNo

[Webhooks](/pay-in-4-custom-integration/webhooks)[Mobile App SDKs](/pay-in-4-custom-integration/mobile-apps/sdk-all)

Ctrl+I

[facebook](https://www.facebook.com/tabbypay-100185885064531/)[instagram](https://instagram.com/tabbypay)[linkedin](https://www.linkedin.com/company/tabbypay)[x](https://twitter.com/paywithtabby?lang=en)

[Powered by Mintlify](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=tabby-5f40add6)
