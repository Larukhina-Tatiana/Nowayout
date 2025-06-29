import fs from "fs";
import path from "path";
import postcss from "postcss";
import safeParser from "postcss-safe-parser";
import * as cheerio from "cheerio";

const cssPath = "./docs/css/style.min.css";
const htmlPath = "./docs/index.html";

if (!fs.existsSync(cssPath) || !fs.existsSync(htmlPath)) {
  console.error("❌ Не найден style.min.css или index.html");
  process.exit(1);
}

const css = fs.readFileSync(cssPath, "utf-8");
const html = fs.readFileSync(htmlPath, "utf-8");
const $ = cheerio.load(html);

const usedSelectors = new Set();

// Собираем все классы, теги и id из HTML
$("*").each((_, el) => {
  usedSelectors.add(el.tagName.toLowerCase());

  const id = $(el).attr("id");
  if (id) usedSelectors.add(`#${id}`);

  const classList = ($(el).attr("class") || "").split(/\s+/);
  classList.forEach((cls) => {
    if (cls) usedSelectors.add(`.${cls}`);
  });
});

const root = postcss.parse(css, { parser: safeParser });
const unused = [];

root.walkRules((rule) => {
  const selectors = rule.selector.split(",").map((s) => s.trim());

  const allUnused = selectors.every((sel) => {
    // Упрощённая проверка: только одиночные селекторы
    return !usedSelectors.has(sel);
  });

  if (allUnused) {
    unused.push(rule.selector);
  }
});

if (unused.length) {
  console.log(`🔍 Найдено неиспользуемых селекторов: ${unused.length}`);
  unused.forEach((sel) => console.log("⛔️", sel));
} else {
  console.log("✅ Все селекторы используются 🎉");
}
