// Основной модуль
import gulp from "gulp";
// Импорт плагинов
import { plugins } from "./gulp/config/plugins.js";

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
import { copysprite } from "./gulp/tasks/copysprite.js";
import { copyicons } from "./gulp/tasks/copyicons.js";
import { copyfonts } from "./gulp/tasks/copyfonts.js";
import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { copyfavicon } from "./gulp/tasks/copyFavicon.js";
import { imgAvif, imgWebp, imgImage, imgPng } from "./gulp/tasks/images.js";
// import { svgStack, svgSymbol } from "./gulp/tasks/svg.js";
// import { OtfToTtf, ttfToWoff, fontStyle } from "./gulp/tasks/fonts.js";

function watcher() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
  gulp.watch(path.watch.icons, copyicons);
  // gulp.watch(path.watch.sprite, gulp.series("svgStack", "svgSymbol"));
}

// Последовательная обработка шрифтов
const images = gulp.series(imgAvif, imgWebp, imgImage, imgPng);
// const sprite = gulp.series(svgStack, svgSymbol);
// Основные задачи

const mainTasks = gulp.series(
  gulp.parallel(
    copy,
    copyfavicon,
    copysprite,
    copyicons,
    copyfonts,
    html,
    scss,
    js,
    images
  )
);

// Построение сценариев
// const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));

const dev = gulp.series(mainTasks, gulp.parallel(watcher, server));

const build = gulp.series(reset, mainTasks);

export { cleanEmpty }; //gulp cleanEmpty
export { scanAndClean }; //gulp scanAndClean
export { dev };
export { build };

gulp.task("default", dev);

// node scan-unused-css.js
