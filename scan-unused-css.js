import fs from "fs";
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

const likelyUsed = [];
const definitelyUnused = [];

const usedSelectors = new Set();

// Получаем все теги, классы и id из HTML
$("*").each((_, el) => {
  usedSelectors.add(el.tagName.toLowerCase());

  const id = $(el).attr("id");
  if (id) usedSelectors.add(`#${id}`);

  const classList = ($(el).attr("class") || "").split(/\s+/);
  classList.forEach((cls) => {
    if (cls) usedSelectors.add(`.${cls}`);
  });
});

// Убираем псевдоклассы и псевдоэлементы
const cleanSelector = (selector) =>
  selector
    .replace(/::?[a-zA-Z0-9_-]+/g, "") // удаляет :hover, ::before и т.п.
    .replace(/:not\([^)]+\)/g, "") // удаляет :not(...) блоки
    .trim();

const root = postcss.parse(css, { parser: safeParser });
const unused = [];

root.walkRules((rule) => {
  const selectors = rule.selector?.split(",").map((s) => s.trim());

  if (!selectors) return;

  const cleaned = selectors.map(cleanSelector);

  const allUnused = cleaned.every((sel) => !usedSelectors.has(sel));

  if (allUnused) {
    // Если есть псевдокласс/элемент — считаем "возможно нужным"
    if (selectors.some((sel) => /::?|:not\(/.test(sel))) {
      likelyUsed.push(rule.selector);
    } else {
      definitelyUnused.push(rule.selector);
    }
  }
});

if (definitelyUnused.length || likelyUsed.length) {
  console.log(`🔍 Неиспользуемых: ${definitelyUnused.length}`);
  definitelyUnused.forEach((sel) => console.log("⛔️", sel));

  console.log(
    `\n⚠️  Вероятно используемые (динамические): ${likelyUsed.length}`
  );
  likelyUsed.forEach((sel) => console.log("⚠️", sel));
} else {
  console.log("✅ Все селекторы используются 🎉");
}
