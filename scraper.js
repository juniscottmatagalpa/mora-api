const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

async function scrapeVideoUrl(url) {
  let browser = null;

  try {
    // Lanzar Chrome usando la versión compatible con AWS Lambda / Vercel
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath || "/usr/bin/chromium-browser",
      headless: true,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Esperar a que exista un <video>
    await page.waitForSelector("video", { timeout: 20000 });

    // Obtener la URL del video
    const videoSrc = await page.$eval("video", el => el.src);

    return videoSrc;
  } catch (error) {
    console.error("❌ Error en el scraper:", error);
    throw new Error(`Fallo en el scraping: ${error.message}`);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

module.exports = scrapeVideoUrl;
