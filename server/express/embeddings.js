// const dotenv = require("dotenv");
// dotenv.config({ path: "./.env" });

const fs = require("fs");
const pgPromise = require('pg-promise');
const pgp = pgPromise({
    capSQL: true
});

// models
const tf = require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");

const config = {
    user: "avnadmin",
    password: "AVNS_RFEmJuXRP9v7DvMIwpD",
    host: "pg-walmart-bot-walmart.k.aivencloud.com",
    port: "28810",
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ca.pem').toString(),
    },
};

const db = pgp(config);

module.exports.getSimilarCases = async (summary) => {
    try {
        const model = await use.load();
        const embeddings = await model.embed(summary);
        const embeddingArray = embeddings.arraySync()[0];

        const pgResponse = await db.query(
            `SELECT * FROM documents
            ORDER BY embedding <-> $1 
            LIMIT 5;`,
            [JSON.stringify(embeddingArray)]
        );
        return pgResponse;
    } catch (error) {
        console.error("Error in getSimilarCases:", error);
        if (error instanceof TypeError && error.message.includes("fetch failed")) {
            console.error("Network error occurred. Please check your internet connection.");
        }
        throw error;
    }
};
