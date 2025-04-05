// server.js or app.js (Node.js environment)
const express = require("express");
const { Pool } = require("pg");
const fs = require("fs");
const cors = require("cors");
const { getSimilarCases } = require("./embeddings");

const app = express();
app.use(
  cors({
    origin: true,
  })
);
app.use(express.json()); // Add this line to parse JSON request bodies

const config = {
  user: "avnadmin",
  password: "AVNS_RFEmJuXRP9v7DvMIwpD",
  host: "pg-walmart-bot-walmart.k.aivencloud.com",
  port: "28810",
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
};

const pool = new Pool(config);

app.get("/get-all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM documents");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/get-similar-cases", async (req, res) => {
  try {
    console.log(req.body);
    const { summary } = req.body; // Change req.body() to req.body
    console.log(summary);
    const result = await getSimilarCases(summary);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
