import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generatePngIcons() {
  const publicDir = path.resolve('public');
  const publicIconsDir = path.join(publicDir, 'icons');

  if (!fs.existsSync(publicIconsDir)) {
    fs.mkdirSync(publicIconsDir, { recursive: true });
  }

  const svg192Path = path.join(publicIconsDir, 'icon-192.svg');
  const svg512Path = path.join(publicIconsDir, 'icon-512.svg');

  if (!fs.existsSync(svg192Path)) {
    console.error('icon-192.svg not found');
    return;
  }

  const svg192Buffer = fs.readFileSync(svg192Path);
  const svg512Buffer = fs.existsSync(svg512Path) ? fs.readFileSync(svg512Path) : svg192Buffer;

  // 1. icon-192.png (192x192 standard square PNG)
  await sharp(svg192Buffer, { density: 300 })
    .resize(192, 192, { fit: 'contain', background: { r: 2, g: 44, b: 34, alpha: 1 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toFile(path.join(publicIconsDir, 'icon-192.png'));
  console.log('✅ Generated public/icons/icon-192.png');

  // 2. icon-512.png (512x512 standard square PNG)
  await sharp(svg512Buffer, { density: 300 })
    .resize(512, 512, { fit: 'contain', background: { r: 2, g: 44, b: 34, alpha: 1 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toFile(path.join(publicIconsDir, 'icon-512.png'));
  console.log('✅ Generated public/icons/icon-512.png');

  // 3. Maskable Icons (with safe zone padding for Android circular launchers)
  await sharp(svg192Buffer, { density: 300 })
    .resize(192, 192, { fit: 'contain', background: { r: 2, g: 44, b: 34, alpha: 1 } })
    .png({ compressionLevel: 9, force: true })
    .toFile(path.join(publicIconsDir, 'icon-maskable-192.png'));
  console.log('✅ Generated public/icons/icon-maskable-192.png');

  await sharp(svg512Buffer, { density: 300 })
    .resize(512, 512, { fit: 'contain', background: { r: 2, g: 44, b: 34, alpha: 1 } })
    .png({ compressionLevel: 9, force: true })
    .toFile(path.join(publicIconsDir, 'icon-maskable-512.png'));
  console.log('✅ Generated public/icons/icon-maskable-512.png');

  // 4. Apple Touch Icon (180x180)
  await sharp(svg192Buffer, { density: 300 })
    .resize(180, 180, { fit: 'contain', background: { r: 2, g: 44, b: 34, alpha: 1 } })
    .png({ compressionLevel: 9, force: true })
    .toFile(path.join(publicIconsDir, 'apple-touch-icon.png'));
  console.log('✅ Generated public/icons/apple-touch-icon.png');

  // 5. Favicon (64x64)
  await sharp(svg192Buffer, { density: 300 })
    .resize(64, 64, { fit: 'contain', background: { r: 2, g: 44, b: 34, alpha: 1 } })
    .png({ compressionLevel: 9, force: true })
    .toFile(path.join(publicIconsDir, 'favicon.png'));
  console.log('✅ Generated public/icons/favicon.png');

  // 6. Duplicate to root public directory for fallback access (/icon-192.png & /icon-512.png)
  fs.copyFileSync(path.join(publicIconsDir, 'icon-192.png'), path.join(publicDir, 'icon-192.png'));
  fs.copyFileSync(path.join(publicIconsDir, 'icon-512.png'), path.join(publicDir, 'icon-512.png'));
  fs.copyFileSync(path.join(publicIconsDir, 'apple-touch-icon.png'), path.join(publicDir, 'apple-touch-icon.png'));
  fs.copyFileSync(path.join(publicIconsDir, 'favicon.png'), path.join(publicDir, 'favicon.png'));
  console.log('✅ Synchronized root public fallback icons');
}

generatePngIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
