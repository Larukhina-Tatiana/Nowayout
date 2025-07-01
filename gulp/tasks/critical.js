import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
import sassGlob from "gulp-sass-glob";
import cleanCSS from "gulp-clean-css";
import autoPrefixer from "gulp-autoprefixer";

const sass = gulpSass(dartSass);

export const critical = () => {
  return app.gulp
    .src("src/scss/utils/_critical.scss")
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "Critical CSS",
          message: "Error <%= error.message %>",
        })
      )
    )
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(app.plugins.replace(/@img\//g, "../images/"))
    .pipe(
      autoPrefixer({
        grid: true,
        overrideBrowserlist: ["last 5 version"],
        cascade: true,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(
      rename({
        basename: "critical",
        suffix: ".min",
      })
    )
    .pipe(app.gulp.dest(app.path.build.css));
};