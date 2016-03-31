var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var concat  = require("gulp-concat");
var cssnano = require("gulp-cssnano");
var data  = require("gulp-data");
var gulp  = require("gulp");
var gutil = require("gulp-util");
var imagemin = require("gulp-imagemin");
var jpegtran = require("imagemin-jpegtran")
var jade = require("gulp-jade");
var sass  = require("gulp-sass");
var uglify = require("gulp-uglify");

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
    // for browsersync
    .pipe(gulp.dest("_site/css/"))
    .pipe(browserSync.stream())
    .on("error", gutil.log);
});

gulp.task("build:images", function () {
  return gulp.src(["_app/img/*"])
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 6,
      use: [jpegtran()]
    }))
    .pipe(gulp.dest("_site/img/"))
    .on("error", gutil.log);
});

gulp.task("build:js", function () {
  return gulp.src(["_app/js/*"])
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("_site/js/"))
    .on("error", gutil.log);
});

gulp.task("build:vendor:js", function () {
  return gulp.src(["bower_components/picturefill/dist/picturefill.min.js"])
    .pipe(gulp.dest("_site/js/"))
    .on("error", gutil.log);
});

gulp.task("build:jade", function () {
  return gulp.src(["_app/jade/**/*.jade","!_app/jade/**/_*.jade"])
    .pipe(data(function(file) {
      return require("./_config.json");
    }))
    .pipe(jade())
    .pipe(gulp.dest("_site"))
    .on("error", gutil.log);
});

gulp.task("build:styles:vendor", function () {
  return gulp.src([
    "bower_components/pure/pure-min.css",
    "bower_components/pure/grids-responsive-min.css",
    "bower_components/pure/grids-responsive-old-ie-min.css",
  ])
  .pipe(gulp.dest("_site/css/"));
});

gulp.task("build", ["build:js", "build:vendor:js", "build:images", "build:styles", "build:jade", "build:styles:vendor"], function () {
  // nop
});

gulp.task("serve", ["build"], function () {
  browserSync.init({
    server: {
      baseDir: "./_site",
    }
  });
  gulp.watch("_config.json",["build:jade"]);
  gulp.watch("_app/css/**/*.scss",["build:styles"]);
  gulp.watch("_app/js/**/*.js",["build:js",browserSync.reload]);
  gulp.watch("_app/jade/**/*.jade",["build:jade",browserSync.reload]);
  gulp.watch(["**/*.html","!_site/**/*"],["build:jade",browserSync.reload]);
});
