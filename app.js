import express from "express";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// --1- Configuration des chemins ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -2-- Initialisation de l'application Express ---
const app = express();
const PORT = 3000;

// --3- Connexion à la base SQLite ---
const dbPath = path.join(__dirname, "Banks.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur de connexion à la base :", err.message);
  } else {
    console.log("✅ Connecté à la base SQLite :", dbPath);
  }
});

// --4- Servir les fichiers statiques ---
app.use(express.static(__dirname));

// --5- Routes API ---

//  Récupérer toutes les banques
app.get("/api/banks", (req, res) => {
  const query = "SELECT * FROM Largest_banks";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Erreur lecture base" });
    } else {
      res.json(rows);
    }
  });
});

//  Récupérer les banques filtrées par seuil de GDP
app.get("/api/banks-filtered", (req, res) => {
  const seuil = Number(req.query.seuil) || 0;
  const query = "SELECT * FROM Largest_banks WHERE GDP_USD_billions >= ?";
  db.all(query, [seuil], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Erreur requête SQL" });
    } else {
      res.json(rows);
    }
  });
});

// --6- Démarrage du serveur ---
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express en ligne sur http://localhost:${PORT}`);
});
