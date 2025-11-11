const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

async function scrapeVideoUrl(url) {
  let browser;

  try {
    // ✅ Detectar si estamos en Vercel (entorno serverless)
    const isVercel = !!process.env.VERCEL;

    // ✅ Obtener la ruta del ejecutable adecuada
    const executablePath = isVercel
      ? await chromium.executablePath // usar el empaquetado de chrome-aws-lambda
      : puppeteer.executablePath();   // usar Chrome local si ejecutas en tu PC

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Esperar que aparezca un elemento <video>
    await page.waitForSelector("video", { timeout: 10000 });

    const videoSrc = await page.$eval("video", el => el.src);

    return videoSrc;
  } catch (err) {
    console.error("❌ Error en scrapeVideoUrl:", err);
    throw new Error("Fallo en el scraping: " + err.message);
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = scrapeVideoUrl;
