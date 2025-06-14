const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "../src/assets/images");
const formats = [".jpg", ".jpeg", ".png"];

function convertAll(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      convertAll(filePath);
    } else if (formats.includes(path.extname(file).toLowerCase())) {
      const base = filePath.replace(/\.[^.]+$/, "");
      // WebP
      if (!fs.existsSync(base + ".webp")) {
        sharp(filePath)
          .toFormat("webp")
          .toFile(base + ".webp", (err) => {
            if (err) console.error("WebP error:", filePath, err);
          });
      }
      // AVIF
      if (!fs.existsSync(base + ".avif")) {
        sharp(filePath)
          .toFormat("avif")
          .toFile(base + ".avif", (err) => {
            if (err) console.error("AVIF error:", filePath, err);
          });
      }
    }
  });
}

convertAll(inputDir);
