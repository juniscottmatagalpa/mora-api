const puppeteer = require('puppeteer');

async function scrapeVideoUrl(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Esperar a que el video se cargue
  await page.waitForSelector('video');

  // Obtener la URL del video
  const videoElement = await page.$('video');
  const videoSrc = await videoElement.evaluate(el => el.src);

  await browser.close();

  return videoSrc;
}

async function downloadVideo(videoUrl) {
  const response = await fetch(videoUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo descargar el archivo remoto');
  }

  const data = await response.arrayBuffer();
  return data;
}

module.exports = { scrapeVideoUrl, downloadVideo };
