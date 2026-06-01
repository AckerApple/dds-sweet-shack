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

Place gallery photos in:

`public/assets/creations/`

Starter filenames referenced by `src/data/creations.ts`:

- `dinosaur-birthday-cake.jpg` for the approved real cake photo
- `farm-birthday-cake.svg`
- `birthday-cupcake.svg`
- `chocolate-strawberries.svg`
- `decorated-sugar-cookies.svg`
- `party-favor-boxes.svg`
- `holiday-treat-tray.svg`

The current SVG files are visual placeholders. Save the approved dinosaur cake photo as `public/assets/creations/dinosaur-birthday-cake.jpg`, then update the first item in `src/data/creations.ts` to use `/assets/creations/dinosaur-birthday-cake.jpg`.

## Edit Gallery Items

All gallery content lives in:

`src/data/creations.ts`

Each item has:

- `id`
- `title`
- `category`
- `description`
- `image`
- optional `featured`

Use categories from `creationCategories`: Cakes, Cupcakes, Treats, Cookies, Party Favors, Seasonal.

## Order Request Mailto Flow

Clicking `I Want This` opens a request modal with the selected item already filled in. The form collects:

- customer name
- order items as `{ quantity, title }` rows
- needed-by date/time
- phone number
- additional details or custom writing

`Create Email Request` generates a `mailto:` link to `ddssweetshack@gmail.com` with subject `Order Request: [Product Name]` and an order-sheet formatted email body.

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
