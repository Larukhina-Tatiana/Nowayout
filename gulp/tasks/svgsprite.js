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
// 📦 Генерация stack-спрайта
export const svgStack = () => {
  return gulp
    .src(path.src.svgsprite)
    .pipe(plumber(plumberNotify("SVG Stack")))
    .pipe(debugLog())
    .pipe(svgSprite(svgStackConfig))

    .pipe(gulp.dest(path.build.svgsprite))

    .pipe(gulp.dest(path.build.svgsprite));
};

// 📦 Генерация symbol-спрайта
export const svgSymbol = () => {
  return gulp
    .src(path.src.svgsprite, { allowEmpty: true })
    .on("data", (file) => {
      console.log("Файл в потоке:", file.path);
    })
    .pipe(plumber(plumberNotify("SVG Symbol")))
    .pipe(svgSprite(svgSymbolConfig))
    .on("end", () => {
      console.log("✅ sprite.symbol.svg успешно создан");
    })
    .pipe(gulp.dest(path.build.svgsprite));
};

gulp
  .src("src/images/svgsprite/**/*.svg")
  .pipe(svgsprite(svgSymbolConfig))
  .pipe(gulp.dest("docs/images/svgsprite"));
