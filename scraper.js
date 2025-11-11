const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

async function scrapeVideoUrl(url) {
  let browser;

  try {
    // Detectar entorno
    const isServerless = !!process.env.AWS_REGION || !!process.env.VERCEL;

    // Obtener ruta del ejecutable
    const executablePath = isServerless
      ? await chromium.executablePath
      : puppeteer.executablePath?.() || "/usr/bin/google-chrome-stable";

    console.log("✅ Ejecutando Chrome desde:", executablePath);

    // Lanzar navegador
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    console.log("🌐 Navegando a:", url);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Esperar que cargue un video
    await page.waitForSelector("video", { timeout: 15000 });
    console.log("🎥 Elemento <video> detectado");

    // Extraer fuente del video
    const videoSrc = await page.$eval("video", el => el.src);

    await browser.close();

    if (!videoSrc) throw new Error("No se encontró un enlace de video válido");
    return videoSrc;

  } catch (err) {
    console.error("❌ Error en scrapeVideoUrl:", err);
    throw new Error("Fallo en el scraping: " + err.message);
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = scrapeVideoUrl;
