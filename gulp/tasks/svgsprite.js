import gulp from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import svgSprite from "gulp-svg-sprite";
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

// 🧱 Конфигурация для stack-спрайта
const svgStackConfig = {
  mode: {
    stack: {
      sprite: "sprite.stack.svg",
      dest: ".",
      example: true, // HTML-превью (можно отключить)
    },
  },
  shape: {
    transform: [
      {
        svgo: {
          js2svg: { indent: 2, pretty: true },
        },
      },
    ],
  },
};

// 🧱 Конфигурация для symbol-спрайта
const svgSymbolConfig = {
  mode: {
    symbol: {
      sprite: "../sprite.symbol.svg",
    },
  },
  shape: {
    transform: [
      {
        svgo: {
          js2svg: { indent: 4, pretty: true },
          plugins: [
            {
              name: "removeAttrs",
              params: {
                attrs: "(fill|stroke)",
              },
            },
          ],
        },
      },
    ],
  },
};

import through2 from "through2";

const debugLog = () =>
  through2.obj(function (file, _, cb) {
    console.log("Обрабатывается иконка:", file.relative);
    cb(null, file);
  });
// 📦 Общая функция для генерации спрайтов
const createSprite = (config, type) => {
  return gulp
    .src(path.src.svgsprite, { allowEmpty: true })
    .pipe(plumber(plumberNotify(`SVG ${type}`)))
    .pipe(type === "Stack" ? debugLog() : through2.obj())
    .pipe(svgSprite(config))
    .on("data", (file) => {
      if (type === "Symbol") console.log("Файл в потоке:", file.path);
    })
    .on("end", () => {
      if (type === "Symbol") console.log("✅ sprite.symbol.svg успешно создан");
    })
    .pipe(gulp.dest(path.build.svgsprite));
};

// 📦 Генерация stack-спрайта
export const svgStack = () => createSprite(svgStackConfig, "Stack");

// 📦 Генерация symbol-спрайта
export const svgSymbol = () => createSprite(svgSymbolConfig, "Symbol");
