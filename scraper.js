const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

async function scrapeVideoUrl(url) {
  let browser = null;

  try {
    // Intentar usar el Chrome proporcionado por chrome-aws-lambda
    let executablePath = await chromium.executablePath;

    // Si no está disponible (por ejemplo, en Vercel localmente)
    if (!executablePath) {
      executablePath = "/usr/bin/google-chrome"; // fallback típico
    }

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("video");

    const videoSrc = await page.$eval("video", (el) => el.src);

    return videoSrc;
  } catch (err) {
    console.error("❌ Error en scrapeVideoUrl:", err);
    throw new Error("Fallo en el scraping: " + err.message);
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = scrapeVideoUrl;
