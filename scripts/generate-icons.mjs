import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(root, "..", "public");
const sourcePath = resolve(publicDir, "scripttype-icon-512.png");
const sourceBuf = readFileSync(sourcePath);

const sizes = [
  { name: "favicon-16.png", size: 16 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-48.png", size: 48 },
  { name: "favicon-64.png", size: 64 },
  { name: "favicon-96.png", size: 96 },
  { name: "favicon-192.png", size: 192 },
  { name: "favicon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "scripttype-icon-192.png", size: 192 },
];

for (const { name, size } of sizes) {
  const out = resolve(publicDir, name);
  await sharp(sourceBuf).resize(size, size, { fit: "cover" }).png({ quality: 92 }).toFile(out);
  console.log("generated", name, size);
}

const ico16 = await sharp(sourceBuf).resize(16, 16, { fit: "cover" }).png().toBuffer();
const ico32 = await sharp(sourceBuf).resize(32, 32, { fit: "cover" }).png().toBuffer();
const ico48 = await sharp(sourceBuf).resize(48, 48, { fit: "cover" }).png().toBuffer();
const icoBuf = buildIco([ico16, ico32, ico48]);
writeFileSync(resolve(publicDir, "favicon.ico"), icoBuf);
console.log("generated favicon.ico");

// Splash screens (portrait, 320x568, 375x667, 414x736, 768x1024, 828x1170, 1125x2436)
const splashBg = "#0b1226";
const splashSizes = [
  { w: 320, h: 568 },
  { w: 375, h: 667 },
  { w: 414, h: 736 },
  { w: 768, h: 1024 },
  { w: 828, h: 1170 },
  { w: 1125, h: 2436 },
];
for (const { w, h } of splashSizes) {
  const logoSize = Math.round(Math.min(w, h) * 0.28);
  const logo = await sharp(sourceBuf).resize(logoSize, logoSize, { fit: "cover" }).png().toBuffer();
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${splashBg}"/>
  <image href="data:image/png;base64,${logo.toString("base64")}" x="${(w - logoSize) / 2}" y="${(h - logoSize) / 2}" width="${logoSize}" height="${logoSize}"/>
</svg>`;
  writeFileSync(resolve(publicDir, `splash-${w}x${h}.svg`), svg);
  console.log("generated splash", `${w}x${h}`);
}

function buildIco(buffers) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ico
  header.writeUInt16LE(buffers.length, 4); // count

  const entries = [];
  let offset = 6 + buffers.length * 16;
  const images = [];
  for (const buf of buffers) {
    const size = Math.min(buf.length, 255);
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0); // width (0 = 255)
    entry.writeUInt8(size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    images.push(buf);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...images]);
}

// OG image (1200x630) — mascot on dark brand background
const ogLogoSize = 560;
const ogLogo = await sharp(sourceBuf)
  .resize(ogLogoSize, ogLogoSize, { fit: "cover" })
  .png()
  .toBuffer();
const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b1226"/>
  <image href="data:image/png;base64,${ogLogo.toString("base64")}" x="320" y="35" width="${ogLogoSize}" height="${ogLogoSize}"/>
  <rect x="640" y="460" width="470" height="8" fill="#4f46e5"/>
</svg>`;
await sharp(Buffer.from(ogSvg)).png().toFile(resolve(publicDir, "og-image.png"));
console.log("generated og-image.png 1200x630");

// Screenshot-wide (1280x720)
const wideLogo = await sharp(sourceBuf).resize(340, 340, { fit: "cover" }).png().toBuffer();
const wideSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#0b1226"/>
  <image href="data:image/png;base64,${wideLogo.toString("base64")}" x="470" y="190" width="340" height="340"/>
  <rect x="510" y="560" width="260" height="8" fill="#4f46e5"/>
</svg>`;
await sharp(Buffer.from(wideSvg)).png().toFile(resolve(publicDir, "screenshot-wide.png"));
console.log("generated screenshot-wide.png 1280x720");

// Screenshot-narrow (390x844)
const narrowLogo = await sharp(sourceBuf).resize(180, 180, { fit: "cover" }).png().toBuffer();
const narrowSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844">
  <rect width="390" height="844" fill="#0b1226"/>
  <image href="data:image/png;base64,${narrowLogo.toString("base64")}" x="105" y="332" width="180" height="180"/>
  <rect x="145" y="530" width="100" height="8" fill="#4f46e5"/>
</svg>`;
await sharp(Buffer.from(narrowSvg)).png().toFile(resolve(publicDir, "screenshot-narrow.png"));
console.log("generated screenshot-narrow.png 390x844");