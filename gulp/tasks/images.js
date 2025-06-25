import webp from "gulp-webp";
import imagemin from "gulp-imagemin";
// import avif from "gulp-avif";
import avif from "imagemin-avif";
import pngquant from "imagemin-pngquant";
import debug from "gulp-debug";
import newer from "gulp-newer";
import plumber from "gulp-plumber";
import rename from "gulp-rename";

export const imgPng = () => {
  return app.gulp
    .src("src/images/**/*.{png,jpg,jpeg}", { encoding: false })
    .pipe(newer(app.path.build.images))
    .pipe(imagemin([pngquant({ quality: [0.7, 0.9] })]))
    .pipe(app.gulp.dest(app.path.build.images));
};

export const imgImage = () => {
  return app.gulp
    .src(app.path.src.images, { encoding: false })
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(
      imagemin(
        [
          pngquant({
            quality: [0.7, 0.9], // уровень сжатия PNG
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
    .pipe(app.plugins.browserSync.stream());
};

export const imgWebp = () => {
  return app.gulp
    .src("src/images/**/*.{png,jpg,jpeg}", { encoding: false })
    .pipe(newer({ dest: app.path.build.images, ext: ".webp" }))
    .pipe(webp({ quality: 85 }))
    .pipe(app.gulp.dest(app.path.build.images));
};

export const imgAvif = () => {
  return app.gulp
    .src("src/images/**/*.{png,jpg,jpeg}", { encoding: false })
    .pipe(
      app.plugins.newer({
        dest: app.path.build.images,
        map: (path) => path.replace(/\.(jpe?g|png)$/i, ".avif"),
      })
    )
    .pipe(debug({ title: "AVIF input:" }))
    .pipe(imagemin([avif({ quality: 50 })]))
    .pipe(rename({ extname: ".avif" }))
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browserSync.stream());
};
