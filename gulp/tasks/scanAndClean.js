import gulp from "gulp";
import fs from "fs";
import inquirer from "inquirer";
import postcss from "gulp-postcss";
import discardEmpty from "postcss-discard-empty";
import rename from "gulp-rename";
import { path as appPath } from "../config/path.js";

export const scanAndClean = async () => {
  const cssPath = `${appPath.build.css}style.min.css`;
  if (!fs.existsSync(cssPath)) {
    console.error("❌ style.min.css не найден");
    return;
  }

  const css = fs.readFileSync(cssPath, "utf-8");
  const emptySelectors = [];
  const regex = /([^\{\}]+)\s*\{\s*\}/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    emptySelectors.push(match[1].trim());
  }

  if (emptySelectors.length === 0) {
    console.log("✅ Пустых селекторов не найдено — ничего не нужно удалять");
    return;
  }

  console.log(`🔍 Найдено пустых селекторов: ${emptySelectors.length}`);
  emptySelectors.forEach((sel) => console.log("⛔️", sel));

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Удалить все пустые селекторы из style.min.css?",
      default: false,
    },
  ]);

  if (confirm) {
    return gulp
      .src(cssPath)
      .pipe(postcss([discardEmpty()]))
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest(appPath.build.css))
      .on("end", () => {
        const cssContent = fs.readFileSync(cssFile, "utf8");
        const totalSelectors = (cssContent.match(/[^{]+(?=\s*\{)/g) || [])
          .length;
        const unique = [...new Set(removedSelectors)].sort();

        const html = `
  <html>
    <head><meta charset="UTF-8"><title>Удалённые селекторы</title></head>
    <body style="font-family:sans-serif;padding:2rem;">
      <p>Отчёт purgeCss</p>
      <p><strong>Дата:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Всего CSS-селекторов:</strong> ${totalSelectors}</p>
      <p><strong>Удалено селекторов:</strong> ${unique.length}</p>
      <hr/>
      ${
        unique.length
          ? `<h2>Удалённые селекторы:</h2>\n<ul>\n${unique
              .map((sel) => `<li><code>${sel}</code></li>`)
              .join("\n")}\n</ul>`
          : `<p style="color:green;">Ни один селектор не был удалён — отлично 👌</p>`
      }
    </body>
  </html>
`;

        fs.writeFileSync(
          path.resolve(app.path.build.root, "purge-report.html"),
          html
        );
        console.log("📄 HTML-отчёт сохранён: docs/purge-report.html");
      });
  } else {
    console.log("🚫 Очистка отменена");
  }
};
