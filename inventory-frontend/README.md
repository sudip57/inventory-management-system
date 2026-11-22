# Stockroom — IT hardware inventory frontend

React 18 + Vite + Tailwind CSS (JavaScript, no TypeScript) for the Spring Boot inventory API.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

In development, requests to `/api/*` are proxied to `http://localhost:8080` (see `vite.config.js`), so no CORS setup is needed.
If the frontend is hosted separately from the API, copy `.env.example` to `.env` and set `VITE_API_URL`
(for example `http://localhost:8080/api`). You will then need CORS enabled on the backend.

## Folder structure

```
src/
  api/            fetch wrapper + one module per backend resource
  components/
    ui/           buttons, fields, modal, drawer, table helpers, toasts
    layout/       app shell, sidebar, page header
  features/
    dashboard/    stat strip, attention panels
    items/        inventory table, filters, form, stock modal, detail drawer
    categories/   categories page, form, shared context
    stock/        low-stock / out-of-stock page
  hooks/          useFetch, useDebounce
  lib/            formatting and item <-> form helpers
  pages/          NotFound
  styles/         typography.css (global type), components.css, index.css
  config.js       app name, currency, locale, page sizes
```

## Global styling

- `src/styles/typography.css` styles `h1`–`h4`, `p`, `a`, `small`, `code`, selection and focus once, globally.
  Pages use plain `<h1>`, `<h2>`, `<p>` with no repeated font classes.
- Colours and fonts are defined in `tailwind.config.js` (warm neutral `ink`, one `brand` accent, status colours).
- Fonts: IBM Plex Sans and IBM Plex Mono (SKUs), bundled locally through `@fontsource`.
- Currency and locale are set in `src/config.js` (default INR / en-IN).

## API coverage

| Feature | Endpoint |
| --- | --- |
| List, search, filter, sort, page | `GET /api/items` |
| Item details | `GET /api/items/{id}` |
| Create (with optional image) | `POST /api/items` (multipart: `item` JSON + `file`) |
| Edit | `PUT /api/items/{id}` |
| Delete | `DELETE /api/items/{id}` |
| Low / out of stock | `GET /api/items/low-stock`, `/out-of-stock` |
| Add / remove stock | `POST /api/items/{id}/stock/add`, `/remove` |
| Upload / show / delete image | `POST`, `GET`, `DELETE /api/items/{id}/image` |
| Categories CRUD | `/api/categories` |

## Notes

- Spring's default multipart limit is 1 MB. To allow larger photos, set
  `spring.servlet.multipart.max-file-size` and `max-request-size` on the backend.
- The item response is assumed to include `category` (`{ id, name }`) or `categoryId`/`categoryName`,
  plus `imageFileName`. Adjust `src/lib/item.js` if your entity differs.
- Quantity is read-only when editing an item; use **Adjust stock** so changes go through the stock endpoints.
