import gulp from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import svgSprite from "gulp-svg-sprite";
import through2 from "through2";
import * as cheerio from "cheerio";
import { path } from "../config/path.js";

// 🔧 Обработка ошибок
const plumberNotify = (title) => ({
  errorHandler: (error) => {
    notify.onError({
      title,
      message: error?.message || "Unknown error",
    })(error);
  },
});

// 📘 Лог результатов
const log = [];

// 🔍 Функция проверки одноцветности
const isMonoIcon = ($) => {
  const fills = [];

  $("path, rect, circle, polygon").each((_, el) => {
    const $el = $(el);
    const fill = $el.attr("fill");

    if (
      fill &&
      !/^url\(/.test(fill) &&
      !/^#/.test(fill) &&
      !/^rgb/.test(fill) &&
      !/^hsl/.test(fill) &&
      fill !== "none"
    ) {
      fills.push(fill.trim());
    }
  });

  const uniqueFills = [...new Set(fills)];
  return uniqueFills.length <= 1;
};
const isValidFill = (fill) =>
  fill &&
  !/^url\(/.test(fill) &&
  fill !== "none" &&
  !/^rgb/.test(fill) &&
  !/^hsl/.test(fill);

// 🎨 Обработка одноцветной иконки
const applyCurrentColor = ($) => {
  $("path, rect, circle, polygon").each((_, el) => {
    const $el = $(el);
    const fill = $el.attr("fill");

    if (isValidFill(fill)) {
      $el.removeAttr("fill");
      $el.attr("fill", "currentColor");
    }
  });
};

// 📦 Основная задача генерации символ-спрайта
export const svgSymbolSprite = () => {
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

          log.push({
            id,
            status: isMono ? "✅ currentColor" : "🎨 original colors",
          });

          if (isMono) {
            applyCurrentColor($);
            file.contents = Buffer.from($.xml());
          }
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
          transform: [], // отключаем svgo — мы сами обрабатываем DOM
        },
        svg: {
          xmlDeclaration: false,
          doctypeDeclaration: false,
        },
      })
    )
    .on("end", () => {
      console.log("🧾 Итоговая генерация спрайта:");
      log.forEach(({ id, status }) => {
        console.log(`• ${id}: ${status}`);
      });
    })
    .pipe(gulp.dest(path.build.sprite));
};
