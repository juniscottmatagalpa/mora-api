const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

async function scrapeVideoUrl(url) {
  // Lanzar navegador usando la versión de Chrome compatible con Vercel
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitForSelector("video");

  const videoSrc = await page.$eval("video", el => el.src);

  await browser.close();
  return videoSrc;
}

module.exports = scrapeVideoUrl;
