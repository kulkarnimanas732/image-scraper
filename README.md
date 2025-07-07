# Image Scraper – The Orchid Hotel Pune

This script scrapes publicly available images of “The Orchid Hotel Pune” from Google Images, filters duplicates and invalid links, downloads the images locally, and packages them into a `.zip` file.

---

## Features

- Automatically searches Google Images for "The Orchid Hotel Pune"
- Scrolls to load more results
- Filters out invalid image links (e.g., favicons, broken links)
- Removes duplicate images based on content hash
- Downloads all valid images to a local folder
- Compresses the images into a `hotel_images.zip` file

---

## Tech Stack

- Node.js
- Puppeteer – for browser automation
- Axios – for downloading image data
- Adm-Zip – for ZIP file creation
- fs, path, crypto – Node.js built-in modules

---

## Output

- `hotel_images/` — contains all downloaded images
- `hotel_images.zip` — compressed ZIP file of images
- `scrape.js` — the script
- `README.md` — this file

---

## How to Run

1. Install dependencies:
   ```bash
   npm install puppeteer axios adm-zip

2. Run the script:
   ```bash
   node scrape.js
3. Output:
   ```bash
   Images saved in hotel_images/

   A final archive: hotel_images.zip



