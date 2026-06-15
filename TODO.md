# DD's Sweet Shack TODO

Remaining work for v1. Completed setup and feature work has moved to `CHANGELOG.md`.

## Core V1 Goal

The website is a lead-generation site, not an online store. The main user path is:

1. Visitor sees photos of cakes, treats, party favors, and custom work.
2. Visitor clicks `I Want This` or a contact button.
3. Visitor sends a qualified request by email, text, phone, or Facebook.
4. DD's Sweet Shack follows up to confirm details, timing, and pricing.

All remaining work should support that path: strong photos, clear categories, easy mobile contact, and a simple request flow.

## Priority: Pre-Launch Polish

- [ ] Proofread visible site copy and fix final wording.
  - Confirm final capitalization for "Sweet Treats, Made With Love".
- [x] Confirm final business contact details in `src/data/contact.ts`.
  - Phone/text: `912-539-5046`
  - Email: `ddssweetshack@gmail.com`
  - Location: `Fort Lauderdale, FL`
  - Website: `ddssweetshack.com`
- [x] Replace the current Facebook search URL with the final DD's Sweet Shack Facebook page URL.
- [x] Add the business card image to the contact page.
- [x] Remove the website card from the contact page.
- [x] Remove unneeded section kicker badges from the home gallery, home custom-orders section, and contact page.
- [ ] Confirm the final transparent logo PNG at `public/assets/logo/dds_sweet_shack_logo_transparent.png`.
- [ ] Confirm the final brand palette against the business card/logo.

## Priority: Images And Gallery Content

- [ ] Decide final image folder structure.
  - Current catalog photos use `public/assets/creations/product_images/`.
  - Original plan proposed subfolders: `cakes`, `cupcakes`, `treats`, `cookies`, `seasonal`.
- [ ] When new product photos are added, run `npm run catalog:audit` and update `products.json` as needed.
- [ ] Finalize product catalog entries in `public/assets/creations/product_images/products.json`.
  - Confirm titles.
  - Confirm categories.
  - Add or save Danielle's requested items before category assignment: Pumpkin Roll, Peanut Butter Marshmallow Bars, Kentucky Butter Cake with Bourbon Drizzle, Fudge, Oreo Cupcakes, Pecan Pie Cheesecake, Rustic Smash Cake, Rustic Wedding Cake, Mickey Mouse Themed Smash Cake, Pull Apart Cupcakes, and Saltine Toffee Candy.
  - Confirm descriptions.
  - Confirm alt text.
  - Confirm suggested units.
  - Confirm tags.
  - Confirm featured products.
- [ ] Decide whether Danielle should use the hidden `/admin-products.html` free-mode editor for copy updates before launch.
- [ ] Document the admin editor handoff process:
  - Open `/admin-products.html`.
  - Edit existing products only.
  - Click `Download products.json`.
  - Download `products.json`.
  - Email the file to `acker.dawn.apple@gmail.com`.

## Priority: QA

- [ ] Test the home page gallery filters.
- [ ] Test every floating gallery `I Want This` button.
- [ ] Test the hero and product detail page `I Want This` buttons.
- [ ] Test every product title link to `/product-details.html`.
- [x] Test the quick request modal layout on desktop and mobile during order-form polish.
- [x] Verify order modal item rows show product thumbnails and solid product-title text without shopper-facing product codes.
- [ ] Test the dedicated custom order page at `/custom-order.html`.
- [ ] Verify generated mailto subject and email body with the business owner.
- [ ] Test `Create Email Request` on iPhone, Android, desktop mail apps, and Facebook in-app browser where possible.
- [ ] Test `Copy Order Details` where clipboard permissions may vary.
- [ ] Test hidden admin editor save flow:
  - Local edits persist after refresh.
  - Edited items show `Publish ready`.
  - Stale local edits are ignored when catalog `updatedAt` is newer.
  - `Download products.json` downloads valid JSON.
  - `Add Product` shows the free-mode limitation modal.
- [ ] Test phone, text, email, and Facebook links.
- [ ] Check header navigation and logo link behavior on all pages.
- [ ] Verify the mobile sticky contact buttons do not cover important content.
- [ ] Check layout at small phone, large phone, tablet, laptop, and desktop widths.

## Priority: SEO And Browser Assets

- [ ] Add app icons if needed beyond the current emoji favicon.
- [ ] Add a sitemap if the deployment target benefits from one.
- [ ] Consider structured local business data after launch basics are complete.

## Priority: Launch

- [ ] Decide whether launch uses GitHub Pages, custom hosting, or another static host.
- [ ] Create a deployment workflow for GitHub Pages if using GitHub Pages.
- [ ] Buy or confirm the domain.
- [ ] Configure DNS.
- [ ] Add `public/CNAME` if using a custom domain with GitHub Pages.
- [ ] Confirm `vite.config.ts` base path works for the final deployment target.
- [ ] Deploy the built site.
- [ ] Run a post-deploy smoke test:
  - Home page
  - Gallery filters
  - Contact page
  - Custom order page
  - Mailto links
  - Phone/text links
  - Facebook link

## Future Features

Not for v1 unless priorities change.

- [ ] Customer testimonials.
- [ ] Facebook feed integration.
- [ ] Upload inspiration photo with order request.
- [ ] SMS integration.
- [ ] Admin image uploader.
- [ ] Online payments.
- [ ] Deposit collection.
- [ ] Order tracking.
