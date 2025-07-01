import replace from "gulp-replace";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import browserSync from "browser-sync";
import newer from "gulp-newer";

import ifPlugin from "gulp-if";
 import debug from "gulp-debug";
 import size from "gulp-size";
 import rename from "gulp-rename";

export const plugins = {
  replace: replace,
  plumber: plumber,
  notify: notify,
  browserSync: browserSync,
  newer: newer,
  if: ifPlugin,
  debug: debug,
  size: size,
  rename: rename,
};
