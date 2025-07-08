import fs from "fs";
import purgecss from "purgecss";
import glob from "glob";

// Пути к файлам для анализа
const contentPaths = ["build/**/*.html", "src/js/**/*.js"];
const cssPath = "./docs/css/style.min.css";

// Собираем содержимое всех HTML + JS
const content = contentPaths
  .map((pattern) => glob.sync(pattern))
  .flat()
  .map((file) => ({
    raw: fs.readFileSync(file, "utf8"),
    extension: file.split(".").pop(),
  }));

// Читаем CSS
const css = fs.readFileSync(cssPath, "utf8");

// Запускаем PurgeCSS (только анализ)
const purge = await purgecss.purgeCSS({
  content,
  css: [{ raw: css }],
  rejected: true,
  safelist: {
    standard: [
      /^rooms/,
      /^pulse/,
      /^scrollReveal/,
      /^animate-on-scroll/,
      "active",
      "open",
    ],
  },
});

// Получаем список неиспользуемых селекторов
const unused = purge[0].rejected;

console.log("🔍 Неиспользуемые селекторы:");
unused.forEach((sel) => console.log("  •", sel));

// Сохраняем в файл отчёта
fs.writeFileSync(
  "unused-css-report.json",
  JSON.stringify({ rejected: unused }, null, 2)
);

console.log(`📄 Отчёт сохранён в unused-css-report.json`);
