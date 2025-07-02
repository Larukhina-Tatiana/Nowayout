import gulp from "gulp";
 import { plugins } from "../config/plugins.js";
import postCss from "gulp-postcss";
import scss from "postcss-scss";
import postcssPresetEnv from "postcss-preset-env";
import cleanCSS from "gulp-clean-css";

export const critical = () => {
  return gulp
    .src("src/scss/utils/critical.scss")

    .pipe(postCss([postcssPresetEnv()], { syntax: scss }))

     .pipe(plugins.rename({ basename: "critical", extname: ".min.css" }))



     .pipe(cleanCSS({ level: 2, format: 'beautify', keepSpecialComments: 0 }))
     .pipe(plugins.size({ showFiles: true, showTotal: false }))
     .pipe(plugins.debug({title: "critical.js dest"}))
      .pipe(app.gulp.dest(app.path.build.css));
};
