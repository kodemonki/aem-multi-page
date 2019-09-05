const gulp = require("gulp");
const { watch, series } = require("gulp");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const gap = require("gulp-append-prepend");
const tap = require("gulp-tap");
const path = require("path");

let componentList = "let allComponents = [];\r\n";

function copyHtml() {
  return gulp.src("src/index.html").pipe(gulp.dest("build/"));
}

function copyCore() {
  return gulp.src("src/js/core/**.js").pipe(gulp.dest("build/js/"));
}

function copyComponents() {
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
}

function appendComponentList() {
  return gulp
    .src("build/js/components.js")
    .pipe(gap.appendText(componentList))
    .pipe(gulp.dest("build/js/"));
}

function build() {
  return series(copyHtml, copyCore, copyComponents, appendComponentList);
}

function watchFiles() {
  watch("src/**/*.*", build());
}

exports.default = build();
