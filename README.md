# DD's Sweet Shack

Static lead-generation website for DD's Sweet Shack, built with TaggedJS, TypeScript, and Vite.

## Run Locally

```bash
npm install
npm run dev
```

Build the static site:

```bash
npm run build
```

Preview the built site:

```bash
npm run preview
```

## Logo and Business Card

Place the final logo at:

`public/assets/logo/dds_sweet_shack_logo_transparent.png`

Place the business card or other brand reference files at:

`public/assets/brand/`

If you use a different logo filename, update `src/components/Header.tag.ts`.

## Product Photos

Place catalog photos in:

`public/assets/creations/product_images/`

Product metadata lives beside the images:

`public/assets/creations/product_images/products.json`

Each product uses the image filename without the extension as its `productCode`. Order links use those product codes to identify requested items and quantities.

Audit the folder against the catalog after adding photos:

```bash
npm run catalog:audit
```

If new image files are missing from `products.json`, create draft entries:

```bash
npm run catalog:add-missing
```

Then edit the draft title, category, description, alt text, suggested unit, tags, and `featured` status in `products.json`.

## Edit Gallery Items

Gallery content is built from:

`public/assets/creations/product_images/products.json`

Each item has:

- `productCode`
- `title`
- `category`
- `description`
- `imageName`
- `imagePath`
- `altText`
- `suggestedUnit`
- `tags`
- optional `featured`

`src/data/creations.ts` maps the catalog into the homepage gallery.

Use categories from `creationCategories`: Cakes, Cupcakes, Treats, Cookies, Party Favors, Seasonal.

## Order Request Mailto Flow

Clicking `I Want This` adds the selected product to a local-storage-backed email order draft and opens the request modal. The form collects:

- customer name
- order items as `{ quantity, title, productCode }` rows
- needed-by date/time
- phone number
- additional details or custom writing

`Create Email Request` generates a `mailto:` link to `ddssweetshack@gmail.com` with subject `Order Request: [Product Name]` and an order-sheet formatted email body.

The email body includes a `View order details` link such as `/order-details.html?items=productCode:quantity`. That page decodes the product codes and displays the matching catalog images.

`Copy Order Details` copies the same order sheet as a fallback when the visitor's device does not open email links correctly.

The modal also includes `Continue Browsing`, which closes the request form without losing the visitor's place on the home page.

## Custom Order Page

Custom orders have a dedicated shareable page:

`/custom-order.html`

Use this link when you want to send someone directly to the order request form instead of the gallery. The header `Custom Order` link and the home page custom order CTA both point there.

## Contact Page

Contact details have a dedicated page:

`/contact.html`

The header `Contact` link points there. Update phone, email, Facebook, website, and location in:

`src/data/contact.ts`

No payment is collected online. The site clearly tells visitors that DD's Sweet Shack will confirm details and pricing after contact.

## Deploy to GitHub Pages

This project uses `base: "./"` in `vite.config.ts`, so the built files are suitable for GitHub Pages under a repository subpath.

1. Run `npm run build`.
2. Deploy the `dist/` folder to GitHub Pages.
3. If using GitHub Actions, configure the Pages action to upload `dist/`.
4. If using a custom domain, add the domain in the GitHub Pages settings and include a `public/CNAME` file if needed.
