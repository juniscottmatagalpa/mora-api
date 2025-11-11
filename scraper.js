const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

async function scrapeVideoUrl(url) {
  let browser = null;

  try {
    const executablePath = await chromium.executablePath;

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        executablePath ||
        "/usr/bin/google-chrome", // fallback local
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("video");

    const videoSrc = await page.$eval("video", el => el.src);

    await browser.close();

    return videoSrc;
  } catch (error) {
    if (browser) await browser.close();
    throw new Error("Fallo en el scraping: " + error.message);
  }
}

module.exports = scrapeVideoUrl;
