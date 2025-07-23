import gulp from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import svgSprite from "gulp-svg-sprite";
import through2 from "through2";
import * as cheerio from "cheerio";
import { path } from "../config/path.js";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { optimize } = require("svgo");

// 🔧 Обработка ошибок
const plumberNotify = (title) => ({
  errorHandler: (error) => {
    notify.onError({
      title,
      message: error?.message || "Unknown error",
    })(error);
  },
});

// 🔍 Проверка одноцветности
const isMonoIcon = ($) => {
  const fills = [];

  $("path, rect, circle, polygon").each((_, el) => {
    const fill = $(el).attr("fill");
    if (fill && fill !== "none" && !/^url\(/.test(fill)) {
      fills.push(fill.trim());
    }
  });

  const uniqueFills = [...new Set(fills)];
  return uniqueFills.length <= 1; // Если уникальных цветов 1 или меньше, то монохромная
};

// 🎨 Применение currentColor
const applyCurrentColor = ($) => {
  $("path, rect, circle, polygon").each((_, el) => {
    const fill = $(el).attr("fill");
    if (fill && fill !== "none") {
      $(el).attr("fill", "currentColor");
    }
  });
};

// ⚗️ Очистка SVG через SVGO
const cleanSvg = (svgString) => {
  const result = optimize(svgString, {
    multipass: true,
    plugins: [
      "removeComments",
      "removeMetadata",
      "removeTitle",
      "cleanupAttrs",
      "mergePaths",
      "convertShapeToPath",
      "removeEmptyContainers",
      { name: "cleanupIDs", params: { remove: false } },
    ],
  });
  return result.data;
};

// 🧩 Основная задача
export const svgSymbolSprite = () => {
  const log = [];

  return gulp
    .src(path.src.sprite, { allowEmpty: true })
    .pipe(plumber(plumberNotify("SVG Symbol Sprite")))
    .pipe(
      through2.obj(function (file, _, cb) {
        if (file.isBuffer()) {
          const content = file.contents.toString();
          const $ = cheerio.load(content, { xmlMode: true });

          const id = file.relative.replace(".svg", "");
          const isMono = isMonoIcon($);

          if (!isMono) {
            const fills = [];
            $("path, rect, circle, polygon").each((_, el) => {
              const fill = $(el).attr("fill");
              if (fill && fill !== "none") {
                fills.push(fill.trim());
              }
            });
            console.log(`🎨 ${id} fills detected:`, [...new Set(fills)]);
          } else {
            console.log(`✅ ${id} is monochrome`);
          }

          log.push({
            id,
            status: isMono ? "✅ currentColor" : "🎨 original colors",
          });

          if (isMono) {
            applyCurrentColor($);
          }

          const cleaned = cleanSvg($.xml());
          file.contents = Buffer.from(cleaned);
        } else {
          console.warn(`⚠️ File ${file.path} is not a buffer. Skipping.`);
        }
        cb(null, file);
      })
    )
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: "sprite.symbol.svg",
            dest: ".",
            example: false,
          },
        },
        shape: {
          transform: [], // отключаем встроенные SVGO — уже применено вручную
        },
        svg: {
          xmlDeclaration: false,
          doctypeDeclaration: false,
          js2svg: {
            indent: 0,
            pretty: false,
          },
        },
      })
    )
    .on("end", () => {
      console.log("🧾 Итоговая генерация спрайта:");
      log.forEach(({ id, status }) => {
        console.log(`• ${id}: ${status}`);
      });
    })
    .pipe(gulp.dest(path.build.sprite))
    .on("end", () => {
      const spritePath = `${path.build.sprite}/sprite.symbol.svg`;
      const spriteHtmlPath = `${path.srcFolder}/html/sprite/sprite.html`;

      if (fs.existsSync(spritePath)) {
        const spriteContent = fs.readFileSync(spritePath, "utf8");
        const $ = cheerio.load(spriteContent, { xmlMode: true });
        const symbols = $("symbol").parent().html();

        if (fs.existsSync(spriteHtmlPath)) {
          try {
            const htmlContent = fs.readFileSync(spriteHtmlPath, "utf8");
            const updatedContent = htmlContent.replace(
              /<!-- содержимое sprite.symbol.svg -->[\s\S]*<\/svg>/,
              `<!-- содержимое sprite.symbol.svg -->\n${symbols}\n</svg>`
            );
            fs.writeFileSync(spriteHtmlPath, updatedContent);
            console.log("✅ sprite.html успешно обновлен");
          } catch (error) {
            console.error("❌ Ошибка при обновлении sprite.html:", error);
          }
        } else {
          console.warn("⚠️ sprite.html не найден. Пропуск обновления.");
        }
      } else {
        console.warn(
          "⚠️ sprite.symbol.svg не найден. Пропуск обновления sprite.html."
        );
      }
    });
};
