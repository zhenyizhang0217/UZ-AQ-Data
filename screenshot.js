const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });

  // 打开网页
  await page.goto('https://monitoring.meteo.uz/ru/map/view/716', {
    waitUntil: 'networkidle2'
  });

  // 等待 2 秒确保页面加载
  await new Promise(r => setTimeout(r, 2000));

  // 保存截图
  const filename = `screenshot-${new Date().toISOString().replace(/:/g,'-')}.png`;
  await page.screenshot({ path: filename, fullPage: true });

  await browser.close();
  console.log('Saved:', filename);
})();
