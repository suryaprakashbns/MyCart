# JVL Cart Clone — Project Notes

A full-stack MERN e-commerce app: products, JWT auth, cart, shipping, simulated
payment, orders, and admin product creation with Cloudinary image uploads.

## How to run

```bash
# Backend
cd backend
npm install
# fill in backend/config/config.env with your own Mongo URI, JWT secret, Cloudinary keys

# Frontend
cd ../frontend
npm install

# From project root, run both together
cd ..
npm install
npm run dev:full
```

Backend: http://localhost:8000
Frontend: http://localhost:3000 (proxied to backend via "proxy" in frontend/package.json)

To make a user an admin (needed for the "New Product" page):
```
mongosh
use jvlcart
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## Request lifecycle (example: loading the homepage)

```
index.html -> index.js -> App.js -> Home.js
   -> productActions.js (axios GET /api/v1/products)
   -> server.js -> app.js -> routes/product.js
   -> productController.js -> models/product.js -> MongoDB
   -> (JSON response) -> productActions.js -> productReducers.js
   -> store.js -> Home.js re-renders -> Product.js cards shown
```

Every other feature (login, add to cart, place order, upload product image)
follows the same chain — only the component/action/route/controller/model change.

---

## BACKEND FILES

### backend/server.js
Real entry point. Loads env vars, connects Cloudinary + MongoDB, starts Express
listening. Has global handlers for uncaughtException / unhandledRejection so the
process shuts down cleanly instead of hanging on a crash.

### backend/app.js
Builds the Express app: JSON body parsing, cookie parsing (for the JWT cookie),
CORS, morgan logging in dev. Mounts all three route files under `/api/v1`. In
production, serves the built React app and falls back to index.html for any
unmatched route (so client-side routing still works after a refresh).

### backend/config/database.js
`connectDatabase()` — connects Mongoose to MongoDB using the URI from
`config.env`. Exits the process on failure so you notice immediately rather
than running with a dead DB connection.

### backend/config/cloudinary.js
Configures the Cloudinary SDK once, using env vars, so `cloudinary.uploader.upload()`
works anywhere it's imported.

### backend/config/config.env
All secrets/config: port, Mongo URI, JWT secret + expiry, cookie expiry,
Cloudinary keys. Never commit this file with real secrets (it's in .gitignore).

### backend/models/product.js
Mongoose schema for products: name, price, description, ratings, images[]
(array of Cloudinary URLs), category (restricted to an enum), seller, stock,
numOfReviews, reviews[] (embedded, each referencing a User). Validation
(required fields, max lengths, enum) is enforced at the schema level.

### backend/models/user.js
Schema: name, email (unique), password (hidden from queries by default via
`select: false`), avatar, role, password-reset fields.
- `pre("save")` hook hashes the password with bcrypt, only if it was modified
  (so updating a profile without touching password doesn't re-hash it).
- `comparePassword()` — bcrypt.compare against the stored hash.
- `getJwtToken()` — signs a JWT containing the user's id.
- `getResetPasswordToken()` — generates and hashes a random token with a 30
  minute expiry (scaffolded for a forgot-password flow).

### backend/models/order.js
Schema: shippingInfo, user (ref), orderItems[] (each referencing a product),
paymentInfo, price breakdown fields, orderStatus, deliveredAt.

### backend/middlewares/auth.js
- `isAuthenticatedUser` — reads the `token` cookie, verifies the JWT (wrapped
  in try/catch so an expired/invalid token returns a clean 401 instead of
  crashing the request), loads the user onto `req.user`.
- `authorizeRoles(...roles)` — returns middleware that 403s if `req.user.role`
  isn't in the allowed list. Used to lock admin-only routes.

### backend/controllers/productController.js
- `newProduct` — if files were uploaded (via multer), converts each buffer to
  a data URI and uploads it to Cloudinary, then saves the resulting URLs into
  `images[]` before creating the product.
- `getProducts` / `getSingleProduct` / `updateProduct` / `deleteProduct` —
  standard CRUD against the Product model.

### backend/controllers/authController.js
- `registerUser` — creates a user, sends back a JWT cookie via `sendToken()`.
- `loginUser` — looks up the user with the password field explicitly selected
  (it's hidden by default), compares the password, sends a token or 401.
- `logoutUser` — overwrites the cookie with an already-expired one.
- `getUserProfile` — returns the user set on `req.user` by the auth middleware.

### backend/controllers/orderController.js
- `newOrder` — creates an order tied to `req.user._id`.
- `getSingleOrder` / `myOrders` / `allOrders` — read operations, `allOrders`
  also sums total revenue (admin only).
- `updateOrder` — blocks re-delivering an already-delivered order, loops
  through order items with a `for...of` (properly awaited, unlike the common
  `forEach` + async mistake) calling `updateStock()`, then marks it delivered.
- `updateStock()` — **uses an atomic `findOneAndUpdate` with a
  `stock: { $gte: quantity }` filter and `$inc`, instead of read-then-write.**
  This is the fix for the classic "two users buy the last item at the same
  time" race condition — the check and the decrement happen as one atomic
  database operation, so a second concurrent request simply won't match the
  filter once stock is gone.
- `deleteOrder` — standard delete.

### backend/routes/*.js
Just wire up URL + HTTP verb -> controller function, with `isAuthenticatedUser`
and `authorizeRoles("admin")` middleware layered on wherever needed. The
product creation route also runs `upload.array("images", 5)` (multer) before
the controller so `req.files` is populated.

### backend/utils/jwtToken.js
`sendToken()` — signs the JWT, sets it as an httpOnly cookie (so client-side
JS can't read it, reducing XSS token-theft risk), and returns the user object.

### backend/utils/multer.js
Configures multer with in-memory storage (no writing to disk — important for
stateless/ephemeral hosting), a 5MB size limit, and an image-only file filter.

### backend/utils/dataUri.js
Converts an in-memory file buffer into a base64 data URI, which is the format
Cloudinary's upload API accepts directly without needing a temp file on disk.

---

## FRONTEND FILES

### frontend/src/index.js
Real entry point. Imports Bootstrap CSS, renders `<App />` into `#root`.

### frontend/src/App.js
Wraps everything in `<Provider store={store}>` then `<Router>`. On mount,
dispatches `loadUser()` to check if a valid session cookie exists. Renders
`Header` plus whichever page matches the current route, wrapping
auth-required pages in `ProtectedRoute`.

### frontend/src/App.css
All custom styling: dark navbar, orange accent buttons/badges, card hover-lift
shadow, CSS-only star rating bars (using FontAwesome's star glyph twice —
once as a gray background, once clipped to a width based on the rating
percentage), stock counter, order summary box.

### frontend/src/store.js
Combines all reducers into one Redux store. Seeds `initialState.cart` by
reading `cartItems` / `shippingInfo` back out of `localStorage`, so the cart
survives a page refresh. Applies `redux-thunk` (lets action creators be async
functions that dispatch multiple times) and hooks up Redux DevTools.

### frontend/src/constants/*.js
Just string constants for every Redux action type, so typos in action-type
strings become import errors instead of silent bugs.

### frontend/src/actions/productActions.js
`getProducts()` / `getProductDetails(id)` — each dispatches a REQUEST action,
calls the backend via axios, then dispatches SUCCESS with the data or FAIL
with the error message.

### frontend/src/actions/cartActions.js
- `addItemToCart(id, quantity)` — fetches fresh product data (so price/stock
  are always current), dispatches `ADD_TO_CART` with a normalized cart-item
  shape, persists the updated cart to `localStorage`.
- `removeItemFromCart(id)` — dispatches removal, persists.
- `saveShippingInfo(data)` — dispatches and persists shipping address.

### frontend/src/actions/userActions.js
`login`, `register`, `loadUser`, `logout` — each hits its matching auth
endpoint and dispatches request/success/fail action types.

### frontend/src/actions/orderActions.js
`createOrder(order)` — posts the full order object (items, shipping, computed
prices, simulated payment info) to `/api/v1/order/new`.

### frontend/src/reducers/productReducers.js
`productsReducer` (list + loading/error) and `productDetailsReducer` (single
product + loading/error).

### frontend/src/reducers/cartReducers.js
On `ADD_TO_CART`, checks if the product is already in `cartItems` — if so,
replaces that entry (updates quantity); otherwise appends. On
`REMOVE_CART_ITEM`, filters it out. On `SAVE_SHIPPING_INFO`, stores the
address object.

### frontend/src/reducers/userReducers.js
Tracks `loading`, `isAuthenticated`, `user`, `error` across the
login/register/loadUser/logout request-success-fail cycle.

### frontend/src/reducers/orderReducers.js
Tracks loading/order/error for order creation.

### frontend/src/components/layout/Header.js
Reads `cart.cartItems` from Redux to show a live cart-count badge next to a
link to `/cart`.

### frontend/src/components/product/Product.js
Presentational card: image, name (linked to product details), star rating
bar (width computed as `(ratings / 5) * 100%`), review count, price, and a
"View Details" link.

### frontend/src/components/product/Home.js
On mount, dispatches `getProducts()`. Renders a `<Product />` card for each
item in Redux state.

### frontend/src/components/product/ProductDetails.js
On mount (and whenever the `id` URL param changes), dispatches
`getProductDetails(id)`. Local `quantity` state with +/- handlers capped by
`product.stock`. `addToCart()` dispatches `addItemToCart` then navigates to
`/cart`.

### frontend/src/components/cart/Cart.js
Reads `cartItems` from Redux. `increaseQty`/`decreaseQty` re-dispatch
`addItemToCart` with an adjusted quantity (capped by stock and a minimum of
1). `removeCartItemHandler` dispatches removal. Computes the subtotal via
`.reduce()`. `checkoutHandler` navigates to `/shipping`.

### frontend/src/components/cart/Shipping.js
Local state per address field, pre-filled from Redux if shipping info was
already saved. On submit, dispatches `saveShippingInfo()` and navigates to
`/order/confirm`.

### frontend/src/components/cart/ConfirmOrder.js
Reads `cartItems`, `shippingInfo`, `user` from Redux. Computes
`itemsPrice`/`shippingPrice` (free above ₹500)/`taxPrice` (5%)/`totalPrice`.
Stashes those numbers in `sessionStorage` and navigates to `/payment`.

### frontend/src/components/cart/Payment.js
Reads the price numbers back from `sessionStorage`. On "Pay Now", builds the
full order payload (including a simulated `paymentInfo` — swap this for a
real Stripe/Razorpay integration later), dispatches `createOrder()`, and
navigates to `/order/success`.

### frontend/src/components/cart/OrderSuccess.js
Static confirmation page.

### frontend/src/components/user/Login.js
Local email/password state. Reads a `redirect` query param so it can send the
user back to whichever protected page they were trying to reach. Dispatches
`login()` on submit; a `useEffect` watches `isAuthenticated`/`error` to
redirect or surface errors.

### frontend/src/components/user/Register.js
Same pattern as Login but for `register()`, with name/email/password tracked
in one state object.

### frontend/src/components/route/ProtectedRoute.js
Reads `isAuthenticated`/`loading` from Redux. Renders `<Navigate to="/login" />`
instead of its children if the user isn't authenticated.

### frontend/src/components/admin/NewProduct.js
Local state for every product field plus `images`/`imagesPreview` arrays.
`onImagesChange` reads selected files and uses `FileReader` to generate
preview thumbnails client-side. On submit, builds a `FormData` object
(required for actual file uploads) and posts it as `multipart/form-data` to
`/api/v1/admin/product/new`.

---

## Concurrency notes (interview-relevant)

The most important fix baked into this version vs. a naive first draft:
`updateStock()` in `orderController.js` uses

```js
await Product.findOneAndUpdate(
    { _id: id, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } }
);
```

instead of `findById` -> subtract in JS -> `.save()`. The naive version reads
stock, then writes it back — leaving a window where two concurrent requests
can both read "stock: 1", both think they can proceed, and both decrement,
taking stock negative. The atomic version makes MongoDB check-and-decrement
as a single indivisible operation, so a second request arriving a millisecond
later simply won't match the filter anymore once stock is insufficient.

Also fixed: the stock-update loop uses `for...of` with `await` instead of
`forEach` with an async callback — `forEach` does not wait for its callbacks,
so the original pattern could let `order.save()` run before all stock updates
actually finished.
