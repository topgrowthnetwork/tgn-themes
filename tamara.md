/\*! tailwindcss v4.1.17 | MIT License | https://tailwindcss.com \*/ @layer theme, base, components, utilities; @layer utilities; ![](https://files.readme.io/92887ff03d34eb833f637f7232ebec668e3b1ffc008f7a36c01e02eae3317c66-image.png)

What’s new

# [](#whats-new)

1\. Tamara logo and branding

## [](#1-tamara-logo-and-branding)

![](https://files.readme.io/a3add6cb78ec410463b624a1858eecf4c8d84366bca1cf8e39f9bdb727d1ca81-image.png)

At Tamara, we are constantly evolving to meet the needs of our customers and partners. We are excited to refresh our logo, branding, and colours to present a more modern and unified identity that reflects our growth, values, and vision for the future.

###

What you need to do

[](#what-you-need-to-do)

- Replace older Tamara logos with the new version across your website, including footers, banners, carousels, and any in-line brand placements.
- Use only the official, approved assets from our [brand kit](https://cdn.tamara.co/merchant_docs/Tamara__Brand__Assets_v2.zip).

2\. Extended payment options

## [](#2-extended-payment-options)

![](https://files.readme.io/733f626cffb7935273c136ad360c6015198c6017ec54f780bd38933a0f864154-image.png)

Tamara has become a trusted name across the MENA region, known for providing customers with flexible payment solutions of up to 6 payments. As customer needs continue to evolve, we’re expanding our offering; now allowing customers to split their payments into up to 12 payments. This gives your customers even greater purchasing power, helping you drive higher conversions, increase average order value, and build stronger customer loyalty.

###

What you need to do

[](#what-you-need-to-do-1)

- **Review the updated product plan logic** in the [API documentation](/docs/introduction-to-tamara).
- Ensure your integration supports dynamic payment configurations, including 4 and 12 month options where applicable.
- Double-check that messaging and amounts reflect accurate pricing based on product or cart value.

3\. Updated widgets messaging

## [](#3-updated-widgets-messaging)

![](https://files.readme.io/f9b6464c104e5830dc8f53a4270a7e9ddca9ab9999f6dbd9e58f0b226a8b4c3e-image.png)

With Tamara’s expanding product offerings, our messaging has been refined to better communicate the value of flexible payments. We are updating our messaging to reflect our long-term 12-month offering. The updated widget copy clearly communicates key benefits such as affordability, Sharia-compliance, and ease of use, ensuring consistency across all touchpoints.

###

What you need to do

[](#what-you-need-to-do-2)

- Replace any legacy or custom Tamara copy with the [new approved messaging](/docs/tamara-widget-implementation-guidelines-saudi-arabia#/122-%EF%B8%8F-recommended-messaging).
- Use the Messaging Pillars section to ensure you're covering all key value points.

4\. Refreshed checkout experience

## [](#4-refreshed-checkout-experience)

![](https://files.readme.io/193f79aa72449fc9889a1a7c98d1a832c8a120c4c9e4dd7c3d892bd570cecd95-image.png)

The checkout experience now features our updated design system, reflecting Tamara’s refreshed branding and support for long-term payment plans.

###

What you need to do

[](#what-you-need-to-do-3)

- Update your configuration to support the new 12-month payment plan alongside the existing 4-plan option.
- Update your store widgets to reflect this change. Refer to the updated [widget guidelines](/docs/tamara-widget-implementation-guidelines-saudi-arabia#/10-implementation-essentials) in Section 1.0.

5\. Updated Guidelines

## [](#5-updated-guidelines)

![](https://files.readme.io/ca8fd9d5c18173a0eb7b33fde060abab7ec9f77ae4c5a65930ea839d69407b0f-image.png)

With the launch of our refreshed branding and expanded payment options, we've updated our integration guidelines to reflect these exciting changes. The updated guidelines are designed to help you present Tamara consistently across your channels, clearly communicate the Tamara’s benefits to your customers, and make the most of our expanded payment flexibility. We encourage you to review and adopt the new guidelines to stay aligned and maximize the impact for your business.

###

What you need to do

[](#what-you-need-to-do-4)

- Review the implementation guidelines below
- Align your Tamara’s widget implementation with the new guidelines.
- Reach out to your Tamara account manager if you have any questions or need support.

1.0. Implementation Essentials

# [](#10-implementation-essentials)

We understand that you need to balance multiple priorities in your e-commerce store design. Your brand identity, customer experience, and page real estate are valuable assets that require careful consideration. This flexible integration guide is designed to help you implement Tamara Widgets in a way that complements your existing design while still effectively communicating payment flexibility to your customers.

While we offer flexibility in implementation, these core elements must be present:

- **Clear indication that Tamara is available** as a payment option.
- **Tamara’s messaging pillars**: customer value and competitive advantage.
- **Accurate representation** of Tamara’s plan structures.
- A **call-to-action (CTA)** for customers to learn more about Tamara. e.g.: a link or button.
- **Pop up**: Triggered when a user clicks the CTA that provides more detail about Tamara’s payment options.
- **Design and branding**: Adherence to our official guidelines for visual presentation to ensure the widget is clear, trustworthy, and consistent.

> 👍
>
> We recommend using [Tamara’s official Widgets](https://widget-docs.tamara.co/tamara-summary) to easily communicate payment flexibility to your customers. Our widgets are designed to integrate seamlessly with your e-commerce store, helping you deliver a smooth experience without compromising your brand identity or design.

1.1. Clear indication that Tamara is available as a payment option

## [](#11-clear-indication-that-tamara-is-available-as-a-payment-option)

Customers should know that Tamara is available as a payment option, no matter where they land on your site. The easiest way is to ensure that the Tamara logo is included in the widgets. This should be consistently shown across key points in the purchase journey, including the product details page, cart, and checkout.

Requirements:

Legend

Priority

Requirement

Description

1

Primary

Tamara logo

Always include the Tamara logo in the widget to reinforce brand recognition.

2

Fallback

Tamara as text

If space constraints prevent using the logo, mention “Tamara” in the messaging.

![](https://files.readme.io/3e4f313ff20d24e109291f25f5f809069b66004c9cc46a6b945457a21ffce8f5-image.png)  
![](https://files.readme.io/53088aa7df693df0d76cbe7e6bed8b184cd8dea6ababc52f6fdb80a41d75fc55-image.png)

> 👍
>
> The logo is the preferred primary method. Text-only mentions should only be used in rare edge cases where space or layout constraints apply.

1.2. Messaging pillars

## [](#12-messaging-pillars)

Clear and consistent messaging about Tamara's payment options and benefits helps customers understand the value. When communicating about Tamara, we recommend using Tamara’s official messaging, which has been carefully crafted to explain our offering clearly and deliver the best possible experience for your customers.

If you need to adapt the messaging, be sure to include the following three core messaging pillars.

###

1.2.1. Minimum Requirements:

[](#121-minimum-requirements)

Legend

Pillars

Description

English

Arabic

Why it matters

1

**Long term financing**

Indicates our value in flexibility and affordability

**Pay SAR 208/mo**

**ادفع SAR208\\شهريًا**

Communicates lower potential monthly costs and wider accessibility.

2

**4 Payment option**

Highlights Tamara’s well-known 4-split option

**or in 4 payments**

**أو على 4 دفعات**

Reinforces the familiar payment experience customers recognize and trust.

3

**Competitive differentiator**

Highlights what makes us stand out from our competitors

**Sharia-compliant**

**متوافقة مع الشريعة الإسلامية.**

Builds credibility, appeals to local values.

4

**Call to Action (CTA)**

Prompts users to learn more or view their plan options

**More options**

**تعرّف على خياراتك**

Encourages interaction, and deepens understanding.

5

**Logo**

Always display the official Tamara logo in widgets

**Tamara gradient logo**

**Tamara gradient logo**

Serves as a visual anchor across key touchpoints to drive recognition and trust.

![](https://files.readme.io/8172670a26be0f08808dcc1ebac6a4840d48a1ed9446eaecf5a47bb5249c75e4-image.png)

###

1.2.2. ⭐️ Recommended Messaging

[](#122-️-recommended-messaging)

We strongly encourage you to use Tamara’s official messaging, it’s designed and tested to explain our offering clearly and deliver the best possible experience for your customers. Custom messaging may lead to confusion, or outdated information.

Language

Messaging

English

Pay SAR 208/mo or in 4 payments. Sharia-compliant. More options

Arabic

ادفع SAR 208\\شهريًا أو على 4 دفعات. متوافقة مع الشريعة الإسلامية. تعرّف على خياراتك

![](https://files.readme.io/4941df12075e0114b0f029b16d82ec3de85c9fc3f229ef110cb48782a2c8f504-image.png)

###

1.2.3. Messaging do’s & don’ts

[](#123-messaging-dos--donts)

✅ Do’s

❌ Don’ts

DO include all core pillars: long term financing, 4 plan option, competitive differentiator, CTA & Tamara logo.

DON'T skip any pillars or create messaging that does not align with Tamara’s core messaging.

![](https://files.readme.io/c6f56c9968fc2018942d7036aee6d1e6f151d58cfac71fb3d588824cb18399b2-image.png)

1.3. Accurate representation of Tamara’s plan structures

## [](#13-accurate-representation-of-tamaras-plan-structures)

We recommend displaying the potential payment plan for a product or order, e.g., “Pay SAR 208/mo”. To ensure accuracy and transparency, the amounts shown must reflect the actual product or order value divided by the configured number of payments (4 or 12). This ensures the messaging is clear, trustworthy, and aligned with what the customer will actually pay.

###

1.3.1. Requirements

[](#131-requirements)

Requirements

Description

Example

Why it matters

Dynamic item or cart total calculation

Divide the product price (PDP) or order/cart total (Cart/Checkout) by the number of payments.

**Product** **price**: SAR 2500

**Number** **of payment configured**: 12

**Calculation**: SAR 200 ÷ 12 = 208.33

**Value**: ”Pay **SAR** **208**/month”

Ensures pricing reflects actual product or cart value, and helps customers understand what they will pay.

Accurate Rounding

Apply standard rounding rules to the monthly payment shown.

SAR 208.33 → SAR 208

Avoids displaying misleading decimal amounts.

Contextual Relevance

Ensure the message reflects the page context such as Product details page, Cart and Checkout.

**Product Page**: The widget shows the payment plan for the price (e.g., SAR 2500) of a single item being viewed.

E.g., "Pay SAR 208/month"

**Cart or Checkout Page**: The widget updates to show the plan for the entire cart/checkout total (e.g.: SAR 3000).

E.g., "Pay SAR 250/month”

Maintains consistency with where the customer is in the purchase journey and builds trust down the funnel.

Updated in Real-Time

Re-calculate the payment plan in real-time to reflect the new cart total any time a user modifies their cart.This includes:

**Initial Cart**: 1 item @ SAR 2500. Widget shows "Pay SAR 208/mo".

**User Action**: Changes quantity to 2.

**Instant Update**: Widget immediately refreshes to show "Pay SAR 416/mo".

Keeps payment info accurate as users modify their cart, reducing confusion.

###

1.3.2. Plans representation do’s & don’ts

[](#132-plans-representation-dos--donts)

✅ Do’s

❌ Don’ts

DO calculate the payment amount dynamically based on the current product price or total cart value.

DON'T hardcode the payment amount. This is the #1 source of customer confusion.

DO ensure the payment amount updates instantly when the cart is modified (e.g., quantity change, discount).

DON'T show a stale or cached payment amount after the cart has been changed.

DO apply standard rounding rules to avoid displaying confusing decimal amounts (e.g., SAR 208.33 → SAR 208).

DON'T display fractional currency amounts like "SAR 208.33" in the widget message.

![](https://files.readme.io/64cd38cbd41f7a56d7281a41f7740344bca168077f509a1403248e6c8ce29bba-image.png)

1.4. A link button for customers to learn more about Tamara

## [](#14-a-link-button-for-customers-to-learn-more-about-tamara)

Tamara widgets should provide a subtle way for customers to access additional information about Tamara’s payment plan offerings.

###

1.4.1 Minimum Requirements

[](#141-minimum-requirements)

Legend

Requirement

Description

Example

Why It Matters

1

Interactive Element

Provide a clickable element (e.g. link, button).

“More options”

Enables users to explore additional information when they choose.

2

Pop up

The link button should open Tamara’s official pop.

Popup displaying available payment options and more about Tamara’s offering.

Allows users to view full plan information without disrupting their shopping flow.

![](https://files.readme.io/b07ef4734e472f56ef41e7094cc17b85c15e071b3e21a8bb5aa7cd2bec4f8775-image.png)

> 👍
>
> We recommend a link button with the text “More options”.

1.5. Design and branding

## [](#15-design-and-branding)

When implementing Tamara widgets on your e-commerce platform, striking the right balance between Tamara's brand presence and your own design system is essential. Follow these guidelines to create a cohesive, trustworthy experience that enhances your conversion rates while maintaining your brand identity.

###

1.5.1. Design specifications

[](#151-design-specifications)

Legend

Requirement

Description

Notes

1

**Widget Container**

Place the widget inside a rounded rectangular container with a white background to ensure message clarity.

Container colours, backgrounds, and border radius can match your store’s design system.

2

**Typography**

Use 14px (mobile) to 16px (desktop) font size for widget text. Font weight 400 for general text.

You may use your store's font for the widget content.

3

**Payment emphasis**

Bold the payment cost portion using font weight 600 or 700 (e.g. “SAR 208/mo”).

Emphasizes the key value proposition to the customer.

4

**Call-to-action: Link Button**

Include an interactive text link (e.g. “More options”) to open the pop up.

Link styling may adopt your store’s colours and styling.

5

**Padding**

We recommend a 16px internal padding inside the widget container on all sides.

Maintains clarity and balance.

6

**Content Margin**

Maintain 16px margin between text content and Tamara logo.

Ensures separation between content and logo for clarity.

7

**Tamara Logo**

Use Tamara’s official gradient logo with height 28px (mobile) or 32px (desktop).

Logo must not be altered or distorted.

8

**Border and Border Radius**

Apply 16px border radius on all corners and 1px border around the entire widget.

Provides a soft, modern appearance, subtle definition and visual containment.

9

**Safe Space**

Maintain 16px clear space around the entire widget from surrounding page elements.

Ensures the widget isn’t visually cramped, and stands out.

![](https://files.readme.io/c356330eb7c9207ada68a3ffaf5cd4694a94e806183607fad1b8a1988ac507b0-image.png)

###

1.5.2. Design do’s & don’ts

[](#152-design-dos--donts)

✅ Do’s

❌ Don’ts

DO use the official, unaltered Tamara gradient logo to ensure brand recognition and trust.

DON'T distort, recolor, stretch, or alter the Tamara logo in any way.

DO use a bold font weight to emphasize the key payment amount (e.g., "SAR 208/mo").

DON'T make the entire text bold, which reduces readability and impact.

![](https://files.readme.io/9335a1514026b0f073821f74e1b10288f000343db3bad7a4557bab0e9b9b15bb-image.png)

2.0. Widgets

# [](#20-widgets)

Now that you've learned about the essentials of implementing Tamara widgets, let's take a closer look at each of the widgets.

2.1. Product Details Page Widget

## [](#21-product-details-page-widget)

![](https://files.readme.io/fb1759a92643d36724f89446bb81969a527e4ec97f74cc44f9923cf37821fd4c-image.png)

The Product Details Page (PDP) widget plays a crucial role in introducing Tamara’s payment options at the moment when customers are considering a purchase. Customers on this page are often evaluating whether a product fits their budget. Clearly displaying flexible payment options on the product details page helps users understand affordability, which can increase conversion rates and average order value.

The PDP widget should be informative, align with our messaging and structural specifications, and be positioned for maximum visibility.

> 👍
>
> Showcasing the PDP widget on the product detail page plays an important role in increasing conversion and helping users discover the available payment plans.

###

2.1.1. Purpose of the PDP Widget

[](#211-purpose-of-the-pdp-widget)

The PDP widget is designed to:

- Inform users that **Tamara is available** as a payment method.
- Display **clear and accurate payment plan** details.
- Encourage **engagement** through a call to action (e.g. “More options”).
- **Increases average order value** and **drives conversion** value by making purchases feel more affordable and achievable.

###

2.1.2 Messaging on PDP Widget

[](#212-messaging-on-pdp-widget)

As initially explained in section 1.2, the PDP messaging should include all of Tamara's messaging pillars.

Legend

Requirement

Example (English)

Example (Arabic)

1

Long term financing

_“Pay **SAR 208/mo**_

_ادفع **SAR208**\\شهريًا_

2

4 payment option

_or in 4 payment_

_أو على 4 دفعات_

3

Competitive differentiator

_Sharia compliant._

_متوافقة مع الشريعة الإسلامية._

4

CTA

_More options”_

_تعرّف على خياراتك_

5

Tamara gradient Logo

Logo

Logo

![](https://files.readme.io/55de517ecdb308c15e57364f29cdb03b9579fabb866a51eacf3df450dba0e911-image.png)

**We strongly recommend you use Tamara’s official messaging:**

![](https://files.readme.io/b7121293b421e8cc2d4455b41117398bc0267db04b050839831f63ad63b1ec59-image.png)

###

2.1.3. PDP Widget Placement & Visibility

[](#213-pdp-widget-placement--visibility)

Strategic placement is crucial for maximizing the widget's impact and ensuring customers notice payment options during purchase decisions. We recommend positioning the widget directly below the product price, as this helps customers understand affordability and cost at a glance.

![](https://files.readme.io/a812d99dc5fc439475be3b2f25b2fbb0dfeb1cf7177e0ffb0e47bf145daaf195-image.png)

> 👍
>
> Display the PDP widget directly below the product price, where affordability considerations are made.

###

2.1.4.Payment calculation

[](#214payment-calculation)

We highly recommend using **Tamara’s official widget**, which is designed to work out of the box with built-in logic for accurate, compliant, and user-friendly messaging. However, if you choose to build a **custom widget**, it’s essential to implement a **dynamic calculation** that reflects the actual product price.

**Example:**

- Product price = **SAR 2500**
- Maximum plan configured = **12 payments**
- Display: “Pay SAR **208/mo**, or in 4 payments. Sharia-compliant. More options”

###

2.1.5. PDP Widget do’s & don’ts

[](#215-pdp-widget-dos--donts)

✅ Do’s

❌ Don’ts

DO place the widget directly below the product price for maximum visibility and impact.

DON'T hide the widget far down the page, below the fold, or in a collapsed section.

![](https://files.readme.io/aad1ed8cae4fbbfe3d49d0da9ee24da1d909096ab535b51ac17bf3258de5c459-image.png)

2.2. Cart Widget

## [](#22-cart-widget)

The cart widget reinforces Tamara’s availability and payment flexibility just before checkout, reminding customers they can still split or finance their payment. It also helps reduce cart abandonment by making the purchase feel more manageable at a critical stage.

###

2.2.1. Messaging

[](#221-messaging)

The Cart Widget messaging should be composed of Tamara’s messaging pillars.

Legend

Requirement

Example (English)

Example (Arabic)

1

Long term financing

_“Pay **SAR 208/mo**_

_ادفع **SAR208\\شهريًا**_

2

4 payment option

_or in 4 payment_

_أو على 4 دفعات_

3

Competitive differentiator

_Sharia compliant._

_متوافقة مع الشريعة الإسلامية._

4

CTA

_More options”_

_تعرّف على خياراتك_

5

Tamara gradient Logo

Logo

Logo

![](https://files.readme.io/59546a2f733ae68b227ef254138ec33529b0c6b56ec75095926d96047c444312-image.png)

###

2.2.2. Placement & Visibility

[](#222-placement--visibility)

We recommend placing the Cart Widget below the cart total or near the “Proceed to Checkout” button to maximize visibility without disrupting core purchase actions.

![](https://files.readme.io/2dd1eb640090375b1dc35cc2485e8148e0fcb5c484150453c02eed1e0e1ede69-image.png)

###

2.2.3. Payment Calculation in Cart

[](#223-payment-calculation-in-cart)

We strongly recommend using Tamara’s official widget for the cart, as it’s optimized for accuracy, clarity, and real-time updates. It automatically handles pricing changes, discounts, and quantities across multiple items. However, if you're building a custom cart widget, it’s crucial to dynamically calculate the payment amount based on the entire cart total ensuring users see up-to-date and accurate payment breakdowns.

**Example:** Cart total = **SAR 3000** Configuration = **12 payments** Display: “**Pay SAR 250/mo, or in 4 payments. Sharia-compliant. More options**”

![](https://files.readme.io/7630eacdef16e625711628db3d101c6f79c10d8ada8596cdb434a9487e414506-image.png)

> ❗️
>
> Don’t hardcode the message. Dynamic accuracy here builds trust and improves conversion.

###

2.2.4. Cart Widget do’s & don’ts

[](#224-cart-widget-dos--donts)

✅ Do’s

❌ Don’ts

DO place the widget near the cart total and the primary checkout button to reduce cart abandonment.

DON'T hide the widget far down the page, below the fold, or in a collapsed section.

DO ensure the calculation is based on the entire cart's total value and updates in real-time.

Don’t show static values. Ensure the payment breakdown reflects real-time cart changes.

![](https://files.readme.io/41f8e537d9748408f3fbe9c5986c592f97144fa515de8768f8b4c258484a2d05-image.png)

2.3. Checkout Widget

## [](#23-checkout-widget)

At checkout, the widget confirms that Tamara is an available **payment method**, building final trust and confidence. This is often the **last reassurance point** before conversion.

![](https://files.readme.io/bb193426e1b8ca06f87d18706db00af566f8dccb3e3749632b97fd06b77d2398-image.png)

###

2.3.1. Messaging

[](#231-messaging)

The Checkout Widget messaging is designed for reassurance and simplicity at the final payment step. It should display Tamara as the payment provider label, accompanied by a brief reassurance message highlighting our key value proposition and competitive advantage, such as “Monthly payments. No hidden fees.”

Legend

Requirement

Example (English)

Example (Arabic)

1

Payment provider label

_“Tamara”_

_“Tamara”_

2

Payment reassurance: key value proposition and competitive advantage.

_“Monthly payments. Sharia-compliant.”_

دفعات شهرية. متوافقة مع الشريعة الإسلامية.

3

Tamara gradient Logo

Logo

Logo

![](https://files.readme.io/f2db83061347f8461e0e1784a66d892835d4fd4368c5541e4f723dfa1e453311-image.png)

###

2.3.2. ⭐️ Recommended Messaging

[](#232-️-recommended-messaging)

We strongly encourage you to use Tamara’s official messaging, it’s designed and tested to explain our offering clearly and deliver the best possible experience for your customers. Custom messaging may lead to confusion, or outdated information.

Language

Messaging

English

**Tamara Monthly payments. Sharia compliant.**

Arabic

**Tamara دفعات شهرية. متوافقة مع الشريعة الإسلامية.**

![](https://files.readme.io/b09ad4a08848537e027ca4d9a96971e8569963144aea94259f09b0d75dc66f44-image.png)

###

2.3.3. Placement & Visibility

[](#233-placement--visibility)

The widget should be placed within the payment method selection options, using styling consistent with other payment methods. It can also be embedded as part of radio button payment options to align with the checkout experience.

![](https://files.readme.io/d229531103df6a1769dd8b484218b7d09b58984c02a489a0d79a344e81a3b681-image.png)

3.0. Pop up

# [](#30-pop-up)

![](https://files.readme.io/8d82b8ff77e623c977e26884f802c5eccd1a9acb2d86f94cda7c63c9604f24b8-image.png)

The popup serves as a lightweight, informative layer that helps customers understand Tamara’s payment options in a clear and engaging way without leaving the page. It is triggered when the link or buttons within the widget is clicked or tapped.

It's important to note that the popup is to be dynamic—i.e., the payment plans displayed in the popup

3.1 Minimum Requirements

## [](#31-minimum-requirements)

Legend

Requirement

Description

Why it matters

1

Tamara logo

Display the official Tamara logo at the top of the popup.

Builds brand recognition and trust from the start.

2

Hero section

Use our official tagline: “Your Payment ,your Pace” with subtext: “Pay SAR \[plan cost per month\] or in 4 payments. Sharia-compliant."

Creates immediate clarity and draws attention to the benefit of flexible payments.

3

Plan breakdown

Dynamic calculation based on total value, and as configured by the merchant.

Helps customers assess affordability quickly and accurately.

4

How it works

Include step-by-step how it works: 1.Select plan 2.Enter card 3.Manage in app 4.Get reminders

Makes the process feel simple and transparent.

5

Why Tamara?

Highlight our value propositions: 1.No late fees 2.Sharia compliant 3.100%-buyer protection

Builds credibility and reinforces Tamara’s key value propositions.

6

Legal Information

Show a short compliance statement with certificate reference.

Ensures transparency, especially for Sharia compliance, important in MENA markets.

7

Accepted Payment Methods

Display logos for supported cards and wallets (Mada, Visa, Apple Pay, etc.)

Reassures customers that their preferred payment method is supported.

8

Dismissal button

Provide a clear close (“×”) button in the top-right corner.

Gives users control and meets UX best practices.

![](https://files.readme.io/3feb011ddcf7fa2acc30d8936d84b4739cacd43a1dc362eb5a06e583ecfdbfb8-image.png)

Relevant resources

# [](#relevant-resources)

Resources

Description

Link

Tamara logo and brand assets

Download official logos, icons, and visual guidelines for use in widgets and communications.

[https://cdn.tamara.co/merchant_docs/Tamara\_\_Brand\_\_Assets_v2.zip](https://cdn.tamara.co/merchant_docs/Tamara__Brand__Assets_v2.zip)

Tamara Widget API documentation

Technical guide for integrating Tamara widgets via API, including endpoints and parameters.

[https://docs.tamara.co/docs/direct-widgets](/docs/direct-widgets)

Tamara Widget Tool

A web-based tool for previewing, customizing, and generating widget embed code.

[https://widget-docs.tamara.co/tamara-summary](https://widget-docs.tamara.co/tamara-summary)

Updated 3 months ago

---

[

Widgets - Promotional Messaging

](/docs/direct-widgets)[

\[UAE 🇦🇪\] Tamara Widget Implementation Guidelines

](/docs/tamara-widget-implementation-guidelines-uae)

Did this page help you?

Yes

No

- [Table of Contents](#)
- - [What’s new](#whats-new)
  - - [1\. Tamara logo and branding](#1-tamara-logo-and-branding)
    - [2\. Extended payment options](#2-extended-payment-options)
    - [3\. Updated widgets messaging](#3-updated-widgets-messaging)
    - [4\. Refreshed checkout experience](#4-refreshed-checkout-experience)
    - [5\. Updated Guidelines](#5-updated-guidelines)
  - [1.0. Implementation Essentials](#10-implementation-essentials)
  - - [1.1. Clear indication that Tamara is available as a payment option](#11-clear-indication-that-tamara-is-available-as-a-payment-option)
    - [1.2. Messaging pillars](#12-messaging-pillars)
    - [1.3. Accurate representation of Tamara’s plan structures](#13-accurate-representation-of-tamaras-plan-structures)
    - [1.4. A link button for customers to learn more about Tamara](#14-a-link-button-for-customers-to-learn-more-about-tamara)
    - [1.5. Design and branding](#15-design-and-branding)
  - [2.0. Widgets](#20-widgets)
  - - [2.1. Product Details Page Widget](#21-product-details-page-widget)
    - [2.2. Cart Widget](#22-cart-widget)
    - [2.3. Checkout Widget](#23-checkout-widget)
  - [3.0. Pop up](#30-pop-up)
  - - [3.1 Minimum Requirements](#31-minimum-requirements)
  - [Relevant resources](#relevant-resources)
