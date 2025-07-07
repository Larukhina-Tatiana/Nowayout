import versionNumber from "gulp-version-number";

export const version = () => {
  return app.gulp
    .src(app.path.src.html) // Используем любой исходный файл, так как нам нужен только выходной файл version.json
    .pipe(
      versionNumber({
        value: "%DT%",
        append: {
          key: "_v",
          cover: 0,
          to: ["css", "js"],
        },
        output: {
          file: "gulp/version.json",
        },
      })
    );
};