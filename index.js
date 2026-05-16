const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json({ limit: '50mb' })); // Agar bisa menerima file HTML ukuran besar

app.post('/api/render', async (req, res) => {
    try {
        const { html } = req.body;
        
        // Buka browser rahasia di cloud
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 });
        
        // Masukkan HTML Xynnn Bot
        await page.setContent(html, { waitUntil: 'load', timeout: 60000 });
        
        // Jepret gambarnya!
        const element = await page.$('.device-screen');
        const imageBuffer = await element.screenshot();
        
        await browser.close();
        
        // Kirim gambar balik ke Xynnn Bot
        res.setHeader('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Xynnn berjalan di port ${PORT}`));
