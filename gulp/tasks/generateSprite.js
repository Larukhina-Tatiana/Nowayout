import fs from "fs";
import path from "path";
import gulp from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";

export const generateSprite = async () => {
  const srcDir = app.path.src.svgsprite.replace("/**/*", ""); // Путь к иконкам
  const spriteFile = path.join(app.path.build.svgsprite, "sprite.svg"); // Куда сохранить спрайт

  try {
    const files = fs
      .readdirSync(srcDir)
      .filter((name) => name.endsWith(".svg"));

    if (files.length === 0) {
      console.warn("⚠️ Нет SVG-иконок для генерации спрайта.");
      return;
    }

    const symbols = files.map((file) => {
      const rawSvg = fs.readFileSync(path.join(srcDir, file), "utf8");

      const viewBox = rawSvg.match(/viewBox="([^"]+)"/)?.[1] || "0 0 24 24";
      const cleanSvg = rawSvg
        .replace(/<\?xml.*?\?>|<!DOCTYPE.*?>/g, "")
        .replace(/<svg[^>]*>|<\/svg>/g, "")
        .replace(/<symbol[^>]*>|<\/symbol>/gi, "") // ← 💥 это удалит лишний <symbol>
        .trim();

      const id = `icon-${path.basename(file, ".svg")}`;
      return `<symbol id="${id}" viewBox="${viewBox}">${cleanSvg}</symbol>`;
    });

    const spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n${symbols.join(
      "\n"
    )}\n</svg>`;

    fs.mkdirSync(app.path.build.svgsprite, { recursive: true });
    fs.writeFileSync(spriteFile, spriteContent);

    console.log(`✅ Спрайт создан: ${spriteFile} (${files.length} иконок)`);
  } catch (error) {
    gulp.src(".").pipe(
      plumber(
        notify.onError({
          title: "generateSprite",
          message: "Ошибка: <%= error.message %>",
        })
      )
    );

    throw error;
  }
};
