(function () {
  "use strict";

  var gulp = require("gulp");
  var bump = require("gulp-bump");
  var concat = require("gulp-concat");
  var folders = require('gulp-folders');
  var html2js = require("gulp-html2js");
  var jshint = require("gulp-jshint");
  var gutil = require("gulp-util");
  var rename = require("gulp-rename");
  var rimraf = require("gulp-rimraf");
  var uglify = require("gulp-uglify");
  var path = require("path");
  var runSequence = require("run-sequence");
  var factory = require("widget-tester").gulpTaskFactory;

  var jsFiles = [
    "src/**/*.js",
    "test/**/*.js",
  ];

  gulp.task("clean-dist", function () {
    return gulp.src("dist", {read: false})
      .pipe(rimraf());
  });

  gulp.task("clean-tmp", function () {
    return gulp.src("tmp", {read: false})
      .pipe(rimraf());
  });

  gulp.task("clean", ["clean-dist", "clean-tmp"]);

  gulp.task("config", function() {
    var env = process.env.NODE_ENV || "dev";
    gutil.log("Environment is", env);

    return gulp.src(["./src/config/" + env + ".js"])
      .pipe(rename("config.js"))
      .pipe(gulp.dest("./src/config"));
  });

  // Defined method of updating:
  // Semantic
  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
    .pipe(bump({type:"patch"}))
    .pipe(gulp.dest("./"));
  });

  gulp.task("lint", function() {
    return gulp.src(jsFiles)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"));
    // .pipe(jshint.reporter("fail"));
  });

  gulp.task("i18n", function() {
    return gulp.src("src/locales/**/*.json")
    .pipe(gulp.dest("dist/locales"));
  });

  gulp.task("css", function() {
    return gulp.src("src/**/*.css")
    .pipe(gulp.dest("dist/css"))
  });

  gulp.task("js-prep", function (cb) {
    return gulp.src("src/*.js")
      .pipe(gulp.dest("dist"));
  });

  gulp.task("js-folder-prep", folders("src", function(folder) {
    if (folder === "config")
      return gulp.src("src/config/config.js")
        .pipe(gulp.dest("dist"));
    else
      return gulp.src(path.join("src", folder, "*.js"))
        .pipe(concat(folder + ".js"))
        .pipe(gulp.dest("dist"));
  }));

  gulp.task("js-concat", ["js-prep", "js-folder-prep"], function (cb) {
    return gulp.src("dist/**/*.js")
      .pipe(concat("all.js"))
      .pipe(gulp.dest("dist"));
  });

  gulp.task("js-uglify", ["js-concat"], function () {
    gulp.src("dist/all.js")
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist"));
  });

  gulp.task("build", function (cb) {
    runSequence(["clean", "config", "lint"], ["js-uglify", "i18n", "css"], cb);
  });

  gulp.task("e2e:server", factory.testServer());
  gulp.task("e2e:server-close", factory.testServerClose());
  gulp.task("test:e2e", factory.testE2E());
  gulp.task("metrics", factory.metrics());

  gulp.task("test", ["build"], function (cb) {
    return runSequence("e2e:server", "test:e2e", "e2e:server-close", "metrics", cb);
  });

  gulp.task("default", ["build"]);

})();
