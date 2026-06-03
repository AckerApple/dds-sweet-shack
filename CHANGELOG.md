# Changelog

## v1.1.0 - 2026-06-03

Product-photo catalog, order-detail links, and launch polish updates.

### Added

- Added the uploaded real product photos to the clickable gallery products.
- Added `public/assets/creations/product_images/products.json` as the product catalog, using each image filename stem as the `productCode`.
- Added product metadata including title, category, description, image name, image path, alt text, suggested unit, tags, and featured status.
- Added product-code-aware order items so bundled requests can reference exact product image filenames.
- Added order detail link generation in email request bodies using `ddssweetshack.com/order-details.html?items=productCode:quantity`.
- Added `/order-details.html`, which decodes product codes and quantities from the URL and displays matching product photos from the catalog.
- Added `/product-details.html`, which displays catalog product details from `products.json`.
- Added local-storage-backed email order drafts so `I Want This` can build a bundled request across product clicks.
- Added product catalog audit scripts to compare `products.json` against files in `product_images`.
- Added Open Graph and Twitter metadata for the home, contact, custom order, and order details pages.
- Added the cupcake emoji favicon to the site pages.

### Changed

- Bumped the website package version from `1.0.0` to `1.1.0`.
- Updated the home page title to `DD's Sweet Shack | Custom Cakes, Cupcakes & Sweet Treats`.
- Fixed the home hero typo from "part favors" to "party favors".
- Moved the previous hero cake into the product catalog as `484170766_636223232491690_4204148292118588959_n.png`.
- Changed the home hero image to rotate through featured catalog products every 4 seconds.
- Changed hero and gallery product photos to link to product details pages.
- Replaced placeholder gallery data in `src/data/creations.ts` with product catalog-backed entries.
- Updated TODO notes so completed items are tracked in this changelog instead of the remaining-work list.

### Verified

- Ran `npm run build`.
- Ran `npm run build:gh-pages`.

## v0.1.0 - 2026-06-01

Initial working version of the DD's Sweet Shack website.

### Added

- Built the main website structure with a homepage, custom order page, and contact page.
- Added the DD's Sweet Shack logo, bright brand colors, reusable buttons, cards, and mobile-friendly styling.
- Added a photo-focused creations gallery with categories for cakes, cupcakes, treats, cookies, party favors, and seasonal items.
- Added `I Want This` buttons that open a simple order request form.
- Added a custom order form for visitors who want something not shown in the gallery.
- Added pre-filled email request generation for customer leads.
- Added a copy-order-details fallback for visitors whose email app does not open correctly.
- Added quick contact options for phone, text, email, and Facebook.
- Added mobile navigation and sticky mobile contact buttons.
- Added basic page titles and descriptions for search engines.
- Added project notes for replacing photos, updating contact info, and deploying the site.

### Still Needed

- Replace placeholder product images with final photos.
- Confirm the final logo, contact details, Facebook link, and business wording.
- Test the request flow on mobile devices and desktop browsers.
- Add final launch items such as favicon, social sharing image, domain setup, and deployment workflow.
