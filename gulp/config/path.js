// Получаем имя папки проекта
import { watch } from "fs";
import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());
const buildFolder = `./docs`;
const srcFolder = `./src`;

export const path = {
  build: {
    html: `${buildFolder}/`,
    css: `${buildFolder}/css/`,
    images: `${buildFolder}/images/`,
    fonts: `${buildFolder}/fonts/`,
    svgsprite: `${buildFolder}/images/svgsprite/`,
    icons: `${buildFolder}/images/icons/`,
    files: `${buildFolder}/files/`,
    copy: `${buildFolder}/images/favicon/`,
    js: `${buildFolder}/js/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    scss: `${srcFolder}/scss/style.scss`,
    images: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif}`,
    avif: `${srcFolder}/images/**/*.{jpg,jpeg,gif,png}`,
    svgsprite: `${srcFolder}/svgsprite/**/*`,
    icons: `${srcFolder}/images/icons/**/*`,
    js: `${srcFolder}/js/main.js`,
    fonts: `${srcFolder}/fonts/*.*`,
    files: `${srcFolder}/files/**/*.*`,
    copy: `${srcFolder}/images/favicon/**/*.*`,
  },
  watch: {
    html: `${srcFolder}/**/*.*`,
    scss: `${srcFolder}/scss/**/*.scss`,
    images: `${srcFolder}/images/**/*.*`,
    js: `${srcFolder}/js/**/*.js`,
    files: `${srcFolder}/files/**/*.*`,
    icons: `${srcFolder}/images/icons/**/*`,
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  rootFolder: rootFolder,
  ftp: ``,
};
