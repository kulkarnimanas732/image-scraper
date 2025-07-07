const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const AdmZip = require('adm-zip');

const downloadDir = path.join(__dirname, 'hotel_images');
const zipFilePath = path.join(__dirname, 'hotel_images.zip');
const query = 'The Orchid Hotel Pune';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const hashBuffer = (buffer) => {
  return crypto.createHash('md5').update(buffer).digest('hex');
};

async function scrapeImages() {
  if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  
  for (let i = 0; i < 5; i++) {
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await sleep(2000);
  }


  const rawImageUrls = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map((img) => img.src).filter(Boolean);
  });

  await browser.close();

  
  const imageUrls = [...new Set(rawImageUrls)].filter(
  (url) => !url.includes('favicon') && url.startsWith('http')
);

  console.log(`🔍 Valid image URLs found: ${imageUrls.length}`);

  const seenHashes = new Set();
  let count = 0;

  for (const url of imageUrls) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 });
      const buffer = Buffer.from(response.data);
      const hash = hashBuffer(buffer);

      if (seenHashes.has(hash)) {
        console.log(`⚠️ Skipped duplicate image`);
        continue;
      }

      seenHashes.add(hash);

      const ext = url.includes('.png') ? 'png' : 'jpg';
      const filePath = path.join(downloadDir, `image_${count}.${ext}`);
      fs.writeFileSync(filePath, buffer);
      console.log(`✅ Saved image_${count}.${ext}`);
      count++;
    } catch (err) {
      console.log(`❌ Failed to download image from: ${url}`);
    }
  }

  const zip = new AdmZip();
  zip.addLocalFolder(downloadDir);
  zip.writeZip(zipFilePath);

  console.log(`📦 ZIP created: ${zipFilePath}`);
}

scrapeImages();
