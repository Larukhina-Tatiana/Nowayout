import fs from "fs";

const cssPath = "./docs/css/style.min.css";
if (!fs.existsSync(cssPath)) {
  console.error("❌ Файл style.min.css не найден");
  process.exit(1);
}

const css = fs.readFileSync(cssPath, "utf-8");
const emptySelectors = [];

const regex = /([^\{\}]+)\s*\{\s*\}/g;
let match;

while ((match = regex.exec(css)) !== null) {
  emptySelectors.push(match[1].trim());
}

if (emptySelectors.length) {
  console.log(`🔍 Найдено пустых селекторов: ${emptySelectors.length}`);
  emptySelectors.forEach((selector) => {
    console.log("⛔️", selector);
  });
} else {
  console.log("✅ Пустых селекторов не найдено — CSS чист 🎉");
}
