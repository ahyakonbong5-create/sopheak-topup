const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { Pool } = require("pg");

const app = express();

const PORT = process.env.PORT || 10000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*
|--------------------------------------------------------------------------
| Static website
|--------------------------------------------------------------------------
*/

app.use(express.static(path.join(__dirname, "public")));

/*
|--------------------------------------------------------------------------
| Game + Diamond packages
|--------------------------------------------------------------------------
| IMPORTANT:
| Replace these packages with your actual authorized prices/products.
|
*/

const GAMES = {
"Mobile Legends": {
currency: "Diamonds",
products: [
{ id: "ml-86", name: "86 Diamonds", price: 5000 },
{ id: "ml-172", name: "172 Diamonds", price: 9500 },
{ id: "ml-257", name: "257 Diamonds", price: 14000 },
{ id: "ml-344", name: "344 Diamonds", price: 18500 },
{ id: "ml-429", name: "429 Diamonds", price: 22500 },
{ id: "ml-514", name: "514 Diamonds", price: 27000 }
]
},

"Free Fire": {
currency: "Diamonds",
products: [
{ id: "ff-100", name: "100 Diamonds", price: 5000 },
{ id: "ff-310", name: "310 Diamonds", price: 14000 },
{ id: "ff-520", name: "520 Diamonds", price: 22000 },
{ id: "ff-1060", name: "1060 Diamonds", price: 42000 }
]
},

"PUBG Mobile": {
currency: "UC",
products: [
{ id: "pubg-60", name: "60 UC", price: 5000 },
{ id: "pubg-325", name: "325 UC", price: 24000 },
{ id: "pubg-660", name: "660 UC", price: 47000 },
{ id: "pubg-1800", name: "1800 UC", price: 120000 }
]
},

"Call of Duty Mobile": {
currency: "CP",
products: [
{ id: "cod-80", name: "80 CP", price: 6000 },
{ id: "cod-420", name: "420 CP", price: 28000 },
{ id: "cod-880", name: "880 CP", price: 55000 }
]
}
};

/*
|--------------------------------------------------------------------------

In-memory orders

|
| This is suitable for testing the backend.
| For production, use a real database such as PostgreSQL.
|
*/


/*
|--------------------------------------------------------------------------

Helpers
*/

function createOrderId() {
return (
"SP" +
Date.now().toString(36).toUpperCase() +
crypto.randomBytes(3).toString("hex").toUpperCase()
);
}

function findGame(gameName) {
return GAMES[gameName];
}

function findProduct(gameName, productId) {
const game = findGame(gameName);

if (!game) {
return null;
}

return game.products.find(
product => String(product.id) === String(productId)
);
}

/*
|--------------------------------------------------------------------------

Health check
*/

app.get("/api/health", async (req, res) => {
try {

const result = await pool.query(
  "SELECT COUNT(*)::int AS count FROM orders"
);

res.json({
  success: true,
  service: "Sopheak Top Up",
  status: "online",
  games: Object.keys(GAMES).length,
  orders: result.rows[0].count
});

} catch (error) {

console.error("[HEALTH ERROR]", error);

res.status(500).json({
  success: false,
  service: "Sopheak Top Up",
  status: "database_error"
});

}
});

/*
|--------------------------------------------------------------------------

Prices API

|
| V3 index.html uses this endpoint.
|
*/

app.get("/api/prices", (req, res) => {
res.json({
success: true,
games: GAMES
});
});

/*
|--------------------------------------------------------------------------

Create Order

|
| POST /api/orders
|
| Body:
|
| {
|   game: "Mobile Legends",
|   productId: "ml-86",
|   playerId: "123456",
|   serverId: "1234"
| }
|
*/

app.post("/api/orders", async (req, res) => {
try {
const {
game,
productId,
playerId,
serverId
} = req.body || {};

if (!game) {
  return res.status(400).json({
    success: false,
    error: "Game is required"
  });
}


if (!productId) {
  return res.status(400).json({
    success: false,
    error: "Product is required"
  });
}


if (!playerId) {
  return res.status(400).json({
    success: false,
    error: "Player ID is required"
  });
}


const product =
  findProduct(game, productId);


if (!product) {
  return res.status(400).json({
    success: false,
    error: "Invalid game or product"
  });
}


const orderId =
  createOrderId();


const order = {
  orderId,

  game,

  productId: product.id,

  productName: product.name,

  price: product.price,

  playerId: String(playerId),

  serverId:
    serverId
      ? String(serverId)
      : "",

  status: "PAYMENT_PENDING",

  paymentStatus: "PENDING",

  topupStatus: "NOT_STARTED",

  createdAt:
    new Date().toISOString(),

  updatedAt:
    new Date().toISOString()
};


await pool.query(
  `INSERT INTO orders (
    order_id,
    game,
    product_id,
    product_name,
    price,
    player_id,
    server_id,
    status,
    payment_status,
    topup_status,
    created_at,
    updated_at
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
  [
    order.orderId,
    order.game,
    order.productId,
    order.productName,
    order.price,
    order.playerId,
    order.serverId,
    order.status,
    order.paymentStatus,
    order.topupStatus,
    order.createdAt,
    order.updatedAt
  ]
);


console.log(
  `[ORDER] ${orderId} ${game} ${product.name}`
);


return res.status(201).json({
  success: true,
  order
});

} catch (error) {

console.error(
  "[CREATE ORDER ERROR]",
  error
);

return res.status(500).json({
  success: false,
  error: "Unable to create order"
});

}
});

/*
|--------------------------------------------------------------------------

Get Order

|
| GET /api/orders/:id
|
*/

app.get("/api/orders/:id", async (req, res) => {

try {

const result = await pool.query(
  `SELECT
    order_id,
    game,
    product_id,
    product_name,
    price,
    player_id,
    server_id,
    status,
    payment_status,
    topup_status,
    created_at,
    updated_at
  FROM orders
  WHERE order_id = $1`,
  [req.params.id]
);

if (result.rows.length === 0) {
  return res.status(404).json({
    success: false,
    error: "Order not found"
  });
}

const row = result.rows[0];

const order = {
  orderId: row.order_id,
  game: row.game,
  productId: row.product_id,
  productName: row.product_name,
  price: row.price,
  playerId: row.player_id,
  serverId: row.server_id || "",
  status: row.status,
  paymentStatus: row.payment_status,
  topupStatus: row.topup_status,
  createdAt: row.created_at,
  updatedAt: row.updated_at
};

return res.json({
  success: true,
  order
});

} catch (error) {

console.error("[GET ORDER ERROR]", error);

return res.status(500).json({
  success: false,
  error: "Unable to get order"
});

}

});

/*
|--------------------------------------------------------------------------

Payment Creation Integration Point

|
| This endpoint DOES NOT fake a successful payment.
|
| Connect your authorized payment provider here.
|
*/

app.post("/api/payment/create", async (req, res) => {

const { orderId } =
req.body || {};

const result = await pool.query(
  `SELECT
    order_id,
    game,
    product_id,
    product_name,
    price,
    player_id,
    server_id,
    status,
    payment_status,
    topup_status,
    created_at,
    updated_at
  FROM orders
  WHERE order_id = $1`,
  [orderId]
);

const row = result.rows[0];

const order = row ? {
  orderId: row.order_id,
  game: row.game,
  productId: row.product_id,
  productName: row.product_name,
  price: row.price,
  playerId: row.player_id,
  serverId: row.server_id || "",
  status: row.status,
  paymentStatus: row.payment_status,
  topupStatus: row.topup_status,
  createdAt: row.created_at,
  updatedAt: row.updated_at
} : null;

if (!order) {
return res.status(404).json({
success: false,
error: "Order not found"
});
}

if (
order.paymentStatus ===
"PAID"
) {
return res.json({
success: true,
message: "Order already paid",
order
});
}


/*
* TODO:
* 
* Call your authorized payment provider here.
* 
* Example flow:
* 
* 1. Send order amount to provider
* 2. Receive checkout/payment URL
* 3. Return URL to frontend
* 
* Never put PAYMENT_SECRET in index.html.
  */

return res.status(501).json({
success: false,
error:
"Payment provider is not connected yet"
});

});

/*
|--------------------------------------------------------------------------

Payment Webhook

|
| Your authorized payment provider should call this endpoint after
| successfully verifying a payment.
|
| IMPORTANT:
| Verify the provider's webhook signature before marking an order PAID.
|
*/

app.post("/api/payment/webhook", (req, res) => {

/*

* TODO:

* 1. Verify webhook signature
* 2. Verify transaction/order ID
* 3. Verify amount
* 4. Verify currency
* 5. Mark order as PAID
* 6. Start authorized top-up process
     */

return res.status(501).json({
success: false,
error:
"Payment webhook provider is not connected yet"
});

});

/*
|--------------------------------------------------------------------------

Top-up Integration Point

|
| This endpoint deliberately does NOT claim that diamonds were delivered.
|
| Once you have an authorized top-up provider/API, connect it here.
|
*/

app.post("/api/topup", async (req, res) => {

const { orderId } =
req.body || {};

const result = await pool.query(
  `SELECT
    order_id,
    game,
    product_id,
    product_name,
    price,
    player_id,
    server_id,
    status,
    payment_status,
    topup_status,
    created_at,
    updated_at
  FROM orders
  WHERE order_id = $1`,
  [orderId]
);

const row = result.rows[0];

const order = row ? {
  orderId: row.order_id,
  game: row.game,
  productId: row.product_id,
  productName: row.product_name,
  price: row.price,
  playerId: row.player_id,
  serverId: row.server_id || "",
  status: row.status,
  paymentStatus: row.payment_status,
  topupStatus: row.topup_status,
  createdAt: row.created_at,
  updatedAt: row.updated_at
} : null;

if (!order) {
return res.status(404).json({
success: false,
error: "Order not found"
});
}

if (
order.paymentStatus !==
"PAID"
) {
return res.status(400).json({
success: false,
error:
"Payment has not been verified"
});
}


/*
* TODO:
* 
* Call an authorized game top-up provider here.
* 
* Do NOT directly attempt to access game accounts.
  */

return res.status(501).json({
success: false,
error:
"Top-up provider is not connected yet"
});

});

/*
|--------------------------------------------------------------------------

Admin price API

|
| Price updates should eventually be protected by authentication
| and stored in a database.
|
| This endpoint is intentionally disabled until proper authentication
| and persistent storage are added.
|
*/

app.post("/api/admin/prices", (req, res) => {

return res.status(501).json({
success: false,
error:
"Admin price management is not enabled yet"
});

});

/*
|--------------------------------------------------------------------------

SPA fallback
*/

app.get("/*splat", (req, res) => {

res.sendFile(
path.join(
__dirname,
"public",
"index.html"
)
);

});

/*
|--------------------------------------------------------------------------
| Start server
|--------------------------------------------------------------------------
*/

async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not set - skipping PostgreSQL locally");
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      game TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      price INTEGER NOT NULL,
      player_id TEXT NOT NULL,
      server_id TEXT,
      status TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      topup_status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `);

  console.log("PostgreSQL database ready");
}

initDatabase()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Sopheak Top Up running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
    process.exit(1);
  });
