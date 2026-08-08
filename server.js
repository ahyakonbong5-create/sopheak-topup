const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// =========================
// GAMES & PRODUCTS
// =========================

const games = {
  "Mobile Legends": {
    currency: "Diamonds",
    products: [
      { id: "ml_11", name: "11 Diamonds", price: 1000 },
      { id: "ml_56", name: "56 Diamonds", price: 4000 },
      { id: "ml_112", name: "112 Diamonds", price: 8000 },
      { id: "ml_223", name: "223 Diamonds", price: 15000 },
      { id: "ml_336", name: "336 Diamonds", price: 22000 },
      { id: "ml_weekly", name: "Weekly Pass", price: 7000 },
      { id: "ml_monthly", name: "Monthly Pass", price: 30000 }
    ]
  },

  "Free Fire": {
    currency: "Diamonds",
    products: [
      { id: "ff_100", name: "100 Diamonds", price: 2000 },
      { id: "ff_310", name: "310 Diamonds", price: 6000 },
      { id: "ff_520", name: "520 Diamonds", price: 10000 },
      { id: "ff_1060", name: "1060 Diamonds", price: 19000 },
      { id: "ff_2180", name: "2180 Diamonds", price: 38000 },
      { id: "ff_weekly", name: "Weekly Membership", price: 7000 },
      { id: "ff_monthly", name: "Monthly Membership", price: 30000 }
    ]
  },

  "PUBG Mobile": {
    currency: "UC",
    products: [
      { id: "pubg_60", name: "60 UC", price: 4000 },
      { id: "pubg_325", name: "325 UC", price: 20000 },
      { id: "pubg_660", name: "660 UC", price: 40000 },
      { id: "pubg_1800", name: "1800 UC", price: 105000 },
      { id: "pubg_3850", name: "3850 UC", price: 210000 },
      { id: "pubg_8100", name: "8100 UC", price: 420000 }
    ]
  },

  "Honor of Kings": {
    currency: "Tokens",
    products: [
      { id: "hok_80", name: "80 Tokens", price: 2000 },
      { id: "hok_240", name: "240 Tokens", price: 6000 },
      { id: "hok_400", name: "400 Tokens", price: 10000 },
      { id: "hok_800", name: "800 Tokens", price: 20000 },
      { id: "hok_1200", name: "1200 Tokens", price: 30000 }
    ]
  },

  "Call of Duty Mobile": {
    currency: "CP",
    products: [
      { id: "cod_80", name: "80 CP", price: 4000 },
      { id: "cod_420", name: "420 CP", price: 20000 },
      { id: "cod_880", name: "880 CP", price: 40000 },
      { id: "cod_2400", name: "2400 CP", price: 105000 },
      { id: "cod_5000", name: "5000 CP", price: 210000 }
    ]
  },

  "Arena of Valor": {
    currency: "Vouchers",
    products: [
      { id: "aov_100", name: "100 Vouchers", price: 3000 },
      { id: "aov_300", name: "300 Vouchers", price: 8000 },
      { id: "aov_600", name: "600 Vouchers", price: 15000 },
      { id: "aov_1200", name: "1200 Vouchers", price: 30000 }
    ]
  },

  "Genshin Impact": {
    currency: "Genesis Crystals",
    products: [
      { id: "genshin_60", name: "60 Crystals", price: 5000 },
      { id: "genshin_300", name: "300 Crystals", price: 22000 },
      { id: "genshin_980", name: "980 Crystals", price: 65000 },
      { id: "genshin_1980", name: "1980 Crystals", price: 130000 },
      { id: "genshin_3280", name: "3280 Crystals", price: 210000 },
      { id: "genshin_6480", name: "6480 Crystals", price: 420000 },
      { id: "genshin_welkin", name: "Blessing of the Welkin Moon", price: 22000 }
    ]
  },

  "Honkai Star Rail": {
    currency: "Oneiric Shards",
    products: [
      { id: "hsr_60", name: "60 Shards", price: 5000 },
      { id: "hsr_300", name: "300 Shards", price: 22000 },
      { id: "hsr_980", name: "980 Shards", price: 65000 },
      { id: "hsr_1980", name: "1980 Shards", price: 130000 },
      { id: "hsr_3280", name: "3280 Shards", price: 210000 },
      { id: "hsr_6480", name: "6480 Shards", price: 420000 },
      { id: "hsr_pass", name: "Express Supply Pass", price: 22000 }
    ]
  },

  "Zenless Zone Zero": {
    currency: "Monochromes",
    products: [
      { id: "zzz_60", name: "60 Monochromes", price: 5000 },
      { id: "zzz_300", name: "300 Monochromes", price: 22000 },
      { id: "zzz_980", name: "980 Monochromes", price: 65000 },
      { id: "zzz_1980", name: "1980 Monochromes", price: 130000 },
      { id: "zzz_3280", name: "3280 Monochromes", price: 210000 },
      { id: "zzz_6480", name: "6480 Monochromes", price: 420000 },
      { id: "zzz_membership", name: "Inter-Knot Membership", price: 22000 }
    ]
  },

  "Roblox": {
    currency: "Robux",
    products: [
      { id: "robux_80", name: "80 Robux", price: 5000 },
      { id: "robux_400", name: "400 Robux", price: 22000 },
      { id: "robux_800", name: "800 Robux", price: 42000 },
      { id: "robux_1700", name: "1700 Robux", price: 85000 },
      { id: "robux_4500", name: "4500 Robux", price: 210000 }
    ]
  },

  "Wild Rift": {
    currency: "Wild Cores",
    products: [
      { id: "wr_425", name: "425 Wild Cores", price: 10000 },
      { id: "wr_1000", name: "1000 Wild Cores", price: 22000 },
      { id: "wr_1850", name: "1850 Wild Cores", price: 40000 },
      { id: "wr_3750", name: "3750 Wild Cores", price: 80000 }
    ]
  },

  "Clash of Clans": {
    currency: "Gems",
    products: [
      { id: "coc_80", name: "80 Gems", price: 3000 },
      { id: "coc_500", name: "500 Gems", price: 15000 },
      { id: "coc_1200", name: "1200 Gems", price: 30000 },
      { id: "coc_2500", name: "2500 Gems", price: 60000 },
      { id: "coc_6500", name: "6500 Gems", price: 150000 }
    ]
  }
};

// =========================
// ORDERS
// =========================

const orders = [];

function generateOrderId() {
  const number = String(orders.length + 1).padStart(5, "0");
  return `SOP-${Date.now()}-${number}`;
}

// =========================
// API STATUS
// =========================

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    service: "Sopheak Top Up",
    status: "online",
    games: Object.keys(games).length,
    orders: orders.length
  });
});

// =========================
// PRICES
// =========================

app.get("/api/prices", (req, res) => {
  res.json({
    success: true,
    service: "Sopheak Top Up",
    currency: "KHR",
    games
  });
});

// =========================
// SINGLE GAME
// =========================

app.get("/api/prices/:game", (req, res) => {
  const game = games[req.params.game];

  if (!game) {
    return res.status(404).json({
      success: false,
      error: "Game not found"
    });
  }

  res.json({
    success: true,
    game: req.params.game,
    currency: game.currency,
    products: game.products
  });
});

// =========================
// CREATE ORDER
// =========================

app.post("/api/orders", (req, res) => {
  const {
    game,
    productId,
    playerId,
    serverId
  } = req.body;

  if (!game || !productId || !playerId) {
    return res.status(400).json({
      success: false,
      error: "game, productId and playerId are required"
    });
  }

  const selectedGame = games[game];

  if (!selectedGame) {
    return res.status(404).json({
      success: false,
      error: "Game not found"
    });
  }

  const product = selectedGame.products.find(
    item => item.id === productId
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      error: "Product not found"
    });
  }

  const order = {
    orderId: generateOrderId(),
    game,
    productId: product.id,
    productName: product.name,
    currency: selectedGame.currency,
    price: product.price,
    playerId: String(playerId),
    serverId: serverId ? String(serverId) : null,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order
  });
});

// =========================
// GET ORDERS
// =========================

app.get("/api/orders", (req, res) => {
  res.json({
    success: true,
    count: orders.length,
    orders
  });
});

// =========================
// GET ONE ORDER
// =========================

app.get("/api/orders/:orderId", (req, res) => {
  const order = orders.find(
    item => item.orderId === req.params.orderId
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      error: "Order not found"
    });
  }

  res.json({
    success: true,
    order
  });
});

// =========================
// UPDATE ORDER STATUS
// =========================

app.patch("/api/orders/:orderId/status", (req, res) => {
  const { status } = req.body;

  const allowedStatuses = [
    "PENDING",
    "PROCESSING",
    "COMPLETED",
    "CANCELLED"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status",
      allowedStatuses
    });
  }

  const order = orders.find(
    item => item.orderId === req.params.orderId
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      error: "Order not found"
    });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Order status updated",
    order
  });
});

// =========================
// HEALTH
// =========================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "Sopheak Top Up",
    status: "healthy"
  });
});

// =========================
// START SERVER
// =========================

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Sopheak Top Up running on port ${PORT}`
  );
});
