import webp from "gulp-webp";
import imagemin from "gulp-imagemin";
import avif from "gulp-avif";
import pngquant from "imagemin-pngquant";
import debug from "gulp-debug";
import newer from "gulp-newer";
import plumber from "gulp-plumber";

export const imgAvif = () => {
  return app.gulp
    .src(
      [
        app.path.src.avif,
        app.path.src.images + "/**/*.png",
        app.path.src.images + "/**/*.jpg",
        app.path.src.images + "/**/*.jpeg",
      ],
      { encoding: false }
    )
    .pipe(
      app.plugins.newer({
        dest: app.path.build.images,
        map: function (relativePath) {
          return relativePath.replace(/\.(png|jpg|jpeg)$/i, ".avif");
        },
      })
    )

    .pipe(avif({ quality: 50 }))
    .on("data", (file) => {
      console.log("📦 AVIF создан:", file.relative);
    })
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browserSync.stream());
};

export const imgWebp = () => {
  return (
    app.gulp
      .src(app.path.src.images, { encoding: false })
      .pipe(app.plugins.newer(app.path.build.images))
      .pipe(webp({ quality: 85 }))
      // .pipe(avif({ quality: 50 }))
      .on("data", (file) => {
        console.log("📦 Webp создан:", file.relative);
      })
      .pipe(app.gulp.dest(app.path.build.images))
      .pipe(app.plugins.browserSync.stream())
  );
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
