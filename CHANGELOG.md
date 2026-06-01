# Changelog

Completed project work moved out of `TODO.md` so the remaining list stays focused.

## Completed

### Project Setup

- Created/configured the DD's Sweet Shack website project.
- Set up a TaggedJS, TypeScript, and Vite static site.
- Added npm scripts:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
- Configured Vite for multi-page static output:
  - `index.html`
  - `custom-order.html`
  - `contact.html`
- Configured repository remote:
  - `git@github.com:AckerApple/dds-sweet-shack.git`
- Added project README with run, asset, order-flow, custom-order, contact, and deployment notes.

### Branding And Styling

- Added logo asset location at `public/assets/logo/`.
- Added current transparent logo image:
  - `public/assets/logo/dds_sweet_shack_logo_transparent.png`
- Added placeholder SVG logo asset and logo README.
- Created site color variables for the bright DD's Sweet Shack palette:
  - Pink
  - Purple
  - Light blue
  - Yellow accent
- Created reusable button styles.
- Created reusable card styles.
- Added responsive global site styling in `src/styles/site.css`.

### Asset Organization

- Created asset folders:
  - `public/assets/logo/`
  - `public/assets/brand/`
  - `public/assets/creations/`
- Added creation asset README with image replacement workflow.
- Added starter creation assets and placeholders.
- Added current featured cake image:
  - `public/assets/creations/main_site_cake.png`

### Data Model

- Added `src/data/creations.ts`.
- Defined `CreationItem` with:
  - `id`
  - `title`
  - `category`
  - `description`
  - `image`
  - `fallbackImage`
  - `featured`
- Added creation categories:
  - Cakes
  - Cupcakes
  - Treats
  - Cookies
  - Party Favors
  - Seasonal
- Added starter gallery items:
  - Dinosaur Birthday Cake
  - Birthday Cupcake Set
  - Chocolate Covered Strawberries
  - Decorated Sugar Cookies
  - Party Favor Boxes
  - Holiday Treat Tray
- Added `src/data/contact.ts` for centralized phone, text, email, location, Facebook, and website details.

### Homepage

- Built the main homepage app.
- Added header with logo, navigation, mobile menu, and text CTA.
- Added hero section with featured cake imagery.
- Added tagline and primary contact buttons:
  - Text
  - Call
  - Email
  - Facebook
- Added featured creations/gallery section.
- Added custom orders section.
- Added footer.
- Added mobile sticky contact bar.

### Gallery System

- Built responsive creation gallery.
- Added category filters.
- Added responsive creation cards.
- Added image previews.
- Added title, category, description, and `I Want This` button for each item.

### Order Request Flow

- Built reusable order request modal.
- Opens modal from `I Want This`.
- Automatically displays/prefills selected product.
- Collects:
  - Customer name
  - Order item
  - Quantity
  - Needed-by date/time
  - Phone number
  - Additional details/custom writing
- Supports multiple order item rows.
- Added remove-item handling while keeping at least one item row.
- Added no-online-payment note.

### Email Generation

- Added order request email builder in `src/order-request.ts`.
- Generates subject:
  - `Order Request: [Product Name]`
- Generates DD's Sweet Shack order-sheet style email body.
- Uses `mailto:ddssweetshack@gmail.com`.
- Added `Create Email Request` action.
- Added `Copy Order Details` fallback action.

### Custom Order Page

- Added dedicated custom order page:
  - `/custom-order.html`
- Added shareable custom-order request form.
- Wired header and homepage custom order CTA to the page.

### Contact Page

- Added dedicated contact page:
  - `/contact.html`
- Added contact cards for:
  - Call
  - Text
  - Email
  - Location
  - Facebook
  - Website

### Mobile Optimization

- Added responsive navigation.
- Added mobile sticky contact buttons.
- Added responsive gallery layout.
- Added responsive order forms.
- Added responsive modal layout.
- Targeted common mobile use cases, including phone/text/email actions.

### Basic SEO

- Added page titles.
- Added meta descriptions for:
  - Home
  - Contact
  - Custom order
