import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generatePngIcons() {
  const publicIconsDir = path.resolve('public/icons');
  if (!fs.existsSync(publicIconsDir)) {
    fs.mkdirSync(publicIconsDir, { recursive: true });
  }

  const svg192Path = path.join(publicIconsDir, 'icon-192.svg');
  const svg512Path = path.join(publicIconsDir, 'icon-512.svg');

  const svg192Buffer = fs.readFileSync(svg192Path);
  const svg512Buffer = fs.readFileSync(svg512Path);

  // 192x192 PNG
  await sharp(svg192Buffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicIconsDir, 'icon-192.png'));
  console.log('Created icon-192.png (192x192)');

  // 512x512 PNG
  await sharp(svg512Buffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicIconsDir, 'icon-512.png'));
  console.log('Created icon-512.png (512x512)');

  // Maskable 192x192 PNG
  await sharp(svg192Buffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicIconsDir, 'icon-maskable-192.png'));
  console.log('Created icon-maskable-192.png');

  // Maskable 512x512 PNG
  await sharp(svg512Buffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicIconsDir, 'icon-maskable-512.png'));
  console.log('Created icon-maskable-512.png');

  // Apple touch icon (180x180)
  await sharp(svg192Buffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicIconsDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Favicon (64x64)
  await sharp(svg192Buffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicIconsDir, 'favicon.png'));
  console.log('Created favicon.png');

  // Also copy icon-192.png to /public/icon-192.png and /public/icon-512.png for fallback paths
  fs.copyFileSync(path.join(publicIconsDir, 'icon-192.png'), path.resolve('public/icon-192.png'));
  fs.copyFileSync(path.join(publicIconsDir, 'icon-512.png'), path.resolve('public/icon-512.png'));
}

generatePngIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
