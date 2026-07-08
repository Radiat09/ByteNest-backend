# ByteNest — Backend

Node.js/Express REST API for ByteNest electronics store, written in TypeScript.

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js + Express |
| Language | TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| Payments | Stripe, COD |
| Validation | Zod |
| File Upload | Cloudinary (server-side) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Stripe account (for payments)

### Install

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bytenest
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_ENDPOINT_SECRET=whsec_your_stripe_webhook_secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Run

```bash
npm run dev      # Dev with nodemon
npm run build    # Compile TypeScript
npm run start    # Run compiled JS
```

API runs at `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── config/                  # db.ts, env.ts
│   ├── errorHelpers/            # AppError class
│   ├── helpers/                 # Zod, Cast, Duplicate, Validation error handlers
│   ├── interfaces/              # TypeScript types
│   ├── middlewares/              # Auth, error handler, validation, notFound
│   ├── modules/
│   │   ├── auth/                # Register, login, JWT
│   │   ├── cart/                # Add, update, remove cart items
│   │   ├── category/            # CRUD categories
│   │   ├── order/               # Orders, Stripe checkout
│   │   ├── product/             # CRUD products
│   │   ├── upload/              # Server-side image upload to Cloudinary
│   │   ├── user/                # User management
│   │   └── wishlist/            # Add/remove wishlist
│   ├── routes/                  # Route aggregator
│   └── utils/                   # JWT, query builder, response, catchAsync
├── app.ts
└── server.ts
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/jwt` | Get JWT token for user |
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List products (with filters, sort, pagination) |
| GET | `/products/:id` | Get single product |
| POST | `/products` | Create product (admin) |
| PUT | `/products/:id` | Update product (admin) |
| DELETE | `/products/:id` | Delete product (admin) |
| GET | `/product/count` | Total product count |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List all categories |
| POST | `/categories` | Create category (admin) |
| PUT | `/categories/:id` | Update category (admin) |
| DELETE | `/categories/:id` | Delete category (admin) |

### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get user's cart |
| POST | `/cart` | Add to cart |
| PUT | `/cart/:id` | Update quantity |
| DELETE | `/cart/:id` | Remove from cart |

### Wishlist

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wishlist` | Get user's wishlist |
| POST | `/wishlist` | Add to wishlist |
| DELETE | `/wishlist/:id` | Remove from wishlist |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get user's orders |
| GET | `/cancelledOrder` | Get user's cancelled orders |
| GET | `/allOrders` | Get all orders (admin) |
| GET | `/revenue` | Total revenue (admin) |
| PUT | `/orders/:id/status` | Update order status (admin) |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/count` | Total user count |
| GET | `/users` | List all users (admin) |
| GET | `/customers` | List customers (admin) |

### Image Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload image to Cloudinary (admin, multipart/form-data) |
| DELETE | `/upload` | Delete image from Cloudinary (admin) |

- Accepts `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Max file size: 5MB
- Optional `?folder=` query param (default: `products`)
- Returns `{ url, publicId }`

### Payments (Stripe)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payment/create-checkout-session` | Create Stripe checkout session |
| POST | `/payment/webhook` | Stripe webhook handler |

## Scripts

```bash
npm run dev      # Start with nodemon
npm run build    # Compile TypeScript
npm run start    # Run compiled JS
```

## License

Private project.
