# Stockroom

Stockroom is a full-stack inventory management application for computer and IT hardware. It provides a dashboard for monitoring stock, category and item management, low-stock alerts, stock adjustments, and item image uploads.

## Features

- Inventory dashboard with stock summaries and attention areas
- Searchable, sortable, and paginated item list
- Category management
- Item CRUD with SKU, brand, model, pricing, stock thresholds, and warranty defaults
- Add and remove stock with validation
- Low-stock and out-of-stock views
- Optional item image upload, preview, replacement, and deletion
- Responsive interface built with React and Tailwind CSS
- REST API built with Spring Boot, Spring Data JPA, and MySQL
## Work in progress

The following features are planned for future releases:

- User authentication with secure login and logout flows
- Password hashing, password reset, and account management
- JWT or session-based API security
- Protected frontend routes and permission-aware actions
- Audit logs for inventory, stock, category, and user changes
- Automated tests for backend services, API endpoints, and frontend workflows
- Reporting and export features for inventory and stock activity
## Tech stack

### Frontend

- React
- Tailwind CSS

### Backend

- Java 17+
- Spring Boot 3.3
- Spring Web
- Spring Data JPA / Hibernate
- MySQL
- Maven

## Project structure

```text
.
├── inventory-backend/     # Spring Boot REST API
└── inventory-frontend/    # React/Vite web application
```

## Prerequisites

Install the following before running the project:

- Java 17 or newer
- Maven 3.8 or newer
- Node.js 18 or newer and npm
- MySQL 8 or newer

## Backend setup

1. Create a MySQL database, or allow Hibernate to create it automatically. The default configuration expects:

   - Database: `inventory_mb`
   - Host: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: `password`

2. Update the credentials in [`inventory-backend/src/main/resources/application.properties`](./inventory-backend/src/main/resources/application.properties) if your local MySQL setup differs.

3. Start the API:

   ```bash
   cd inventory-backend
   mvn spring-boot:run
   ```

The backend runs at `http://localhost:8080` and exposes its API under `http://localhost:8080/api`.

Uploaded images are stored in the backend’s `uploads/` directory.

## Frontend setup

In a second terminal:

```bash
cd inventory-frontend
npm install
npm run dev
```

The development application runs at `http://localhost:5173`. Vite proxies `/api` requests to `http://localhost:8080` by default.

For a separately hosted frontend, copy [`.env.example`](./inventory-frontend/.env.example) to `.env` and set `VITE_API_URL` to the backend API URL.

## Production build

Create a production frontend build with:

```bash
cd inventory-frontend
npm run build
```

The generated files are placed in `inventory-frontend/dist/`.

## API overview

| Resource | Endpoints |
| --- | --- |
| Categories | `GET`, `POST`, `PUT`, and `DELETE /api/categories` |
| Items | `GET`, `POST`, `PUT`, and `DELETE /api/items` |
| Stock | `POST /api/items/{id}/stock/add` and `/remove` |
| Stock alerts | `GET /api/items/low-stock` and `/out-of-stock` |
| Item images | `POST`, `GET`, and `DELETE /api/items/{id}/image` |

Item creation with an image uses `multipart/form-data` with an `item` JSON part and an optional `file` part. Image uploads accept JPG, PNG, GIF, and WebP files up to 5 MB.

## Useful commands

```bash
# Run the backend
cd inventory-backend
mvn spring-boot:run

# Build the backend
mvn clean package

# Run the frontend development server
cd ../inventory-frontend
npm run dev

# Build the frontend for deployment
npm run build
```

## Configuration notes

- Database schema updates are handled automatically by Hibernate using `ddl-auto=update`.
- The backend has no authentication configured at this time.
- The frontend uses INR currency formatting and the `en-IN` locale by default. These values can be changed in [`inventory-frontend/src/config.js`](./inventory-frontend/src/config.js).
- CORS is configured by the backend for frontend development and separately hosted deployments.

## License

No license has been specified yet. Add a license before distributing the project publicly.
