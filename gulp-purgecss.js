import purgecss from "gulp-purgecss";

export const cleanCSS = () =>
  app.gulp
    .src("./src/css/**/*.css")
    .pipe(
      purgecss({
        content: ["./src/**/*.html", "./src/js/**/*.js"],
      })
    )
    .pipe(app.gulp.dest("./build/css"));
