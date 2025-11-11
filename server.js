const express = require("express");
const scrapeVideoUrl = require("./scraper");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Falta el parámetro 'url'." });
  }

  try {
    console.log("🔍 Solicitando scraping de:", url);
    const videoUrl = await scrapeVideoUrl(url);
    res.json({ videoUrl });
  } catch (error) {
    console.error("❌ Scrape error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 API Sora Video Scraper funcionando correctamente.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
