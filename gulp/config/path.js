// Получаем имя папки проекта
import { watch } from "fs";
import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());
const buildFolder = `./docs`;
const srcFolder = `./src`;

export const path = {
  build: {
    root: buildFolder,
    html: `${buildFolder}/`,
    css: `${buildFolder}/css/`,
    images: `${buildFolder}/images/`,
    fonts: `${buildFolder}/fonts/`,
    spriteHtmlPath: `${srcFolder}/html/sprite`,
    svgsprite: `${buildFolder}/images/svgsprite/`,
    sprite: `${buildFolder}/images/icons-sprite/`,
    icons: `${buildFolder}/images/icons/`,
    files: `${buildFolder}/files/`,
    copyfavicon: `${buildFolder}/images/favicon/`,
    // copy: `${buildFolder}/images/favicon/`,
    js: `${buildFolder}/js/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    scss: `${srcFolder}/scss/style.scss`,
    images: [
      `${srcFolder}/images/**/*.{jpg,jpeg,png,gif}`,
      `!${srcFolder}/images/favicon/**/*`,
    ],
    avif: [
      `${srcFolder}/images/**/*.{jpg,jpeg,png,gif}`,
      `!${srcFolder}/images/favicon/**/*`,
    ],
    svgsprite: `${srcFolder}/images/svgsprite/**/*.svg`,
    sprite: `${srcFolder}/images/icons-sprite/**/*`,
    icons: `${srcFolder}/images/icons/**/*`,
    copyfavicon: `${srcFolder}/images/favicon/**/*.*`,
    js: `${srcFolder}/js/main.js`,
    fonts: `${srcFolder}/fonts/*.*`,
    files: `${srcFolder}/files/**/*.*`,
    // copy: `${srcFolder}/images/favicon/**/*.*`,
  },
  watch: {
    html: `${srcFolder}/**/*.*`,
    scss: `${srcFolder}/scss/**/*.scss`,
    images: `${srcFolder}/images/**/*.*`,
    js: `${srcFolder}/js/**/*.js`,
    files: `${srcFolder}/files/**/*.*`,
    icons: `${srcFolder}/images/icons/**/*`,
    sprite: `${srcFolder}/images/icons-sprite/`,
    svgsprite: `${srcFolder}/images/svgsprite/**/*.svg`,
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  rootFolder: rootFolder,
  ftp: ``,
};
