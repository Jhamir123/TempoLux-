const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:5173');
  
  const fs = require('fs');

try {
  const glb = fs.readFileSync('public/rolex_datejust.glb');
  const chunk0Length = glb.readUInt32LE(12);
  const jsonBuffer = glb.slice(20, 20 + chunk0Length);
  const jsonStr = jsonBuffer.toString('utf8');
  const gltf = JSON.parse(jsonStr);
  
  console.log('--- MATERIALS ---');
  if (gltf.materials) {
    gltf.materials.forEach((mat, i) => {
      console.log(`[${i}] ${mat.name}`);
    });
  }
} catch (e) {
  console.error(e);
}

  // Wait a bit for React to render
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
