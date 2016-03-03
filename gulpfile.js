var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var concat  = require("gulp-concat");
var cssnano = require("gulp-cssnano");
var gulp  = require("gulp");
var gutil = require("gulp-util");
var imagemin = require("gulp-imagemin");
var sass  = require("gulp-sass");
var shell = require("gulp-shell");
var uglify = require("gulp-uglify");

var bower_files = ["bower_components/jquery/dist/jquery.js"]

// Build styles. Only uses main.scss
gulp.task("build:styles", function () {
  return gulp.src("_app/css/main.scss")
    .pipe(sass({
      style: "compressed",
      trace: true,
    }).on("error",gutil.log))
    .pipe(autoprefixer({
      browsers: ["last 2 versions", "ie >= 10"],
    }))
    .pipe(cssnano())
    // for jekyll
    .pipe(gulp.dest("css/"))
    // for browsersync
    .pipe(gulp.dest("_site/css/"))
    .pipe(browserSync.stream())
    .on("error", gutil.log);
});

gulp.task("build:images", function () {
  return gulp.src(["_app/img/*"])
    .pipe(imagemin())
    .pipe(gulp.dest("img/"))
    .pipe(gulp.dest("_site/img/"))
    .on("error", gutil.log);
});

gulp.task("build:scripts", function () {
  return gulp.src(["_app/js/*"])
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("js/"))
    .pipe(gulp.dest("_site/js/"))
    .on("error", gutil.log);
});

gulp.task("build:jekyll", function () {
  return gulp.src(".")
    .pipe(shell("jekyll build"))
    .on("error", gutil.log);
});

gulp.task("bs:reload", function () {
  browserSync.reload();
});

gulp.task("build", ["build:scripts", "build:images", "build:styles", "build:jekyll"], function () {
  // nop
});

gulp.task("serve", ["build"], function () {
  browserSync.init({
    server: "./_site",
  });
  gulp.watch("_config.yml",["build:jekyll"]);
  gulp.watch("_app/css/**/*.scss",["build:styles"]);
  gulp.watch("_app/js/**/*.js",["build:scripts","bs:reload"]);
  gulp.watch("_posts/**/*",["build:jekyll","bs:reload"]);
  gulp.watch(["**/*.html","!_site/**/*"],["build:jekyll","bs:reload"]);
});
