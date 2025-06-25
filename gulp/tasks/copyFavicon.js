export const copyfavicon = () => {
  return app.gulp
    .src(app.path.src.copyfavicon, { encoding: false })
    .pipe(app.gulp.dest(app.path.build.copyfavicon));
};
