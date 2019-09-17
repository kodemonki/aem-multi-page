const gulp = require("gulp");
const { watch, series, parallel } = require("gulp");

const gulpbabel = require("gulp-babel");

const rollup = require("gulp-better-rollup");
const babel = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");

const sass = require("gulp-sass");
const nodeSass = require("node-sass");
sass.compiler = nodeSass;

const concat = require("gulp-concat");
const gap = require("gulp-append-prepend");
const tap = require("gulp-tap");
const browserSync = require("browser-sync").create();

const path = require("path");
const fs = require("fs");

const src = "src/";
const dest = "build/";

const isWin = process.platform === "win32";

let componentListJs = null;
let componentListNames = [];

let compileSass = () => {
  return gulp
    .src(src + "styles/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("styles.css"))
    .pipe(gulp.dest(dest + "css/"));
};

let copyComponents = () => {
  componentListJs = "let allComponents = [];\r\n";
  return gulp
    .src([src + "pages/**/*.js", src + "components/**/*.js"])
    .pipe(
      tap(function(file, t) {
        let fp = path.dirname(file.path);
        let arr = [];
        if (isWin === false) {
          arr = fp.split("/");
        } else {
          arr = fp.split("\\");
        }
        let folder = arr[arr.length - 1];
        componentListNames.push(folder);
        componentListJs +=
          "allComponents['" + folder + "'] = " + folder + ";\r\n";
      })
    )
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest(dest + "js/"));
};

let appendComponentList = () => {
  return gulp
    .src(dest + "js/bundle.js")
    .pipe(gap.appendText(componentListJs))
    .pipe(gulp.dest(dest + "js/"));
};

let mergeCoreAndComponents = () => {
  return gulp
    .src([src + "imports.js", dest + "js/bundle.js", src + "core/**/*.js"])
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest(dest + "js/"));
};

let rollupModules = () => {
  return gulp
    .src(dest + "js/bundle.js")
    .pipe(
      rollup(
        {
          plugins: [
            babel(),
            resolve(),
            commonjs({
              include: "node_modules/**", // Default: undefined
              extensions: [".js"], // Default: [ '.js' ]
              // if true then uses of `global` won't be dealt with by this plugin
              ignoreGlobal: false, // Default: false
              // if false then skip sourceMap generation for CommonJS modules
              sourceMap: false, // Default: true
              // explicitly specify unresolvable named exports
              namedExports: { react: ["createElement", "Component"] }, // Default: undefined
              ignore: ["conditional-runtime-dependency"]
            })
          ]
        },
        "umd"
      )
    )
    .pipe(gulp.dest(dest + "js/"));
};

let buildTestComponentIndex = done => {
  componentListNames.sort();
  let head =
    '<head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"><link rel="stylesheet" type="text/css" href="css/styles.css"><script>var process = {env: {}};</script></head>';

  let bodyPrefix = "<body>";
  let bodySuffix = '<script src="js/bundle.js"></script></body>';

  let content =
    "<img src='https://www.netbuilder.com/wp-content/uploads/2017/04/NB_LOGO_LANDSCAPE_BLACK_TEXT.png' style='width:100%;max-width:200px;margin-left:20px;margin-top:20px'/>";
  content +=
    "<h3 style='text-align:center'>TestPages</h3><div style='display:flex;flex-wrap:wrap;justify-content:center;width:100%;'>";
  for (let i = 0; i < componentListNames.length; i++) {
    if (componentListNames[i].indexOf("TestPage") > -1) {
      content +=
        "<div style='margin:20px'><a href='/" +
        componentListNames[i] +
        ".html'><button type='button' class='btn btn-primary'>" +
        componentListNames[i] +
        "</button></a></div>";
    }
  }
  content += "</div>";

  content +=
    "<h3 style='text-align:center'>Components</h3><div style='display:flex;flex-wrap:wrap;justify-content:center;width:100%;'>";
  for (let i = 0; i < componentListNames.length; i++) {
    if (componentListNames[i].indexOf("TestPage") === -1) {
      content +=
        "<div style='margin:20px'><a href='/" +
        componentListNames[i] +
        ".html'><button type='button' class='btn btn-primary'>" +
        componentListNames[i] +
        "</button></a></div>";
    }
  }
  content += "</div>";

  let body = bodyPrefix + content + bodySuffix;
  let html = "<html>" + head + body + "</html>";

  fs.writeFile(dest + "index.html", html, done);
};

let buildTestComponentPages = done => {
  let head =
    '<head><script src="https://unpkg.com/react@16/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script><link rel="stylesheet" type="text/css" href="css/styles.css"><script>var process = {env: {}};</script></head>';

  let bodyPrefix = "<body>";
  let bodySuffix = '<script src="js/bundle.js"></script></body>';

  for (let i = 0; i < componentListNames.length; i++) {
    let content =
      '<div data-component="' +
      componentListNames[i] +
      '" data-props="{}"></div>';
    let body = bodyPrefix + content + bodySuffix;
    let html = "<html>" + head + body + "</html>";

    fs.writeFileSync(dest + componentListNames[i] + ".html", html);
  }

  done();
};

let build = () => {
  return series(
    compileSass,
    copyComponents,
    appendComponentList,
    mergeCoreAndComponents,
    rollupModules,
    buildTestComponentIndex,
    buildTestComponentPages,
    parallel(initBrowser, watchFiles)
  );
};

let rebuild = () => {
  return series(
    compileSass,
    copyComponents,
    appendComponentList,
    mergeCoreAndComponents,
    rollupModules,
    buildTestComponentPages,
    parallel(reloadBrowser, watchFiles)
  );
};

let watchFiles = () => {
  watch(src + "**/*.*", rebuild());
};

let initBrowser = done => {
  browserSync.init({
    server: {
      baseDir: "./" + dest
    }
  });
  done();
};

let reloadBrowser = done => {
  browserSync.reload();
  done();
};

exports.default = build();
