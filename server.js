const express = require("express");
const scrapeVideoUrl = require("./scraper");
const app = express();

app.use(express.json());

// Endpoint principal
app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Falta parámetro 'url'" });
  }

  try {
    const videoUrl = await scrapeVideoUrl(url);
    res.json({ videoUrl });
  } catch (error) {
    console.error("❌ Scrape error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Exportar el handler para Vercel
module.exports = app;
