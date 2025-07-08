import gulp from "gulp";
import cloudinary from "cloudinary";
import through2 from "through2";
import nodePath from "path";
// import path from "path";
import { path } from "../config/path.js";

import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

function uploadToCloudinary() {
  return through2.obj(function (file, _, cb) {
    const ext = nodePath.extname(file.path);
    const baseName = nodePath.basename(file.path, ext);
    const publicId = `cdn/${baseName}`; // читаемое имя

    cloudinary.v2.uploader
      .upload_stream(
        {
          public_id: publicId,
          resource_type: "image",
          overwrite: true,
        },
        (err, result) => {
          if (err) {
            console.warn("❌ Ошибка загрузки:", err.message);
          } else {
            console.log("✅ Загружено:", result.secure_url);
            file.cdnUrl = result.secure_url;
          }
          cb(null, file);
        }
      )
      .end(file.contents);
  });
}

export function uploadAssetsToCDN() {
  const mapping = {};

  return gulp
    .src(path.src.images)
    .pipe(uploadToCloudinary())
    .pipe(
      through2.obj(function (file, _, cb) {
        if (file.cdnUrl) {
          const fileName = nodePath.basename(file.path);
          mapping[fileName] = file.cdnUrl;
        }
        cb(null, file);
      })
    )
    .on("end", () => {
      fs.writeFileSync("cdn.json", JSON.stringify(mapping, null, 2));
      console.log("📝 cdn.json создан или обновлён");
    });
}
