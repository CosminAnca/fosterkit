/* global TASK_CONFIG */
const fs = require("fs");
const gulp = require("gulp");
const log = require("fancy-log");
const colors = require("ansi-colors");
const projectPath = require("../lib/project-path");
const rename = require("gulp-rename");
const merge = require("merge-stream");
const path = require("path");
const pkg = require(projectPath("package.json"));

function initTask() {
  const dotfilesStream = gulp
    .src(["extras/dotfiles/**/*", "!extras/dotfiles/*.txt"], { dot: true })
    .pipe(gulp.dest(projectPath()));

  const renameGitIgnore = gulp
    .src(["extras/dotfiles/gitignore.txt"])
    .pipe(rename(".gitignore"))
    .pipe(gulp.dest(projectPath()));

  const renameEditorConfig = gulp
    .src(["extras/dotfiles/editorconfig.txt"])
    .pipe(rename(".editorconfig"))
    .pipe(gulp.dest(projectPath()));

  const configStream = gulp
    .src(["gulpfile.js/nucleum.config.js"])
    .pipe(gulp.dest(projectPath()));

  const srcStream = gulp
    .src(["src/**/*", "*.gitkeep"])
    .pipe(gulp.dest(projectPath(TASK_CONFIG.basePaths.src)));

  // Setup the script rules
  pkg.scripts = {
    dev: "yarn nucleum",
    build: "yarn nucleum build",
  };

  // Setup browserslist config
  pkg.browserslist = [">0.5%", "not dead", "ie >= 11", "not op_mini all"];

  // Update the package.json file
  fs.writeFileSync(
    path.join(projectPath(), "package.json"),
    JSON.stringify(pkg, null, 2)
  );

  log(colors.green("Generating default Nucleum project files"));
  log(
    colors.yellow(`
    To start the dev server run:
  `),
    colors.magenta(`
    yarn dev
  `)
  );

  return merge(
    dotfilesStream,
    renameGitIgnore,
    renameEditorConfig,
    configStream,
    srcStream
  );
}

initTask.displayName = "init";
gulp.task(initTask);
