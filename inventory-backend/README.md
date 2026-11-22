# IT Hardware Inventory Management - Backend

Simple Spring Boot 3 + MySQL REST API for tracking computer & IT hardware:
items, serial-numbered units, warranty, stock levels, pricing and item images.
No authentication (as requested).

## Requirements
- Java 17+
- Maven 3.8+
- MySQL 8 running locally

## Run
1. Edit `src/main/resources/application.properties` and set your MySQL username/password.
   The database `inventory_db` and all tables are created automatically on first start.
2. Start the app:
   ```
   mvn spring-boot:run
   ```
3. API is at `http://localhost:8080/api`

Uploaded images are saved in the `uploads/` folder (next to where you run the app).

## Data model
- **Category** - Laptops, RAM, Monitors, ...
- **Item** - a product/model: sku, brand, model, price, `quantity`, `minStockLevel`, `defaultWarrantyMonths`, image.
  Response includes computed `stockStatus` (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`) and `imageUrl`.
- **ItemUnit** - one physical device with a unique **serial number**, purchase date, warranty and status
  (`IN_STOCK`, `ASSIGNED`, `IN_REPAIR`, `SOLD`, `RETIRED`).
  Warranty expiry = purchaseDate + warrantyMonths (falls back to the item's default). Response includes
  `warrantyStatus` (`ACTIVE`, `EXPIRING_SOON`, `EXPIRED`, `NO_WARRANTY`) and `warrantyDaysLeft`.

**Stock rule:** every unit with status `IN_STOCK` counts as +1 in its item's `quantity`. Adding / deleting units or
changing their status keeps `quantity` in sync. Items without serial numbers (cables, RAM sticks, screws...) are
managed with the stock add/remove endpoints.

## Endpoints

### Categories
| Method | URL |
|---|---|
| GET | `/api/categories` |
| GET | `/api/categories/{id}` |
| POST | `/api/categories` |
| PUT | `/api/categories/{id}` |
| DELETE | `/api/categories/{id}` (blocked if it has items) |

### Items
| Method | URL | Notes |
|---|---|---|
| GET | `/api/items?search=&categoryId=&page=0&size=20&sort=name,asc` | search matches name, sku, brand, model |
| GET | `/api/items/{id}` | |
| POST | `/api/items` | |
| PUT | `/api/items/{id}` | |
| DELETE | `/api/items/{id}` | also deletes its units and image |
| GET | `/api/items/out-of-stock` | quantity = 0 |
| GET | `/api/items/low-stock` | 0 < quantity <= minStockLevel |
| POST | `/api/items/{id}/stock/add` | body `{"quantity": 10}` |
| POST | `/api/items/{id}/stock/remove` | body `{"quantity": 3}` (fails if not enough stock) |
| POST | `/api/items/{id}/image` | multipart, field name `file` (jpg/png/gif/webp, max 5MB) |
| GET | `/api/items/{id}/image` | returns the image |
| DELETE | `/api/items/{id}/image` | |

### Units (serial numbers & warranty)
| Method | URL | Notes |
|---|---|---|
| GET | `/api/units?itemId=&status=` | paged |
| GET | `/api/units/{id}` | |
| GET | `/api/units/serial/{serialNumber}` | lookup by serial |
| POST | `/api/units` | |
| PUT | `/api/units/{id}` | |
| DELETE | `/api/units/{id}` | |
| GET | `/api/units/warranty/expiring?days=30` | warranty ends within N days |
| GET | `/api/units/warranty/expired` | |

### Dashboard
`GET /api/dashboard` - totals, out-of-stock count, low-stock count, warranty alerts, total stock value.

## Quick examples (curl)

```bash
# 1. category
curl -X POST localhost:8080/api/categories -H "Content-Type: application/json" \
  -d '{"name":"Laptops","description":"Notebooks and ultrabooks"}'

# 2. item
curl -X POST localhost:8080/api/items -H "Content-Type: application/json" \
  -d '{"name":"Dell Latitude 5440","sku":"DELL-LAT-5440","brand":"Dell","model":"Latitude 5440",
       "categoryId":1,"price":85000.00,"quantity":0,"minStockLevel":2,"defaultWarrantyMonths":36}'

# 3. serial-numbered unit (quantity of the item goes up by 1 automatically)
curl -X POST localhost:8080/api/units -H "Content-Type: application/json" \
  -d '{"itemId":1,"serialNumber":"SN-ABC-0001","purchaseDate":"2026-01-15","supplier":"Dell India"}'

# 4. image upload
curl -X POST localhost:8080/api/items/1/image -F "file=@laptop.jpg"

# 5. stock for non-serial parts
curl -X POST localhost:8080/api/items/2/stock/remove -H "Content-Type: application/json" -d '{"quantity":5}'

# 6. reports
curl localhost:8080/api/items/out-of-stock
curl "localhost:8080/api/units/warranty/expiring?days=60"
curl localhost:8080/api/dashboard
```

## Errors
All errors return JSON: `{ "timestamp", "status", "error", "message", "details" }`
(400 validation / bad input, 404 not found, 409 duplicate SKU or serial, 413 file too large).

## Project layout
```
src/main/java/com/inventory
  controller/   REST endpoints
  service/      business logic (stock sync, warranty calc, image storage)
  repository/   Spring Data JPA
  entity/       Category, Item, ItemUnit + enums
  dto/          request/response records with validation
  exception/    custom exceptions + global handler
  config/       CORS
```
