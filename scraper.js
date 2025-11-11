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

module.exports = scrapeVideoUrl;
