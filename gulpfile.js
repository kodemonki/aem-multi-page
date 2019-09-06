const gulp = require("gulp");
const { watch, series, parallel } = require("gulp");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const gap = require("gulp-append-prepend");
const tap = require("gulp-tap");
const browserSync = require("browser-sync").create();

const path = require("path");
var fs = require("fs");

const src = "src/";
const dest = "build/";
const pages = "pages/";

let componentListJs = null;
let componentListNames = [];
let partsDone = 0;

let copyCore = () => {
  return gulp.src(src + "js/core/**.js").pipe(gulp.dest(dest + "js/"));
};

let copyComponents = () => {
  componentListJs = "let allComponents = [];\r\n";
  return gulp
    .src(src + "js/components/**/*.js")
    .pipe(
      tap(function(file, t) {
        let fp = path.dirname(file.path);
        let arr = fp.split("/");
        let folder = arr[arr.length - 1];
        componentListNames.push(folder);
        componentListJs +=
          "allComponents['" + folder + "'] = " + folder + ";\r\n";
      })
    )
    .pipe(
      babel({
        plugins: ["transform-react-jsx"]
      })
    )
    .pipe(concat("components.js"))
    .pipe(gulp.dest(dest + "js/"));
};

let appendComponentList = () => {
  return gulp
    .src(dest + "js/components.js")
    .pipe(gap.appendText(componentListJs))
    .pipe(gulp.dest(dest + "js/"));
};

let build = () => {
  return series(
    parallel(copyCore, copyComponents),
    appendComponentList,
    buildTestComponentIndex,
    buildTestComponentPages,
    parallel(initBrowser, watchFiles)
  );
};

let rebuild = () => {
  return series(
    parallel(copyCore, copyComponents),
    appendComponentList,
    buildTestComponentPages,
    parallel(reloadBrowser, watchFiles)
  );
};

let buildTestComponentIndex = done => {
  componentListNames.sort();
  let head =
    '<head><script src="https://unpkg.com/react@16/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></head>';

  let bodyPrefix = "<body>";
  let bodySuffix =
    '<script src="js/components.js"></script><script src="js/reactRenderer.js"></script></body>';

  let content =
    "<h1 style='text-align:center'>Components</h2><div style='display:flex;flex-wrap:wrap;justify-content:center;width:100%;'>";
  for (let i = 0; i < componentListNames.length; i++) {
    content +=
      "<div style='margin:20px'><a href='/" +
      pages +
      componentListNames[i] +
      ".html'><button type='button' class='btn btn-primary'>" +
      componentListNames[i] +
      "</button></a></div>";
  }
  content += "</div>";

  let body = bodyPrefix + content + bodySuffix;
  let html = "<html>" + head + body + "</html>";

  fs.writeFile(dest + "index.html", html, done);
};

let buildTestComponentPages = done => {
  partsDone = 0;
  let head =
    '<head><script src="https://unpkg.com/react@16/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script></head>';

  let bodyPrefix = "<body>";
  let bodySuffix =
    '<script src="../js/components.js"></script><script src="../js/reactRenderer.js"></script></body>';

  for (let i = 0; i < componentListNames.length; i++) {
    let content =
      '<div data-component="' +
      componentListNames[i] +
      '" data-props="{}"></div>';
    let body = bodyPrefix + content + bodySuffix;
    let html = "<html>" + head + body + "</html>";
    if (!fs.existsSync(dest + pages)) {
      fs.mkdirSync(dest + pages, 0744);
    }
    fs.writeFileSync(dest + pages + componentListNames[i] + ".html", html);
  }

  done();
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
