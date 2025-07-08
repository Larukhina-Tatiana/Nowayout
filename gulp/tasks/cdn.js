import gulp from "gulp";
import cloudinary from "cloudinary";
import through2 from "through2";
import replace from "gulp-replace";
import rev from "gulp-rev";

// 🔧 Настройки Cloudinary
cloudinary.v2.config({
  cloud_name: "nowayout",
  api_key: "your_api_key",
  api_secret: "your_secret",
});

// 🧠 Загрузка файла на CDN
function uploadToCDN() {
  return through2.obj(function (file, _, cb) {
    if (file.isBuffer()) {
      cloudinary.v2.uploader
        .upload_stream(
          { resource_type: "image", folder: "nowayout" },
          (error, result) => {
            if (!error && result?.secure_url) {
              file.cdnUrl = result.secure_url;
            }
            cb(null, file);
          }
        )
        .end(file.contents);
    } else {
      cb(null, file);
    }
  });
}

// 🔧 Основной таск
export function cdnAssets() {
  return gulp
    .src("src/assets/**/*.{svg,gif,webp}")
    .pipe(uploadToCDN())
    .pipe(rev())
    .pipe(gulp.dest("dist/assets"))
    .pipe(rev.manifest("cdn.json", { merge: true }))
    .pipe(gulp.dest("."));
}

// 🔧 Импорт дополнительно:
import fs from "fs";
import path from "path";

// 🧠 Обновление ссылок в HTML
export function updateLinks() {
  const manifest = JSON.parse(fs.readFileSync("cdn.json", "utf8"));

  return gulp
    .src("dist/**/*.html")
    .pipe(
      replace(/src="([^"]+\.(svg|webp|gif))"/g, (match, p1) => {
        const filename = path.basename(p1);
        return manifest[filename] ? `src="${manifest[filename]}"` : match;
      })
    )
    .pipe(gulp.dest("dist"));
}
