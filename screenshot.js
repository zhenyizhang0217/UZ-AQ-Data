const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });

  await page.goto('https://monitoring.meteo.uz/ru/map/view/716', {
    waitUntil: 'networkidle2'
  });

  await new Promise(r => setTimeout(r, 2000));

  // 文件名 = 日期 + 小时
  const now = new Date();
  const filename = `screenshot-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}.png`;

  await page.screenshot({ path: filename, fullPage: true });

  await browser.close();
  console.log('Saved:', filename);
})();
