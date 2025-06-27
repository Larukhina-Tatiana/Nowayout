import gulp from "gulp";
import postcss from "gulp-postcss";
import discardEmpty from "postcss-discard-empty";
import rename from "gulp-rename";
import { path as appPath } from "../config/path.js";

export const cleanEmpty = () => {
  return gulp
    .src(`${appPath.build.css}style.min.css`)
    .pipe(postcss([discardEmpty()]))
    .pipe(rename("style.min.css")) // перезаписать файл
    .pipe(gulp.dest(appPath.build.css));
};
