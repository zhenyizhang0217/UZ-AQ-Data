const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let browser;
    try {
        const dir = './screenshots';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 1280 });

        console.log('正在访问网页...');
        await page.goto('https://monitoring.meteo.uz/ru/map/view/716', {
            waitUntil: 'networkidle2'
        });

        await new Promise(r => setTimeout(r, 3000));

        // --- 处理时区：UTC+5 (比北京 UTC+8 晚3小时) ---
        const now = new Date();
        // 计算 UTC+5 的时间：先转为 UTC，再加 5 小时
        const localTime = new Date(now.getTime() + (5 * 60 * 60 * 1000));
        
        // 格式化为: YYYY-MM-DD_HH-mm
        const datePart = localTime.toISOString().split('T')[0]; // 2024-05-20
        const timePart = localTime.toISOString().split('T')[1].substring(0, 5).replace(':', '-'); // 05-10
        const filename = `screenshots/${datePart}_${timePart}.png`;

        console.log(`正在保存当地时间截图 (UTC+5): ${filename}`);
        await page.screenshot({ path: filename, fullPage: true });

        await browser.close();
        console.log('保存成功！');

    } catch (error) {
        console.error('运行出错:', error);
        if (browser) await browser.close();
        process.exit(1);
    }
})();
