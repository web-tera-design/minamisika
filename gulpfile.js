import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import { deleteSync } from "del";
import browserSync from "browser-sync";

const sass = gulpSass(dartSass);

export const clean = (done) => {
  try {
    const deletedPaths = deleteSync(["dist"], { force: true });
    console.log("クリーンアップが完了しました。削除されたパス:", deletedPaths);
    done();
  } catch (error) {
    console.error("クリーンアップ中にエラーが発生しました:", error);
    done(error);
  }
};

const compileSass = () => {
  return gulp
    .src("src/assets/sass/**/*.scss", { encoding: false })
    .pipe(
      sass.sync({ includePaths: ["node_modules"] }).on("error", sass.logError)
    )
    .pipe(gulp.dest("dist/assets/css"));
};

const copyHTML = () => gulp.src("src/**/*.html").pipe(gulp.dest("dist"));
const copyImg = () =>
  gulp
    .src("src/**/*.{ico,gif,jpg,jpeg,png,svg,webp,avif,webmanifest}")
    .pipe(gulp.dest("dist"));

const browserInit = (done) => {
  browserSync.init({ server: { baseDir: "dist" }, port: 3000 });
  done();
};
const browserReload = (done) => {
  browserSync.reload();
  done();
};
const watchTask = () => {
  gulp.watch(
    "src/**/*.{ico,gif,jpg,jpeg,png,svg,webp,avif,webmanifest}",
    gulp.series(copyImg, browserReload)
  );
  gulp.watch(
    "src/assets/sass/**/*.scss",
    gulp.series(compileSass, browserReload)
  );
  gulp.watch("src/**/*.html", gulp.series(copyHTML, browserReload));
};

export const watch = gulp.series(browserInit, watchTask);
export const build = gulp.series(gulp.parallel(compileSass, copyHTML, copyImg));
export const main = gulp.series(clean, build, watch);
export default main;
