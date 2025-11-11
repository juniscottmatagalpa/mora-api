const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function scrapeVideoUrl(url) {
  const executablePath = await chromium.executablePath;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.waitForSelector('video');

  const videoSrc = await page.$eval('video', el => el.src);

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

