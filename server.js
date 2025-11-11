const express = require('express');
const { scrapeVideoUrl, downloadVideo } = require('./scraper');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  try {
    const videoUrl = await scrapeVideoUrl(url);
    res.json({ videoUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/download', async (req, res) => {
  const { videoUrl } = req.query;
  try {
    const data = await downloadVideo(videoUrl);
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename=sora_video.mp4');
    res.send(Buffer.from(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
