import gulp from "gulp";
import webp from "gulp-webp";
import imagemin from "gulp-imagemin";
import avif from "imagemin-avif";
import pngquant from "imagemin-pngquant";
import debug from "gulp-debug";
import newer from "gulp-newer";
// import plumber from "gulp-plumber";
import notify from "gulp-notify";
import rename from "gulp-rename";
import path from "path";

// 🔔 Общий обработчик ошибок
const errorNotify = notify.onError({
  title: "🖼 Ошибка в изображениях",
  message: "💥 <%= error.message %>",
  sound: "Beep",
});
// const plumberImages = plumber({ errorHandler: errorNotify });

// 🥑 AVIF
export const imgAvif = () => {
  return (
    app.gulp
      .src(app.path.src.images, { encoding: false })
      // .pipe(plumberImages)
      .pipe(
        newer({
          dest: app.path.build.images,
          map: (filePath) => filePath.replace(/\.(jpe?g|png)$/i, ".avif"),
        })
      )
      .pipe(debug({ title: "AVIF input:" }))
      .pipe(imagemin([avif({ quality: 50 })]))
      .pipe(rename({ extname: ".avif" }))
      .pipe(app.gulp.dest(app.path.build.images))
      .pipe(app.plugins.browserSync.stream())
  );
};

// 🌐 WebP
export const imgWebp = () => {
  return (
    app.gulp
      .src(app.path.src.images, { encoding: false })
      .pipe(
        newer({
          dest: app.path.build.images,
          map: (filePath) => filePath.replace(/\.(jpe?g|png)$/i, ".webp"),
        })
      )
      // .pipe(plumberImages)
      .pipe(webp({ quality: 85 }))
      .pipe(app.gulp.dest(app.path.build.images))
  );
};

// 📸 Оптимизация PNG/JPG
export const imgImage = () => {
  return (
    app.gulp
      .src(app.path.src.images, { encoding: false })
      // .pipe(plumberImages)
      .pipe(newer(app.path.build.images))
      .pipe(
        imagemin(
          [
            pngquant({
              quality: [0.7, 0.9],
              speed: 1,
            }),
          ],
          {
            progressive: true,
            interlaced: true,
            optimizationLevel: 5,
          }
        )
      )
      .pipe(app.gulp.dest(app.path.build.images))
      .pipe(app.plugins.browserSync.stream())
  );
};

// 🅿️ Отдельное сжатие PNG — по желанию
export const imgPng = () => {
  return (
    app.gulp
      .src(app.path.src.images, { encoding: false })
      // .pipe(plumberImages)
      .pipe(newer(app.path.build.images))
      .pipe(imagemin([pngquant({ quality: [0.7, 0.9] })]))
      .pipe(app.gulp.dest(app.path.build.images))
      .pipe(app.plugins.browserSync.stream())
  );
};

// 🧩 Объединённый таск
// export const optimizeImages = gulp.series(
//   imgAvif,
//   imgWebp,
//   gulp.parallel(imgImage, imgPng)
// );
