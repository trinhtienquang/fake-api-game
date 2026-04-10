import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

/**
 * =========================
 * FAKE DATA
 * =========================
 */

// fake server list
const servers = [
  { server_id: "1", server_name: "S1-ThienHa" },
  { server_id: "2", server_name: "S2-DiaCau" }
];

// fake character DB
const characters = [
  {
    character_id: "123",
    character_name: "PlayerABC",
    server_id: "1"
  },
  {
    character_id: "456",
    character_name: "PlayerXYZ",
    server_id: "2"
  }
];

// fake transaction DB (RAM)
const transactions = [];

/**
 * =========================
 * 1. GET SERVERS
 * =========================
 */
app.get("/api/servers", (req, res) => {
  res.json( servers );
});

/**
 * =========================
 * 2. GET CHARACTER
 * =========================
 */
app.post("/api/character", (req, res) => {
  const { character_id, server_id } = req.body;

  const character = characters.find(
    (c) =>
      c.character_id === character_id &&
      c.server_id === server_id
  );

  if (!character) {
    return res.status(404).json({ error: "Character not found" });
  }

  const server = servers.find((s) => s.server_id === server_id);

  res.json({
    character_id: character.character_id,
    character_name: character.character_name,
    server_id,
    server_name: server?.server_name || "Unknown"
  });
});

/**
 * =========================
 * 3. CREATE TRANSACTION
 * =========================
 */
app.post("/api/transaction/create", (req, res) => {
  const { character_id, server_id, recharge_package_id } = req.body;

  if (!character_id || !server_id || !recharge_package_id) {
    return res.status(400).json({ error: "Missing params" });
  }

  // check character
  const character = characters.find(
    (c) =>
      c.character_id === character_id &&
      c.server_id === server_id
  );

  if (!character) {
    return res.status(400).json({ error: "Invalid character" });
  }

  // create transaction
  const transaction_id = "TXN_" + Date.now() + "_" + uuidv4();

  const newTransaction = {
    transaction_id,
    character_id,
    server_id,
    recharge_package_id,
    status: "PENDING",
    created_at: new Date()
  };

  transactions.push(newTransaction);

  res.json({
    transaction_id,
    status: "PENDING"
  });
});

/**
 * =========================
 * (OPTIONAL) CHECK TRANSACTION
 * =========================
 */
app.get("/api/transaction/:id", (req, res) => {
  const txn = transactions.find(
    (t) => t.transaction_id === req.params.id
  );

  if (!txn) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(txn);
});

/**
 * =========================
 * RUN SERVER
 * =========================
 */
app.listen(3333, () => {
  console.log("Server running at http://192.168.1.43:3333");
});
