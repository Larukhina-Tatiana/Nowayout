// Основной модуль
import gulp from "gulp";
// Импорт плагинов
import { plugins } from "./gulp/config/plugins.js";
import { generateSprite } from "./gulp/tasks/generateSprite.js";

// Импорт путей
import { path } from "./gulp/config/path.js";
import { cleanEmpty } from "./gulp/tasks/cleanEmpty.js";
import { scanAndClean } from "./gulp/tasks/scanAndClean.js";

global.app = {
  isBuild: process.argv.includes("--build"),
  isDev: !process.argv.includes("--build"),
  path: path,
  gulp: gulp,
  plugins: plugins,
};

// Импорт задач
// import { svgStack, svgSymbol } from "./gulp/tasks/svgsprite.js";
import { svgSymbolSprite } from "./gulp/tasks/svgSpriteSymbol.js";
import { copysprite } from "./gulp/tasks/copysprite.js";
import { copyicons } from "./gulp/tasks/copyicons.js";
import { copyfonts } from "./gulp/tasks/copyfonts.js";
import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { critical } from "./gulp/tasks/critical.js";
import { js } from "./gulp/tasks/js.js";
import { copyfavicon } from "./gulp/tasks/copyFavicon.js";
import { imgAvif, imgWebp, imgImage, imgPng } from "./gulp/tasks/images.js";
import { version } from "./gulp/tasks/version.js";

import { cdnAssets, updateLinks } from "./gulp/tasks/cdn.js";

import { uploadAssetsToCDN } from "./gulp/tasks/cdnUpload.js";
// import { svgStack, svgSymbol } from "./gulp/tasks/svgsprite.js";
// import { OtfToTtf, ttfToWoff, fontStyle } from "./gulp/tasks/fonts.js";

function watcher() {
  gulp.watch(path.src.icons, generateSprite);
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
  // gulp.watch(path.watch.icons, gulp.series(copyicons, svgStack, svgSymbol));
  // gulp.watch(path.watch.svgsprite, gulp.series(svgStack, svgSymbol));
  gulp.watch(path.watch.sprite, svgSymbolSprite);
  gulp.watch(path.src.svgsprite, svgSymbolSprite);
}

// Последовательная обработка шрифтов
const images = gulp.series(imgAvif, imgWebp, imgImage, imgPng);
// const sprite = gulp.series(svgStack, svgSymbol);
// Основные задачи

const mainTasks = gulp.series(
  gulp.parallel(
    // svgStack,
    // svgSymbol,
    copy,
    copyfavicon,
    copysprite,
    copyicons,
    copyfonts,
    html,
    images,
    svgSymbolSprite
  ),
  critical, // Запускаем critical последовательно
  gulp.parallel(scss, js)
);

// Построение сценариев
// const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));

const dev = gulp.series(mainTasks, gulp.parallel(watcher, server));

const build = gulp.series(reset, mainTasks, version);
export const cdn = gulp.series(cdnAssets, updateLinks);
export const cdnPush = uploadAssetsToCDN;

export { generateSprite }; //gulp generateSprite
export { cleanEmpty }; //gulp cleanEmpty
export { scanAndClean }; //gulp scanAndClean
export { critical }; //gulp critical
export { dev };
export { build, reset };
export { svgSymbolSprite };
// export { svgStack, svgSymbol };

gulp.task("default", dev);

// node scan-unused-css.js
