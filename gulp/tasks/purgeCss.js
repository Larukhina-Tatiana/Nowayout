import through2 from "through2";
import fs from "fs";
import path from "path";
import size from "gulp-size";
import purgecss from "gulp-purgecss";

const removedSelectors = [];

export const purgeCss = () => {
  if (!fs.existsSync(`${app.path.build.css}style.min.css`)) {
    throw new Error(
      "Файл style.min.css не найден — возможно, SCSS не собрался."
    );
  }
  const cssFile = `${app.path.build.css}style.min.css`;
  const stats = fs.statSync(cssFile);
  if (stats.size < 50) {
    throw new Error(
      "style.min.css слишком мал — возможно, SCSS содержит ошибку или пустой."
    );
  }

  const sizeBefore = size({ title: "📦 До purge", showFiles: true });
  const sizeAfter = size({ title: "✅ После purge", showFiles: true });

  return app.gulp
    .src(`${app.path.build.css}style.min.css`)
    .pipe(sizeBefore)
    .pipe(
      purgecss({
        content: [
          `${app.path.build.html}**/*.html`,
          `${app.path.build.js}**/*.js`,
        ],
        safelist: {
          standard: [
            "container",
            "btn",
            "btn-red",
            /^gift__/,
            /^pulse/,
            /^fadeInUp/,
            /^title-/,
          ],
          deep: [/^shake/, /^reveal-/],
        },
        rejected: true,
      })
    )
    .pipe(
      through2.obj(function (file, _, cb) {
        if (file.purgecss?.rejected) {
          removedSelectors.push(...file.purgecss.rejected);
        }
        cb(null, file);
      })
    )
    .pipe(sizeAfter)
    .pipe(app.gulp.dest(app.path.build.css))
    .on("end", () => {
      const unique = [...new Set(removedSelectors)].sort();
      const html = `
        <html>
          <head><meta charset="UTF-8"><title>Удалённые селекторы</title></head>
          <body>
            <h1>Удалённые селекторы из style.min.css</h1>
            ${
              unique.length
                ? `<ul>\n${unique
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
};
