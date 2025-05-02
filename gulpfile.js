import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";

const sass = gulpSass(dartSass);

const compileSass = () => {
  return gulp
    .src("src/assets/sass/**/*.scss", { encoding: false })
    .pipe(
      sass.sync({ includePaths: ["node_modules"] }).on("error", sass.logError)
    )
    .pipe(gulp.dest("dist/assets/css"));
};

export default compileSass;