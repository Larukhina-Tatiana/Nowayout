import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
import sassGlob from "gulp-sass-glob";

import cleanCSS from "gulp-clean-css";
import webpCss from "gulp-webpcss";
import autoPrefixer from "gulp-autoprefixer";
import groupCssMediaQueries from "gulp-group-css-media-queries";
import sourceMaps from "gulp-sourcemaps";
import through2 from "through2";

const sass = gulpSass(dartSass);

export const scss = () => {
  return (
    app.gulp
      .src(app.path.src.scss, { sourcemaps: app.isDev })
      .pipe(sourceMaps.init())
      // Плюмбер
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "SCSS",
            message: "Error <%= error.message %>",
          })
        )
      )
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: "expanded" }))

      .pipe(
        through2.obj(function (file, _, cb) {
          if (file.contents.length < 1000) {
            notify.onError({
              title: "SCSS ⚠️",
              message:
                "Скомпилированный CSS подозрительно мал — проверь импорт/переменные!",
            })(file);
          }
          cb(null, file);
        })
      )

      .on("error", function (err) {
        console.error("❌ Ошибка SCSS:", err.message);
        this.emit("end");
      })

      .pipe(app.plugins.replace(/@img\//g, "../images/"))
      .pipe(
        app.plugins.replace(
          /(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
          "$1./$4$5$7$1"
        )
      )

      // .pipe(
      //   webpCss({
      //     webpClass: ".webp",
      //     noWebpClass: ".no-webp",
      //   })
      // )
      .pipe(
        autoPrefixer({
          grid: true,
          overrideBrowserlist: ["last 5 version"],
          cascade: true,
        })
      )
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries())) //вставлять в версию docs
      .pipe(
        cleanCSS({
          level: 2,
        })
      )
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(sourceMaps.write())
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browserSync.stream())
  );
};
