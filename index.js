import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PUBLIC_KEY = process.env.AEX_PUBLIC_KEY;
const PRIVATE_KEY = process.env.AEX_PRIVATE_KEY;
const SESSION_CODE = process.env.AEX_SESSION_CODE;
const BASE_URL = process.env.BASE_URL;

const authHeaders = {
  "Content-Type": "application/json",
  "aex-public-key": PUBLIC_KEY,
  "aex-private-key": PRIVATE_KEY,
  "codigo-sesion": SESSION_CODE
};

app.post("/cotizar", async (req, res) => {
  const { origen, destino, peso } = req.body;
  try {
    const response = await fetch(`${BASE_URL}/cotizacion`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ origen, destino, peso })
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/crear-envio", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/envios`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/tracking/:guia", async (req, res) => {
  const { guia } = req.params;
  try {
    const response = await fetch(`${BASE_URL}/tracking/${guia}`, {
      headers: authHeaders
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
