const gulp = require("gulp");
const { watch, series, parallel } = require("gulp");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const gap = require("gulp-append-prepend");
const tap = require("gulp-tap");
const path = require("path");
const browserSync = require("browser-sync").create();

let componentList = null;

let copyHtml = () => {
  return gulp.src("src/index.html").pipe(gulp.dest("build/"));
};

let copyCore = () => {
  return gulp.src("src/js/core/**.js").pipe(gulp.dest("build/js/"));
};

let copyComponents = () => {
  componentList = "let allComponents = [];\r\n";
  return gulp
    .src("src/js/components/**/*.js")
    .pipe(
      tap(function(file, t) {
        let fp = path.dirname(file.path);
        let arr = fp.split("/");
        let folder = arr[arr.length - 1];
        componentList +=
          "allComponents['" + folder + "'] = " + folder + ";\r\n";
      })
    )
    .pipe(
      babel({
        plugins: ["transform-react-jsx"]
      })
    )
    .pipe(concat("components.js"))
    .pipe(gulp.dest("build/js/"));
};

let appendComponentList = () => {
  return gulp
    .src("build/js/components.js")
    .pipe(gap.appendText(componentList))
    .pipe(gulp.dest("build/js/"));
};

let build = () => {
  return series(
    parallel(copyHtml, copyCore, copyComponents),
    appendComponentList,
    parallel(initBrowser, watchFiles)
  );
};

let rebuild = () => {
  return series(
    parallel(copyHtml, copyCore, copyComponents),
    appendComponentList,
    parallel(reloadBrowser, watchFiles)
  );
};

let watchFiles = () => {
  watch("src/**/*.*", rebuild());
};

let initBrowser = done => {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });
  done();
};

let reloadBrowser = done => {
  browserSync.reload();
  done();
};

exports.default = build();
