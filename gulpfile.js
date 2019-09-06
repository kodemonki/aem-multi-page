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
    '<head><script src="https://unpkg.com/react@16/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script></head>';

  let bodyPrefix = "<body>";
  let bodySuffix =
    '<script src="js/components.js"></script><script src="js/reactRenderer.js"></script></body>';

  let content =
    "<h1>Components</h2><table border='1' cellpadding='10' cellspacing='10'>";
  for (let i = 0; i < componentListNames.length; i++) {
    content +=
      "<tr><td><a href='/" +
      pages +
      componentListNames[i] +
      ".html'>" +
      componentListNames[i] +
      "</a></td></tr>";
  }
  content += "</table>";

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
