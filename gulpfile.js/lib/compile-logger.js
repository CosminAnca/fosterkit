const log = require("fancy-log");
const colors = require("ansi-colors");
const PluginError = require("plugin-error");
const prettifyTime = require("./prettify-time");
const handleErrors = require("./handle-errors");

module.exports = function (err, stats) {
  if (err) {
    throw new PluginError("webpack", err);
  }

  let statColor = stats.compilation.warnings.length < 1 ? "green" : "yellow";

  if (stats.compilation.errors.length > 0) {
    stats.compilation.errors.forEach(function (error) {
      handleErrors(error);
      statColor = "red";
    });
  } else {
    const compileTime = prettifyTime(stats.endTime - stats.startTime);
    log(colors[statColor](stats));
    log(
      "Compiled with",
      colors.cyan("webpack"),
      "in",
      colors.magenta(compileTime)
    );
  }
};
